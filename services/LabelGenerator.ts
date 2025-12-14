import jsPDF from 'jspdf';

export interface ShipmentData {
    id: string;
    senderName: string;
    senderAddress: string;
    senderCity: string;
    senderState: string;
    senderCep: string;
    senderCpfCnpj?: string;
    recipientName: string;
    recipientAddress: string;
    recipientCity: string;
    recipientState: string;
    recipientCep: string;
    recipientCpfCnpj?: string;
    weight: number;
    height: number;
    width: number;
    length: number;
    declaredValue?: number;
    carrier: string;
    price: number;
    deliveryTime: number;
    contentDescription?: string;
    contentQuantity?: number;
    trackingCode?: string;
    createdAt: Date | string;
}

export class LabelGenerator {
    static generate(shipment: ShipmentData, type: 'label' | 'declaration' | 'both' = 'both', senderProfile?: any): void {
        const doc = new jsPDF();

        // Overlay profile data if provided (fixes missing DB data)
        const finalShipment = { ...shipment };
        if (senderProfile) {
            finalShipment.senderName = senderProfile.name || finalShipment.senderName;

            // Handle location - Try to extract City and State
            if (senderProfile.location) {
                // Split by - or ,
                const parts = senderProfile.location.split(/[-–,]/).map((p: string) => p.trim());

                // Logic: Try to find a part that is exactly 2 chars (State)
                const statePart = parts.find(p => p.length === 2 && /^[A-Z]{2}$/i.test(p));

                if (statePart) {
                    finalShipment.senderState = statePart.toUpperCase();
                    // City is everything else
                    finalShipment.senderCity = parts.filter(p => p !== statePart).join(' ');
                } else if (parts.length >= 2) {
                    // Fallback: assume last part is State if short, or just City - Country
                    // If "Sao Paulo, Brasil", City=Sao Paulo, State=Brasil (User needs to fix profile)
                    finalShipment.senderCity = parts[0];
                    finalShipment.senderState = parts[1].substring(0, 2).toUpperCase(); // Truncate to 2 chars just in case
                } else {
                    finalShipment.senderCity = senderProfile.location;
                    finalShipment.senderState = '';
                }
            }

            finalShipment.senderCep = senderProfile.cep || finalShipment.senderCep;

            // Remove backend placeholder if it persists and we don't have a real address
            // The placeholder in sale.controller.ts is 'Av. Paulista, 1000'
            if (finalShipment.senderAddress === 'Av. Paulista, 1000') {
                finalShipment.senderAddress = ''; // Clear it so it doesn't show fake info
            }
        }

        if (type === 'label' || type === 'both') {
            this.generateShippingLabel(doc, finalShipment);
        }

        if (type === 'declaration' || type === 'both') {
            if (type === 'both') doc.addPage();
            this.generateContentDeclaration(doc, finalShipment);
        }

        // Download
        const suffix = type === 'both' ? 'completo' : type;
        const filename = `envio-${suffix}-${finalShipment.carrier}-${new Date().getTime()}.pdf`;
        doc.save(filename);
    }

    private static generateShippingLabel(doc: jsPDF, shipment: ShipmentData) {
        const pageWidth = doc.internal.pageSize.getWidth();

        // Cabeçalho
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('ETIQUETA DE ENVIO', pageWidth / 2, 20, { align: 'center' });

        // Linha divisória
        doc.setLineWidth(0.5);
        doc.line(20, 25, pageWidth - 20, 25);

        // REMETENTE
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('REMETENTE:', 20, 40);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(shipment.senderName || '', 20, 48);
        doc.text(shipment.senderAddress || '', 20, 54);
        doc.text(`${shipment.senderCity || ''} - ${shipment.senderState || ''}`, 20, 60);
        doc.text(`CEP: ${shipment.senderCep}`, 20, 66);
        if (shipment.senderCpfCnpj) {
            doc.text(`CPF/CNPJ: ${shipment.senderCpfCnpj}`, 20, 72);
        }

        // Linha divisória
        doc.setLineWidth(0.3);
        doc.line(20, 80, pageWidth - 20, 80);

        // DESTINATÁRIO (destaque)
        doc.setFillColor(240, 240, 240);
        doc.rect(15, 85, pageWidth - 30, 50, 'F');

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('DESTINATÁRIO:', 20, 95);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(shipment.recipientName, 20, 105);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(shipment.recipientAddress, 20, 112);
        doc.text(`${shipment.recipientCity} - ${shipment.recipientState}`, 20, 119);
        doc.text(`CEP: ${shipment.recipientCep}`, 20, 126);

        // Código de rastreamento (se houver)
        if (shipment.trackingCode) {
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text(`Rastreamento: ${shipment.trackingCode}`, pageWidth / 2, 150, { align: 'center' });
        }

        // Transportadora (destaque)
        doc.setFillColor(33, 150, 243);
        doc.rect(15, 160, pageWidth - 30, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text(shipment.carrier.toUpperCase(), pageWidth / 2, 173, { align: 'center' });
        doc.setTextColor(0, 0, 0);

        // Informações do pacote
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const infoY = 195;
        doc.text(`Peso: ${shipment.weight}kg`, 20, infoY);
        doc.text(`Dimensões: ${shipment.length}x${shipment.width}x${shipment.height}cm`, 20, infoY + 6);
        doc.text(`Valor do Frete: R$ ${shipment.price.toFixed(2)}`, 20, infoY + 12);
        doc.text(`Prazo: ${shipment.deliveryTime} dias úteis`, 20, infoY + 18);

        if (shipment.declaredValue) {
            doc.text(`Valor Declarado: R$ ${shipment.declaredValue.toFixed(2)}`, 20, infoY + 24);
        }

        // Rodapé
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('InflueTech - Sistema de Gestão de Envios', pageWidth / 2, 280, { align: 'center' });
        doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, 285, { align: 'center' });
    }

    private static generateContentDeclaration(doc: jsPDF, shipment: ShipmentData) {
        const MARGIN = 10;
        const FULL_WIDTH = 190; // A4 width (~210) - 2*MARGIN
        const HALF_WIDTH = FULL_WIDTH / 2;
        let y = 10;

        // --- HEADER ---
        doc.setLineWidth(0.5);
        doc.rect(MARGIN, y, FULL_WIDTH, 10);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('DECLARAÇÃO DE CONTEÚDO', MARGIN + (FULL_WIDTH / 2), y + 7, { align: 'center' });
        y += 12;

        // --- COLUMNS: REMETENTE | DESTINATÁRIO ---
        const ROW_H = 35;

        // Headers
        doc.setFillColor(240, 240, 240);
        // Remetente Box
        doc.rect(MARGIN, y, HALF_WIDTH, 5); // Header Box
        doc.setFontSize(10);
        doc.text('REMETENTE', MARGIN + (HALF_WIDTH / 2), y + 3.5, { align: 'center' });

        // Destinatario Box
        doc.rect(MARGIN + HALF_WIDTH + 2, y, HALF_WIDTH - 2, 5); // Header Box (+2 gap)
        doc.text('DESTINATÁRIO', MARGIN + HALF_WIDTH + 2 + (HALF_WIDTH / 2), y + 3.5, { align: 'center' });

        y += 5;

        // --- DATA GRID ---

        // Row 1: Names
        const H_LINE = 7;
        const VALUE_OFFSET = 25; // More space for "NOME:" label to avoid overlap

        // Remetente Name
        doc.rect(MARGIN, y, HALF_WIDTH, H_LINE);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('NOME:', MARGIN + 2, y + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text((shipment.senderName || '').substring(0, 35), MARGIN + VALUE_OFFSET, y + 4);

        // Destinatario Name
        doc.rect(MARGIN + HALF_WIDTH + 2, y, HALF_WIDTH - 2, H_LINE);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('NOME:', MARGIN + HALF_WIDTH + 4, y + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text((shipment.recipientName || '').substring(0, 35), MARGIN + HALF_WIDTH + 4 + VALUE_OFFSET, y + 4);

        y += H_LINE;

        // Row 2: Addresses
        const H_ADDR = 14;
        // Remetente Addr
        doc.rect(MARGIN, y, HALF_WIDTH, H_ADDR);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('ENDEREÇO:', MARGIN + 2, y + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const senderAddr = doc.splitTextToSize(shipment.senderAddress || '', HALF_WIDTH - 5);
        doc.text(senderAddr, MARGIN + 2, y + 9);

        // Dest Addr
        doc.rect(MARGIN + HALF_WIDTH + 2, y, HALF_WIDTH - 2, H_ADDR);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('ENDEREÇO:', MARGIN + HALF_WIDTH + 4, y + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const recAddr = doc.splitTextToSize(shipment.recipientAddress || '', HALF_WIDTH - 7);
        doc.text(recAddr, MARGIN + HALF_WIDTH + 4, y + 9);

        y += H_ADDR;

        // Row 3: City / UF
        const H_CITY = 7;
        // Remetente
        doc.rect(MARGIN, y, HALF_WIDTH - 15, H_CITY); // City
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('CIDADE:', MARGIN + 2, y + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(shipment.senderCity || '', MARGIN + 16, y + 4);

        doc.rect(MARGIN + HALF_WIDTH - 15, y, 15, H_CITY); // UF
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('UF:', MARGIN + HALF_WIDTH - 13, y + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(shipment.senderState || '', MARGIN + HALF_WIDTH - 7, y + 4);

        // Destinatario
        // Fix: Right column width is (HALF_WIDTH - 2). Total width starting at (MARGIN + HALF_WIDTH + 2).
        // City width = Total Right Width - UF Width (15).
        // Total Right Width = 93.
        // City Width = 93 - 15 = 78.
        doc.rect(MARGIN + HALF_WIDTH + 2, y, HALF_WIDTH - 17, H_CITY); // City
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('CIDADE:', MARGIN + HALF_WIDTH + 4, y + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(shipment.recipientCity || '', MARGIN + HALF_WIDTH + 18, y + 4);

        // FIX X-COORD HERE:
        // UF Box Start = (MARGIN + HALF_WIDTH + 2) + (HALF_WIDTH - 17) = MARGIN + 2*HALF_WIDTH - 15.
        // MARGIN(10) + 190 - 15 = 185.
        doc.rect(MARGIN + FULL_WIDTH - 15, y, 15, H_CITY); // UF (Corrected X)
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('UF:', MARGIN + FULL_WIDTH - 13, y + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(shipment.recipientState || '', MARGIN + FULL_WIDTH - 7, y + 4);

        y += H_CITY;

        // Row 4: CEP / CPF
        // Remetente
        doc.rect(MARGIN, y, 35, H_CITY); // CEP
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('CEP:', MARGIN + 2, y + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(shipment.senderCep || '', MARGIN + 10, y + 4);

        doc.rect(MARGIN + 35, y, HALF_WIDTH - 35, H_CITY); // CPF
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('CPF/CNPJ:', MARGIN + 37, y + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(shipment.senderCpfCnpj || '', MARGIN + 55, y + 4);

        // Destinatario
        doc.rect(MARGIN + HALF_WIDTH + 2, y, 35, H_CITY); // CEP
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('CEP:', MARGIN + HALF_WIDTH + 4, y + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(shipment.recipientCep || '', MARGIN + HALF_WIDTH + 12, y + 4);

        doc.rect(MARGIN + HALF_WIDTH + 2 + 35, y, HALF_WIDTH - 37, H_CITY); // CPF
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('CPF/CNPJ:', MARGIN + HALF_WIDTH + 39, y + 4);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(shipment.recipientCpfCnpj || '', MARGIN + HALF_WIDTH + 57, y + 4);

        y += H_CITY + 5; // Spacing

        // --- IDENTIFICAÇÃO DOS BENS ---
        doc.rect(MARGIN, y, FULL_WIDTH, 7);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('IDENTIFICAÇÃO DOS BENS', MARGIN + (FULL_WIDTH / 2), y + 5, { align: 'center' });
        y += 7;

        // Header
        const COL_ITEM = 10;
        const COL_CONT = 110;
        const COL_QTD = 20;
        const COL_VAL = FULL_WIDTH - (COL_ITEM + COL_CONT + COL_QTD); // Remainder

        doc.rect(MARGIN, y, COL_ITEM, 7);
        doc.text('ITEM', MARGIN + (COL_ITEM / 2), y + 5, { align: 'center' });

        doc.rect(MARGIN + COL_ITEM, y, COL_CONT, 7);
        doc.text('CONTEÚDO', MARGIN + COL_ITEM + (COL_CONT / 2), y + 5, { align: 'center' });

        doc.rect(MARGIN + COL_ITEM + COL_CONT, y, COL_QTD, 7);
        doc.text('QUANT.', MARGIN + COL_ITEM + COL_CONT + (COL_QTD / 2), y + 5, { align: 'center' });

        doc.rect(MARGIN + COL_ITEM + COL_CONT + COL_QTD, y, COL_VAL, 7);
        doc.text('VALOR', MARGIN + COL_ITEM + COL_CONT + COL_QTD + (COL_VAL / 2), y + 5, { align: 'center' });

        y += 7;

        // Content Row (Single Item for now)
        const CONTENT_H = 60; // Fixed height for content area
        doc.rect(MARGIN, y, COL_ITEM, CONTENT_H); // Item Col
        doc.setFont('helvetica', 'normal');
        doc.text('1', MARGIN + (COL_ITEM / 2), y + 6, { align: 'center' });

        doc.rect(MARGIN + COL_ITEM, y, COL_CONT, CONTENT_H); // Desc Col
        doc.text((shipment.contentDescription || 'Diversos').substring(0, 60), MARGIN + COL_ITEM + 2, y + 6);

        doc.rect(MARGIN + COL_ITEM + COL_CONT, y, COL_QTD, CONTENT_H); // Qtd Col
        doc.text((shipment.contentQuantity || 1).toString(), MARGIN + COL_ITEM + COL_CONT + (COL_QTD / 2), y + 6, { align: 'center' });

        doc.rect(MARGIN + COL_ITEM + COL_CONT + COL_QTD, y, COL_VAL, CONTENT_H); // Val Col
        doc.text((shipment.declaredValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }), MARGIN + COL_ITEM + COL_CONT + COL_QTD + (COL_VAL / 2), y + 6, { align: 'center' });

        y += CONTENT_H;

        // Totals Grid
        const TOTAL_H = 7;
        // Totais Label
        doc.rect(MARGIN, y, COL_ITEM + COL_CONT, TOTAL_H);
        doc.setFont('helvetica', 'bold');
        doc.text('TOTAIS', MARGIN + (COL_ITEM + COL_CONT) - 2, y + 5, { align: 'right' });

        // Total Qtd
        doc.rect(MARGIN + COL_ITEM + COL_CONT, y, COL_QTD, TOTAL_H);
        doc.text((shipment.contentQuantity || 1).toString(), MARGIN + COL_ITEM + COL_CONT + (COL_QTD / 2), y + 5, { align: 'center' });

        // Total Val
        doc.rect(MARGIN + COL_ITEM + COL_CONT + COL_QTD, y, COL_VAL, TOTAL_H);
        doc.text((shipment.declaredValue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 }), MARGIN + COL_ITEM + COL_CONT + COL_QTD + (COL_VAL / 2), y + 5, { align: 'center' });

        y += TOTAL_H;

        // Peso Total
        doc.rect(MARGIN, y, COL_ITEM + COL_CONT + COL_QTD, TOTAL_H); // Spacer
        doc.setFillColor(200, 200, 200); // Gray filler
        doc.rect(MARGIN, y, COL_ITEM + COL_CONT + COL_QTD, TOTAL_H, 'F'); // Gray filler
        doc.setFillColor(255, 255, 255); // Reset

        doc.text('PESO TOTAL (kg)', MARGIN + (COL_ITEM + COL_CONT + COL_QTD) - 2, y + 5, { align: 'right' });

        doc.rect(MARGIN + COL_ITEM + COL_CONT + COL_QTD, y, COL_VAL, TOTAL_H);
        doc.text(shipment.weight.toFixed(3), MARGIN + COL_ITEM + COL_CONT + COL_QTD + (COL_VAL / 2), y + 5, { align: 'center' });

        y += TOTAL_H + 5;

        // --- DECLARAÇÃO LEGAL ---
        doc.rect(MARGIN, y, FULL_WIDTH, 45); // Legal Box
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('DECLARAÇÃO', MARGIN + (FULL_WIDTH / 2), y + 6, { align: 'center' });

        const legalText = "Declaro que não me enquadro no conceito de contribuinte previsto no art. 4º da Lei Complementar nº 87/1996, uma vez que não realizo, com habitualidade ou em volume que caracterize intuito comercial, operações de circulação de mercadoria, ainda que se iniciem no exterior, ou estou dispensado da emissão da nota fiscal por força da legislação tributária vigente, responsabilizando-me, nos termos da lei e a quem de direito, por informações inverídicas.\n\n" +
            "Declaro que não envio objeto que ponha em risco o transporte aéreo, nem objeto proibido no fluxo postal, assumindo responsabilidade pela informação prestada, e ciente de que o descumprimento pode configurar crime, conforme artigo 261 do Código Penal Brasileiro. Declaro, ainda, estar ciente da lista de proibições e restrições, disponível no site dos Correios.";

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text(legalText, MARGIN + 2, y + 12, { maxWidth: FULL_WIDTH - 4, align: 'justify' });

        y += 50;

        // --- ASSINATURA ---
        const SIGN_LINE_W = 80;
        const CityStr = (shipment.senderCity || '____________________');
        const DateStr = new Date().toLocaleDateString('pt-BR');

        doc.setFontSize(10);
        doc.text(`${CityStr},        de  ____________________  de 20___`, MARGIN + 5, y + 5);

        doc.line(MARGIN + 110, y + 5, MARGIN + 110 + SIGN_LINE_W, y + 5);
        doc.setFontSize(8);
        doc.text('Assinatura do Declarante/Remetente', MARGIN + 110 + (SIGN_LINE_W / 2), y + 9, { align: 'center' });

        y += 15;
        // Observação Box
        doc.rect(MARGIN, y, FULL_WIDTH, 16);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVAÇÃO:', MARGIN + 2, y + 4);
        doc.setFont('helvetica', 'normal');
        doc.text('Constitui crime contra a ordem tributária suprimir ou reduzir tributo, ou contribuição social e qualquer acessório (Lei 8.137/90 Art. 1º, V).', MARGIN + 2, y + 9, { maxWidth: FULL_WIDTH - 4 });
    }
}

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
    static generate(shipment: ShipmentData): void {
        const doc = new jsPDF();

        // PÁGINA 1: Etiqueta de Envio
        this.generateShippingLabel(doc, shipment);

        // PÁGINA 2: Declaração de Conteúdo
        doc.addPage();
        this.generateContentDeclaration(doc, shipment);

        // Download
        const filename = `etiqueta-${shipment.carrier}-${new Date().getTime()}.pdf`;
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
        doc.text(shipment.senderName, 20, 48);
        doc.text(shipment.senderAddress, 20, 54);
        doc.text(`${shipment.senderCity} - ${shipment.senderState}`, 20, 60);
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
        const pageWidth = doc.internal.pageSize.getWidth();

        // Cabeçalho
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('DECLARAÇÃO DE CONTEÚDO', pageWidth / 2, 20, { align: 'center' });

        // Linha divisória
        doc.setLineWidth(0.5);
        doc.line(20, 25, pageWidth - 20, 25);

        // Informações do envio
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('DADOS DO ENVIO:', 20, 40);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const createdDate = typeof shipment.createdAt === 'string'
            ? new Date(shipment.createdAt)
            : shipment.createdAt;
        doc.text(`Data: ${createdDate.toLocaleDateString('pt-BR')}`, 20, 48);
        doc.text(`ID: ${shipment.id}`, 20, 54);
        doc.text(`Transportadora: ${shipment.carrier}`, 20, 60);

        // Descrição do conteúdo
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('CONTEÚDO:', 20, 80);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(shipment.contentDescription || 'Não especificado', 20, 88);
        doc.text(`Quantidade: ${shipment.contentQuantity || 1} unidade(s)`, 20, 94);
        doc.text(`Valor Declarado: R$ ${(shipment.declaredValue || 0).toFixed(2)}`, 20, 100);

        // Declaração
        doc.setFillColor(255, 243, 205);
        doc.rect(15, 115, pageWidth - 30, 60, 'F');

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('DECLARAÇÃO:', 20, 125);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Declaro que:', 20, 135);
        doc.text('• O conteúdo declarado é verdadeiro e corresponde ao que está sendo enviado', 25, 143);
        doc.text('• Não contém itens proibidos, perigosos ou ilícitos', 25, 150);
        doc.text('• Estou ciente das responsabilidades legais sobre o conteúdo declarado', 25, 157);
        doc.text('• As informações de valor são precisas para fins de seguro', 25, 164);

        // Assinatura
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('ASSINATURA DO REMETENTE:', 20, 195);

        doc.setLineWidth(0.3);
        doc.line(20, 220, 100, 220);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Assinatura', 20, 225);

        doc.line(120, 220, 180, 220);
        doc.text('Data', 120, 225);

        // Informações do remetente
        doc.setFontSize(9);
        doc.text(`Nome: ${shipment.senderName}`, 20, 235);
        if (shipment.senderCpfCnpj) {
            doc.text(`CPF/CNPJ: ${shipment.senderCpfCnpj}`, 20, 241);
        }

        // Rodapé
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('InflueTech - Sistema de Gestão de Envios', pageWidth / 2, 280, { align: 'center' });
        doc.text('Este documento tem validade legal para fins de declaração de conteúdo', pageWidth / 2, 285, { align: 'center' });
    }
}

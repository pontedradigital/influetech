import React from 'react';

interface ShippingLabelGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    data: {
        sender: {
            name: string;
            address: string;
            city: string;
            state: string;
            cep: string;
            cpfCnpj?: string;
        };
        recipient: {
            name: string;
            address: string;
            city: string;
            state: string;
            cep: string;
            cpfCnpj?: string;
        };
        product: {
            name: string;
            value: number;
            quantity: number;
        };
        serviceType: string; // PAC, SEDEX, etc.
        trackingCode?: string;
    };
}

export default function ShippingLabelGenerator({ isOpen, onClose, data }: ShippingLabelGeneratorProps) {
    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm print:bg-white print:static print:block">
            <div className="bg-white dark:bg-gray-800 w-full max-w-4xl h-[90vh] overflow-y-auto shadow-2xl print:shadow-none print:w-full print:h-auto print:overflow-visible">
                {/* Header - Hidden on Print */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10 print:hidden">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Etiqueta de Envio + Declaração</h2>
                    <div className="flex gap-2">
                        <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary-600">
                            <span className="material-symbols-outlined">print</span> Imprimir
                        </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </div>

                <div className="p-8 print:p-0 space-y-8 print:space-y-4">

                    {/* ETIQUETA DE ENVIO */}
                    <div className="border-2 border-dashed border-gray-300 p-6 print:border-2 print:border-black print:break-inside-avoid">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-24 bg-gray-900 text-white flex items-center justify-center font-bold text-xl print:bg-black print:text-white">
                                    QR CODE
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black uppercase tracking-wider">{data.serviceType}</h1>
                                    <p className="font-mono text-lg">{data.trackingCode || 'PRÉ-POSTAGEM'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm">NF-e: _________</p>
                                <p className="font-bold text-sm">PLP: _________</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="border-t-2 border-gray-300 pt-4 print:border-black">
                                <p className="text-xs font-bold uppercase text-gray-500 print:text-black mb-1">Destinatário</p>
                                <p className="font-bold text-lg">{data.recipient.name}</p>
                                <p className="text-base">{data.recipient.address}</p>
                                <p className="text-base">{data.recipient.city} - {data.recipient.state}</p>
                                <p className="font-bold text-xl mt-1">{data.recipient.cep}</p>
                            </div>

                            <div className="border-t-2 border-gray-300 pt-4 print:border-black">
                                <p className="text-xs font-bold uppercase text-gray-500 print:text-black mb-1">Remetente</p>
                                <p className="font-bold">{data.sender.name}</p>
                                <p className="text-sm">{data.sender.address}</p>
                                <p className="text-sm">{data.sender.city} - {data.sender.state}</p>
                                <p className="font-bold text-sm">{data.sender.cep}</p>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-400 print:hidden">
                            Corte na linha pontilhada e cole na caixa
                        </div>
                    </div>

                    {/* DECLARAÇÃO DE CONTEÚDO */}
                    <div className="border border-gray-300 p-8 print:border print:border-black print:break-before-page">
                        <h2 className="text-center font-bold text-xl mb-6 uppercase border-b-2 border-black pb-2">Declaração de Conteúdo</h2>

                        <div className="grid grid-cols-2 gap-8 mb-6">
                            <div className="border border-black p-4">
                                <h3 className="font-bold uppercase text-sm mb-2 bg-gray-100 p-1 print:bg-gray-200">Remetente</h3>
                                <p><span className="font-bold">Nome:</span> {data.sender.name}</p>
                                <p><span className="font-bold">Endereço:</span> {data.sender.address}</p>
                                <p><span className="font-bold">Cidade/UF:</span> {data.sender.city}/{data.sender.state}</p>
                                <p><span className="font-bold">CEP:</span> {data.sender.cep}</p>
                                <p><span className="font-bold">CPF/CNPJ:</span> {data.sender.cpfCnpj || '_________________'}</p>
                            </div>
                            <div className="border border-black p-4">
                                <h3 className="font-bold uppercase text-sm mb-2 bg-gray-100 p-1 print:bg-gray-200">Destinatário</h3>
                                <p><span className="font-bold">Nome:</span> {data.recipient.name}</p>
                                <p><span className="font-bold">Endereço:</span> {data.recipient.address}</p>
                                <p><span className="font-bold">Cidade/UF:</span> {data.recipient.city}/{data.recipient.state}</p>
                                <p><span className="font-bold">CEP:</span> {data.recipient.cep}</p>
                                <p><span className="font-bold">CPF/CNPJ:</span> {data.recipient.cpfCnpj || '_________________'}</p>
                            </div>
                        </div>

                        <table className="w-full border-collapse border border-black mb-6 text-sm">
                            <thead>
                                <tr className="bg-gray-100 print:bg-gray-200">
                                    <th className="border border-black p-2 text-left">Item</th>
                                    <th className="border border-black p-2 text-left">Conteúdo</th>
                                    <th className="border border-black p-2 text-center">Quant.</th>
                                    <th className="border border-black p-2 text-right">Valor (R$)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-black p-2">1</td>
                                    <td className="border border-black p-2">{data.product.name}</td>
                                    <td className="border border-black p-2 text-center">{data.product.quantity}</td>
                                    <td className="border border-black p-2 text-right">{data.product.value.toFixed(2)}</td>
                                </tr>
                                {/* Empty rows for layout */}
                                {[2, 3].map(i => (
                                    <tr key={i}>
                                        <td className="border border-black p-2">&nbsp;</td>
                                        <td className="border border-black p-2"></td>
                                        <td className="border border-black p-2"></td>
                                        <td className="border border-black p-2"></td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={3} className="border border-black p-2 text-right font-bold">TOTAL</td>
                                    <td className="border border-black p-2 text-right font-bold">{data.product.value.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <div className="text-xs text-justify mb-8">
                            <p>Declaro que não me enquadro no conceito de contribuinte previsto no art. 4º da Lei Complementar nº 87/1996, uma vez que não realizo, com habitualidade ou em volume que caracterize intuito comercial, operações de circulação de mercadoria, ainda que se iniciem no exterior, ou estou dispensado da emissão da nota fiscal por força da legislação tributária vigente, responsabilizando-me, nos termos da lei e a quem de direito, por informações inverídicas.</p>
                            <p className="mt-2">Declaro ainda que não estou postando conteúdo inflamável, explosivo, causador de combustão espontânea, tóxico, corrosivo, gás ou qualquer outro conteúdo que constitua perigo, conforme o art. 13 da Lei Postal nº 6.538/78.</p>
                        </div>

                        <div className="flex justify-between items-end mt-12">
                            <div className="text-center w-1/3">
                                <div className="border-b border-black mb-1"></div>
                                <p className="text-sm">Assinatura do Declarante/Remetente</p>
                            </div>
                            <div className="text-right text-sm">
                                Data: ____/____/________
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

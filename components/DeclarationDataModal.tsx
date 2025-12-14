import React, { useState, useEffect } from 'react';
import { Shipment } from '../types';

interface DeclarationDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedData: any) => void;
    shipment: Shipment | null;
    senderProfile: any;
}

export default function DeclarationDataModal({ isOpen, onClose, onSave, shipment, senderProfile }: DeclarationDataModalProps) {
    const [formData, setFormData] = useState({
        senderName: '',
        senderCpfCnpj: '',
        senderAddress: '',
        senderCity: '',
        senderState: '',
        senderCep: '',
        recipientName: '',
        recipientCpfCnpj: '',
        recipientAddress: '',
        recipientCity: '',
        recipientState: '',
        recipientCep: ''
    });

    useEffect(() => {
        if (isOpen && shipment) {
            // Merge shipment data with sender profile (similar to LabelGenerator logic)
            // But here we want to let the user edit it.

            // Logic: Prioritize Sender Profile to avoid stale/placeholder data from DB (like 'Av Paulista')
            // Shipment data might be empty or have placeholders. 
            // We assume the Profile is the source of truth for the Sender.

            const sName = senderProfile?.name || shipment.senderName || '';

            // Location logic similar to LabelGenerator
            let sAddress = '';
            let sCity = '';
            let sState = '';

            if (senderProfile?.location) {
                const parts = senderProfile.location.split(/[-–,]/).map((p: string) => p.trim());
                // Try to identify state (2 chars)
                const statePart = parts.find((p: string) => p.length === 2 && /^[A-Z]{2}$/i.test(p));

                if (statePart) {
                    sState = statePart.toUpperCase();
                    sCity = parts.filter((p: string) => p !== statePart).join(' ');
                } else if (parts.length >= 2) {
                    // Fallback: City - UF
                    sCity = parts[0];
                    sState = parts[1].substring(0, 2).toUpperCase();
                } else {
                    // Fallback: If we can't parse it, assume it's just the City name.
                    // Profile 'location' is typically "City, State" or just "City".
                    // It does NOT contain the street address.
                    sCity = senderProfile.location;
                }
            }

            // If profile location didn't yield address (it usually doesn't, it's just City/State), 
            // treat shipment.senderAddress as the street address, UNLESS it's the placeholder.
            let shipmentAddr = shipment.senderAddress || '';
            if (shipmentAddr === 'Av. Paulista, 1000') shipmentAddr = ''; // Ignore placeholder

            // Address should come from shipment or be empty (requiring user input)
            if (!sAddress) sAddress = shipmentAddr;

            // Prioritize profile parsing for City/State, fallback to shipment
            const finalSenderCity = sCity || shipment.senderCity || '';
            const finalSenderState = sState || shipment.senderState || '';

            setFormData({
                senderName: sName,
                senderCpfCnpj: senderProfile?.cpfCnpj || shipment.senderCpfCnpj || '',
                senderAddress: sAddress,
                senderCity: finalSenderCity,
                senderState: finalSenderState,
                senderCep: senderProfile?.cep || shipment.senderCep || '',

                recipientName: shipment.recipientName || '',
                recipientCpfCnpj: shipment.recipientCpfCnpj || '',
                recipientAddress: shipment.recipientAddress || '',
                recipientCity: shipment.recipientCity || '',
                recipientState: shipment.recipientState || '',
                recipientCep: shipment.recipientCep || ''
            });
        }
    }, [isOpen, shipment, senderProfile]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'senderCpfCnpj' | 'recipientCpfCnpj') => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 14) value = value.slice(0, 14);

        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        } else {
            value = value.replace(/^(\d{2})(\d)/, '$1.$2');
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
            value = value.replace(/(\d{4})(\d)/, '$1-$2');
        }
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Completar Dados da Declaração
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-100 dark:border-yellow-800">
                    <div className="flex gap-3">
                        <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">warning</span>
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            Alguns dados obrigatórios para a Declaração de Conteúdo estão faltando ou incompletos.
                            Por favor, preencha os campos abaixo para gerar o documento corretamente.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Seção Remetente */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                            Remetente
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                                <input
                                    type="text"
                                    name="senderName"
                                    value={formData.senderName}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CPF/CNPJ</label>
                                <input
                                    type="text"
                                    value={formData.senderCpfCnpj}
                                    onChange={(e) => handleCpfCnpjChange(e, 'senderCpfCnpj')}
                                    placeholder="000.000.000-00"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CEP</label>
                                <input
                                    type="text"
                                    name="senderCep"
                                    value={formData.senderCep}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endereço Completo</label>
                                <input
                                    type="text"
                                    name="senderAddress"
                                    value={formData.senderAddress}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade</label>
                                <input
                                    type="text"
                                    name="senderCity"
                                    value={formData.senderCity}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado (UF)</label>
                                <input
                                    type="text"
                                    name="senderState"
                                    maxLength={2}
                                    value={formData.senderState}
                                    onChange={(e) => handleChange({ target: { name: 'senderState', value: e.target.value.toUpperCase() } } as any)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Seção Destinatário */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                            Destinatário
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome</label>
                                <input
                                    type="text"
                                    name="recipientName"
                                    value={formData.recipientName}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CPF/CNPJ</label>
                                <input
                                    type="text"
                                    value={formData.recipientCpfCnpj}
                                    onChange={(e) => handleCpfCnpjChange(e, 'recipientCpfCnpj')}
                                    placeholder="000.000.000-00"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CEP</label>
                                <input
                                    type="text"
                                    name="recipientCep"
                                    value={formData.recipientCep}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endereço Completo</label>
                                <input
                                    type="text"
                                    name="recipientAddress"
                                    value={formData.recipientAddress}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cidade</label>
                                <input
                                    type="text"
                                    name="recipientCity"
                                    value={formData.recipientCity}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estado (UF)</label>
                                <input
                                    type="text"
                                    name="recipientState"
                                    maxLength={2}
                                    value={formData.recipientState}
                                    onChange={(e) => handleChange({ target: { name: 'recipientState', value: e.target.value.toUpperCase() } } as any)}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-2"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700 gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 shadow-lg shadow-primary/20"
                        >
                            Gerar Documento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

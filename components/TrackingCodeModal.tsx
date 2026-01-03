import React, { useState, useEffect } from 'react';

interface TrackingCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (code: string) => void;
    currentCode?: string;
}

export default function TrackingCodeModal({ isOpen, onClose, onSave, currentCode = '' }: TrackingCodeModalProps) {
    const [code, setCode] = useState('');

    useEffect(() => {
        const safeCode = currentCode || '';
        if (isOpen) {
            setCode(safeCode.startsWith('AG') ? '' : safeCode);
        }
    }, [isOpen, currentCode]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(code);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md shadow-2xl">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Código de Rastreio</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Insira o código dos Correios
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                placeholder="AA123456789BR"
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 px-4 py-3 text-lg font-mono uppercase focus:ring-2 focus:ring-primary/50"
                                autoFocus
                            />
                            <span className="absolute right-3 top-3.5 text-gray-400 material-symbols-outlined">
                                barcode_scanner
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            O código deve conter 13 caracteres (Ex: AA123456789BR)
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!code}
                            className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Salvar Rastreio
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

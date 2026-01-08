import React, { useState } from 'react';

interface DeleteCascadeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: React.ReactNode;
    uidd?: string; // UIDD da transação para exibir no aviso
}

const DeleteCascadeModal: React.FC<DeleteCascadeModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    uidd
}) => {
    const [step, setStep] = useState(1);

    if (!isOpen) return null;

    const handleFirstConfirm = () => {
        setStep(2);
    };

    const handleFinalConfirm = () => {
        onConfirm();
        onClose();
        setTimeout(() => setStep(1), 500); // Reset step after close
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => setStep(1), 500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e1e2e] rounded-xl shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-800 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                    <div className="flex items-center gap-3 text-red-500">
                        <span className="material-symbols-outlined text-2xl">warning</span>
                        <h2 className="text-xl font-bold">
                            {step === 1 ? 'Confirmar Exclusão' : 'ATENÇÃO: EXCLUSÃO EM CASCATA'}
                        </h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {step === 1 ? (
                        <div className="space-y-4">
                            <p className="text-gray-600 dark:text-gray-300">
                                {description}
                            </p>
                            {uidd && (
                                <div className="hidden">
                                    {/* UIDD Hidden for user */}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-100 dark:border-red-500/20">
                                <p className="text-sm text-red-700 dark:text-red-400 font-medium leading-relaxed">
                                    Este registro faz parte de uma transação unificada.
                                    <br /><br />
                                    <strong>Ao excluir este item, você também excluirá permanentemente:</strong>
                                    <ul className="list-disc ml-4 mt-2 mb-2">
                                        <li>O registro de Venda</li>
                                        <li>O registro no Financeiro</li>
                                        <li>O registro de Envio</li>
                                    </ul>
                                    O status do produto será revertido para "Publicado".
                                    <br /><br />
                                    Esta ação <strong>NÃO</strong> pode ser desfeita.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50/50 dark:bg-white/5 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-sm font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    {step === 1 ? (
                        <button
                            onClick={handleFirstConfirm}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <span>Continuar</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleFinalConfirm}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-500/20 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">delete_forever</span>
                            <span>Confirmar Exclusão Total</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeleteCascadeModal;

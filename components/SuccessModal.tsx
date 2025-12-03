import React from 'react';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

export default function SuccessModal({
    isOpen,
    onClose,
    title = "Sucesso!",
    message = "As informações foram salvas com sucesso."
}: SuccessModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">check</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {message}
                    </p>

                    <button
                        onClick={onClose}
                        className="w-full bg-primary hover:bg-primary-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-primary/20"
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
}

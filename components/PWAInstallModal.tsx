
import React, { useState, useEffect } from 'react';

interface PWAInstallModalProps {
    isOpen: boolean;
    onClose: () => void;
    deferredPrompt: any;
}

const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose, deferredPrompt }) => {
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        setIsIOS(/iphone|ipad|ipod/.test(userAgent));
    }, []);

    if (!isOpen) return null;

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-[#1e1e2e] rounded-2xl border border-white/10 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">

                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/20">
                        <div className="w-full h-full bg-[#1e1e2e] rounded-[14px] flex items-center justify-center">
                            <img src="/logo.png" alt="InflueTech" className="w-10 h-10 object-contain" />
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-white">Instalar InflueTech</h2>

                    <p className="text-gray-400 text-sm leading-relaxed">
                        Adicione o aplicativo à sua tela inicial para acessar mais rápido e em tela cheia.
                    </p>

                    {isIOS ? (
                        <div className="w-full bg-white/5 rounded-xl p-4 border border-white/10 space-y-4 text-left">
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <span className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full font-bold">1</span>
                                <div>Toque no botão <span className="font-bold text-cyan-400">Compartilhar</span> <span className="material-symbols-outlined text-sm align-middle">ios_share</span></div>
                            </div>
                            <div className="w-full h-px bg-white/5" />
                            <div className="flex items-center gap-3 text-sm text-gray-300">
                                <span className="w-6 h-6 flex items-center justify-center bg-white/10 rounded-full font-bold">2</span>
                                <div>Selecione <span className="font-bold text-white">Adicionar à Tela de Início</span> <span className="material-symbols-outlined text-sm align-middle">add_box</span></div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full pt-4">
                            {deferredPrompt ? (
                                <button
                                    onClick={handleInstall}
                                    className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20"
                                >
                                    Instalar Agora
                                </button>
                            ) : (
                                <div className="text-sm text-yellow-500 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                                    <p>Seu navegador não suporta instalação automática ou o app já está instalado.</p>
                                    <p className="mt-2 text-xs opacity-80">Tente usar o Chrome ou verifique o menu do navegador.</p>
                                </div>
                            )}
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-white text-sm font-medium mt-4"
                    >
                        Agora não
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PWAInstallModal;

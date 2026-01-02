import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LAST_BETA_MODAL_KEY = 'last_beta_modal_shown';
const DAYS_BETWEEN_MODALS = 10;

const BetaWarningModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const shouldShow = () => {
            const lastShown = localStorage.getItem(LAST_BETA_MODAL_KEY);
            if (!lastShown) return true;

            const daysSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
            return daysSince >= DAYS_BETWEEN_MODALS;
        };

        if (shouldShow()) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem(LAST_BETA_MODAL_KEY, Date.now().toString());
        setIsOpen(false);
    };

    const handleReportBug = () => {
        localStorage.setItem(LAST_BETA_MODAL_KEY, Date.now().toString());
        setIsOpen(false);
        navigate('/app/meu-perfil');
        // Scroll to bug report section after navigation
        setTimeout(() => {
            const bugSection = document.getElementById('bug-report-section');
            if (bugSection) {
                bugSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-gradient-to-br from-[#1e1e2e] to-[#2a2a3e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Gradient Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9146FF] via-[#00D4FF] to-[#9146FF]" />

                <div className="p-8">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-4xl shadow-lg shadow-yellow-500/30">
                            ⚠️
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 text-white">
                        Versão Beta em Desenvolvimento
                    </h2>

                    {/* Description */}
                    <p className="text-center text-gray-300 text-base mb-6 leading-relaxed">
                        Esta plataforma está em processo de <strong className="text-[#00D4FF]">testes e desenvolvimento</strong> ainda em sua <strong className="text-[#9146FF]">versão beta</strong>.
                        Algumas funções podem apresentar erros ou bugs.
                    </p>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-400 text-center">
                            Caso identifique algum problema e queira comunicar nossa equipe de desenvolvimento,
                            clique em <strong className="text-white">"Reportar BUG"</strong> ou acesse a seção dentro do seu perfil.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleReportBug}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#9146FF] to-[#00D4FF] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">bug_report</span>
                            <span>Reportar BUG</span>
                        </button>
                        <button
                            onClick={handleClose}
                            className="px-6 py-3 bg-white/10 border border-white/20 text-gray-300 font-medium rounded-xl hover:bg-white/20 transition-colors"
                        >
                            Entendi
                        </button>
                    </div>

                    {/* Footer Note */}
                    <p className="text-center text-gray-500 text-xs mt-4">
                        💡 Este aviso aparece a cada 10 dias
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BetaWarningModal;

import React from 'react';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    featureName?: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, featureName = 'esta funcionalidade' }) => {
    if (!isOpen) return null;

    const benefits = [
        { icon: '✨', text: 'Media Kits profissionais ilimitados' },
        { icon: '🤝', text: 'Networking com marcas premium' },
        { icon: '📊', text: 'Radar de Marcas com insights exclusivos' },
        { icon: '🎯', text: 'Planejador de Produtos com IA' },
        { icon: '📅', text: 'Planejador de Bazares inteligente' },
        { icon: '📈', text: 'Relatórios avançados e analytics' },
        { icon: '🎨', text: 'Templates premium personalizáveis' },
        { icon: '💰', text: 'Aumente seus ganhos em até 300%' }
    ];

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#1e1e2e] to-[#2a2a3e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Gradient Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9146FF] via-[#00D4FF] to-[#9146FF]" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white z-10"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="p-8 md:p-12">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9146FF] to-[#00D4FF] flex items-center justify-center text-4xl shadow-lg shadow-purple-500/30">
                            🚀
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#9146FF] to-[#00D4FF] bg-clip-text text-transparent">
                        Desbloqueie Todo o Potencial!
                    </h2>

                    {/* Description */}
                    <p className="text-center text-gray-300 text-lg mb-8 leading-relaxed">
                        {featureName} é exclusiva para usuários <strong className="text-[#00D4FF]">Creator+</strong>.
                        Faça upgrade agora e tenha acesso a ferramentas poderosas que vão <strong className="text-[#9146FF]">multiplicar seus ganhos</strong> e <strong className="text-[#00D4FF]">turbinar sua produtividade</strong>!
                    </p>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                        {benefits.map((benefit, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                            >
                                <span className="text-2xl flex-shrink-0">{benefit.icon}</span>
                                <span className="text-sm text-gray-300">{benefit.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => {
                                // TODO: Redirect to upgrade page or open payment modal
                                window.location.href = '/app/meu-perfil'; // Temporary
                            }}
                            className="flex-1 px-8 py-4 bg-gradient-to-r from-[#9146FF] to-[#00D4FF] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <span>Fazer Upgrade Agora</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="px-8 py-4 bg-white/5 border border-white/10 text-gray-300 font-medium rounded-xl hover:bg-white/10 transition-colors"
                        >
                            Talvez Depois
                        </button>
                    </div>

                    {/* Footer Note */}
                    <p className="text-center text-gray-500 text-xs mt-6">
                        💡 Usuários Creator+ têm acesso ilimitado a todas as funcionalidades premium
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UpgradeModal;


import React, { useState } from 'react';
import { useInfluencer } from '../context/InfluencerContext';

interface TutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const { data } = useInfluencer();

    if (!isOpen) return null;

    const steps = [
        {
            title: `Bem-vindo(a), ${data.profile.name.split(' ')[0]}!`,
            content: "Estamos muito felizes em ter você aqui. A InflueTech é a sua central completa para gerenciar sua carreira de influenciador. Vamos fazer um tour rápido?",
            icon: "waving_hand",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop"
        },
        {
            title: "Dashboard",
            content: "Aqui você tem uma visão geral de tudo: seus ganhos, tarefas pendentes, próximos eventos e métricas rápidas. É o seu ponto de partida diário.",
            icon: "dashboard",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop"
        },
        {
            title: "Meu Perfil & Media Kit",
            content: "Mantenha seus dados atualizados em 'Meu Perfil'. O 'Media Kit' é gerado automaticamente com base nessas informações, pronto para enviar para marcas!",
            icon: "person",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop"
        },
        {
            title: "Gestão Financeira",
            content: "Registre seus ganhos (Publis, AdSense, Afiliados) e despesas. Tenha controle total sobre o fluxo de caixa da sua carreira.",
            icon: "account_balance",
            image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2671&auto=format&fit=crop" // Updated image
        },
        {
            title: "Produtos & Vendas",
            content: "Recebeu produtos? Cadastre em 'Produtos'. Vendeu no bazar ou para seguidores? Gerencie tudo em 'Vendas' e 'Envios'.",
            icon: "inventory_2",
            image: "https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=2670&auto=format&fit=crop"
        },
        {
            title: "Radar de Marcas",
            content: "Encontre marcas que combinam com seu perfil e descubra como entrar em contato com elas para fechar parcerias.",
            icon: "radar",
            image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop"
        },
        {
            title: "Tudo pronto!",
            content: "Você já sabe o básico. Explore as ferramentas no menu lateral e leve sua carreira para o próximo nível!",
            icon: "rocket_launch",
            image: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=2669&auto=format&fit=crop"
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        // Ensure this is set before closing
        localStorage.setItem('hasSeenTutorial', 'true');
        // Small delay to ensure storage write? Usually not needed but safe.
        onClose();
    };

    const isLastStep = currentStep === steps.length - 1;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleComplete} />

            <div className="relative bg-[#1e1e2e] rounded-2xl border border-white/10 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[500px] animate-in fade-in zoom-in duration-300">

                {/* Image Section (Left/Top) */}
                <div className="w-full md:w-1/2 h-48 md:h-auto relative">
                    <img
                        src={steps[currentStep].image}
                        alt="Tutorial"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e2e] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#1e1e2e]" />
                    <div className="absolute top-4 left-4">
                        <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-bold text-white">
                            Passo {currentStep + 1} de {steps.length}
                        </div>
                    </div>
                </div>

                {/* Content Section (Right/Bottom) */}
                <div className="flex-1 p-8 flex flex-col justify-between bg-[#1e1e2e]">
                    <div className="space-y-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-3xl text-white">
                                {steps[currentStep].icon}
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            {steps[currentStep].title}
                        </h2>

                        <p className="text-gray-400 text-lg leading-relaxed">
                            {steps[currentStep].content}
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/5">
                        <button
                            onClick={handleComplete}
                            className="text-gray-500 hover:text-white transition-colors text-sm font-medium"
                        >
                            Pular Tutorial
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="flex gap-1">
                                {steps.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentStep ? 'bg-cyan-500 w-6' : 'bg-gray-700'
                                            }`}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-3 ml-4">
                                {currentStep > 0 && (
                                    <button
                                        onClick={handlePrev}
                                        className="p-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">arrow_back</span>
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-purple-900/20"
                                >
                                    <span>{isLastStep ? 'Começar' : 'Próximo'}</span>
                                    {!isLastStep && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialModal;

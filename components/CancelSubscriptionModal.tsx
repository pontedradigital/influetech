import React, { useState } from 'react';

interface CancelSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ReasonId = 'financial' | 'features' | 'support' | 'competitor' | 'usage' | 'other';

interface SubQuestion {
    id: string;
    label: string;
}

const REASON_SUBQUESTIONS: Record<ReasonId, SubQuestion[]> = {
    financial: [
        { id: 'too_expensive', label: 'O preço está alto para o meu momento' },
        { id: 'budget_cut', label: 'Corte de orçamento na empresa' },
        { id: 'roi', label: 'Não vi retorno sobre o investimento' },
        { id: 'billing_cycle', label: 'Prefiro um ciclo de cobrança diferente' },
    ],
    features: [
        { id: 'missing_feature', label: 'Falta uma funcionalidade específica' },
        { id: 'bugs', label: 'Encontrei muitos erros/bugs' },
        { id: 'ux', label: 'Achei difícil de usar' },
        { id: 'mobile', label: 'Preciso de um app mobile melhor' },
    ],
    support: [
        { id: 'slow_response', label: 'Demora na resposta' },
        { id: 'unresolved', label: 'Meu problema não foi resolvido' },
        { id: 'channel', label: 'Não gosto do canal de atendimento' },
    ],
    competitor: [
        { id: 'price', label: 'Encontrei uma opção mais barata' },
        { id: 'features', label: 'O concorrente tem mais funcionalidades' },
        { id: 'integration', label: 'Melhor integração com outras ferramentas' },
    ],
    usage: [
        { id: 'no_time', label: 'Sem tempo para usar' },
        { id: 'project_ended', label: 'O projeto acabou' },
        { id: 'learning_curve', label: 'Não consegui aprender a usar' },
    ],
    other: [
        { id: 'personal', label: 'Motivos pessoais' },
        { id: 'temporary', label: 'É apenas temporário' },
    ],
};

const NEW_FEATURES = [
    'Análise de Dados com IA',
    'Relatórios Avançados PDF/Excel',
    'App Mobile Nativo',
    'Integração com CRM/ERP',
    'Automação de Marketing',
    'Outro',
];

export default function CancelSubscriptionModal({ isOpen, onClose }: CancelSubscriptionModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        reason: '' as ReasonId | '',
        subReason: '',
        newFeature: '',
        newFeatureExpectation: '',
        details: '',
        retention: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const reasons = [
        { id: 'financial', label: 'Motivos Financeiros', icon: 'attach_money' },
        { id: 'features', label: 'Falta de Funcionalidades', icon: 'extension' },
        { id: 'support', label: 'Atendimento / Suporte', icon: 'support_agent' },
        { id: 'competitor', label: 'Migrei para outra ferramenta', icon: 'compare_arrows' },
        { id: 'usage', label: 'Não estou usando o suficiente', icon: 'hourglass_empty' },
        { id: 'other', label: 'Outro motivo', icon: 'more_horiz' },
    ];

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulating API call / Report Generation
        console.log('--- RELATÓRIO DE CANCELAMENTO AVANÇADO ---');
        console.log(JSON.stringify(formData, null, 2));
        console.log('------------------------------------------');

        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setStep(6); // Success step
    };

    const updateForm = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const renderStep1_Reason = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="material-symbols-outlined text-3xl">sentiment_dissatisfied</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">Poxa, que pena ver você partir!</h4>
                <p className="text-gray-500 text-sm">
                    Para começarmos, qual o motivo principal do seu cancelamento?
                </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {reasons.map((r) => (
                    <button
                        key={r.id}
                        onClick={() => {
                            updateForm('reason', r.id);
                            setStep(2);
                        }}
                        className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all text-left group"
                    >
                        <span className="material-symbols-outlined mr-3 text-gray-400 group-hover:text-primary transition-colors">{r.icon}</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">{r.label}</span>
                        <span className="material-symbols-outlined ml-auto text-gray-300 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all">arrow_forward</span>
                    </button>
                ))}
            </div>
        </div>
    );

    const renderStep2_SubReason = () => {
        const subQuestions = formData.reason ? REASON_SUBQUESTIONS[formData.reason as ReasonId] : [];
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Entendemos. Poderia detalhar melhor?</h4>
                    <p className="text-gray-500 text-sm">Selecione o que mais se aproxima da sua situação.</p>
                </div>
                <div className="space-y-3">
                    {subQuestions.map((q) => (
                        <label key={q.id} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.subReason === q.label ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            <input
                                type="radio"
                                name="subReason"
                                value={q.label}
                                checked={formData.subReason === q.label}
                                onChange={(e) => updateForm('subReason', e.target.value)}
                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <span className="ml-3 text-gray-700 dark:text-gray-300 font-medium">{q.label}</span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-between pt-4">
                    <button onClick={handleBack} className="text-gray-500 hover:text-gray-700 font-medium">Voltar</button>
                    <button onClick={handleNext} disabled={!formData.subReason} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed">Continuar</button>
                </div>
            </div>
        );
    };

    const renderStep3_FeatureRequest = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-2xl">lightbulb</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Se você pudesse criar uma nova funcionalidade...</h4>
                <p className="text-gray-500 text-sm">Qual destas você implementaria hoje?</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {NEW_FEATURES.map((f) => (
                    <button
                        key={f}
                        onClick={() => updateForm('newFeature', f)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${formData.newFeature === f ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-300'}`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {formData.newFeature && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        O que você esperaria dessa funcionalidade?
                    </label>
                    <textarea
                        value={formData.newFeatureExpectation}
                        onChange={(e) => updateForm('newFeatureExpectation', e.target.value)}
                        placeholder="Descreva como isso ajudaria no seu dia a dia..."
                        className="w-full h-24 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 focus:ring-2 focus:ring-purple-500/50 resize-none text-sm"
                    />
                </div>
            )}

            <div className="flex justify-between pt-4">
                <button onClick={handleBack} className="text-gray-500 hover:text-gray-700 font-medium">Voltar</button>
                <button
                    onClick={handleNext}
                    disabled={!formData.newFeature || (formData.newFeature && !formData.newFeatureExpectation)}
                    className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continuar
                </button>
            </div>
        </div>
    );

    const renderStep4_DeepDive = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Queremos ouvir tudo</h4>
                <p className="text-gray-500 text-sm">Sinta-se à vontade para desabafar. Lemos todos os comentários.</p>
            </div>

            <textarea
                value={formData.details}
                onChange={(e) => updateForm('details', e.target.value)}
                placeholder="Escreva aqui qualquer outro detalhe, frustração ou feedback..."
                className="w-full h-40 rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 focus:ring-2 focus:ring-primary/50 resize-none"
            />

            <div className="flex justify-between pt-4">
                <button onClick={handleBack} className="text-gray-500 hover:text-gray-700 font-medium">Voltar</button>
                <button onClick={handleNext} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-600">Continuar</button>
            </div>
        </div>
    );

    const renderStep5_Retention = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="material-symbols-outlined text-2xl">handshake</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">O que faria você ficar?</h4>
                <p className="text-gray-500 text-sm">Existe algo que possamos fazer agora para reverter sua decisão?</p>
            </div>

            <textarea
                value={formData.retention}
                onChange={(e) => updateForm('retention', e.target.value)}
                placeholder="Ex: Se o preço fosse X... Se tivesse a funcionalidade Y..."
                className="w-full h-32 rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 focus:ring-2 focus:ring-blue-500/50 resize-none"
            />

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl flex gap-3 items-start mt-4">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 mt-0.5">warning</span>
                <div className="text-sm">
                    <p className="font-bold text-red-800 dark:text-red-200">Atenção: Cancelamento Definitivo</p>
                    <p className="text-red-700 dark:text-red-300 mt-1">
                        Ao confirmar abaixo, sua assinatura será cancelada imediatamente e seus dados agendados para exclusão em 30 dias.
                    </p>
                </div>
            </div>

            <div className="flex justify-between items-center pt-4">
                <button onClick={handleBack} className="text-gray-500 hover:text-gray-700 font-medium">Voltar</button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all shadow-lg shadow-red-600/20 flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                            Processando...
                        </>
                    ) : (
                        'Confirmar Cancelamento'
                    )}
                </button>
            </div>
        </div>
    );

    const renderStep6_Success = () => (
        <div className="text-center space-y-6 py-8 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>
            <div>
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Solicitação Recebida</h4>
                <p className="text-gray-500 max-w-xs mx-auto">
                    Agradecemos muito seu feedback detalhado. Ele será analisado com carinho pela nossa equipe de produto.
                </p>
            </div>
            <button
                onClick={onClose}
                className="px-8 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
                Fechar
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 shrink-0">
                    <div className="flex items-center gap-2">
                        {step > 1 && step < 6 && (
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${i <= step ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`} />
                                ))}
                            </div>
                        )}
                        <span className="text-xs font-medium text-gray-500 ml-2">
                            {step < 6 ? `Etapa ${step} de 5` : 'Concluído'}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {step === 1 && renderStep1_Reason()}
                    {step === 2 && renderStep2_SubReason()}
                    {step === 3 && renderStep3_FeatureRequest()}
                    {step === 4 && renderStep4_DeepDive()}
                    {step === 5 && renderStep5_Retention()}
                    {step === 6 && renderStep6_Success()}
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { TranslationService } from '../services/TranslationService';
import { MediaKitTemplates } from './MediaKitTemplates';

interface MediaKitGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: any;
}

interface Brand {
    id: string;
    name: string;
    logo: string;
}

const LANGUAGES = [
    { code: 'pt', name: 'Português', flag: '🇧🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' }
];

export default function MediaKitGenerationModal({ isOpen, onClose, initialData }: MediaKitGenerationModalProps) {
    const [step, setStep] = useState(1);
    const [selectedLanguage, setSelectedLanguage] = useState('pt');
    const [customPhoto, setCustomPhoto] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState('');
    const [translatedData, setTranslatedData] = useState<any>(null);
    const [isTranslating, setIsTranslating] = useState(false);

    // Brands coming directly from initialData
    const brands = initialData.brands || [];

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedLanguage('pt');
            setCustomPhoto(null);
            setDisplayName(initialData.name || '');
            setTranslatedData(null);
        }
    }, [isOpen, initialData]);

    // Handle Translation
    useEffect(() => {
        const translateData = async () => {
            setIsTranslating(true);

            // 1. Translate Labels
            const labels = {
                aboutMe: TranslationService.translate('Sobre Mim', selectedLanguage as any) || 'Sobre Mim',
                contact: TranslationService.translate('Contato', selectedLanguage as any) || 'Contato',
                metrics: TranslationService.translate('Métricas de Alcance', selectedLanguage as any) || 'Métricas de Alcance',
                audience: TranslationService.translate('Demografia do Público', selectedLanguage as any) || 'Demografia do Público',
                socialStats: TranslationService.translate('Estatísticas Sociais', selectedLanguage as any) || 'Estatísticas Sociais',
                whatToExpect: TranslationService.translate('O que esperar', selectedLanguage as any) || 'O que esperar',
                followers: TranslationService.translate('Seguidores', selectedLanguage as any) || 'Seguidores',
                views: TranslationService.translate('Visualizações', selectedLanguage as any) || 'Visualizações',
                subscribers: TranslationService.translate('Inscritos', selectedLanguage as any) || 'Inscritos',
                engagement: TranslationService.translate('Taxa de Engajamento', selectedLanguage as any) || 'Taxa de Engajamento',
                ageRange: TranslationService.translate('Faixa Etária', selectedLanguage as any) || 'Faixa Etária',
                male: TranslationService.translate('Masculino', selectedLanguage as any) || 'Masculino',
                female: TranslationService.translate('Feminino', selectedLanguage as any) || 'Feminino',
                frequency: TranslationService.translate('Frequência', selectedLanguage as any) || 'Frequência',
                email: TranslationService.translate('Email', selectedLanguage as any) || 'Email',
                phone: TranslationService.translate('Telefone', selectedLanguage as any) || 'Telefone',
                location: TranslationService.translate('Localização', selectedLanguage as any) || 'Localização',
                totalMonthlyViews: TranslationService.translate('Total de Views Mensais', selectedLanguage as any) || 'Total de Views Mensais',
                followersByPlatform: TranslationService.translate('Seguidores por Plataforma', selectedLanguage as any) || 'Seguidores por Plataforma',
                viewsByPlatform: TranslationService.translate('Views por Plataforma', selectedLanguage as any) || 'Views por Plataforma',
                brands: TranslationService.translate('Marcas Parceiras', selectedLanguage as any) || 'Marcas Parceiras',
            };

            // 2. Ensure all required fields have valid values (no null/undefined)
            const translatedContent = {
                name: displayName || initialData.name || 'Influencer Name',
                bio: TranslationService.translateObject(initialData.bio || '', selectedLanguage as any) || '',
                location: initialData.location || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                photo: customPhoto || initialData.photo || null,
                niche: TranslationService.translateObject(initialData.niche || '', selectedLanguage as any) || '',

                socialMedia: Array.isArray(initialData.socialMedia)
                    ? initialData.socialMedia.map((social: any) => ({
                        platform: social.platform || 'Platform',
                        handle: social.handle || '',
                        followers: social.followers || 0,
                        averageViews: social.averageViews || undefined,
                        postingFrequency: social.postingFrequency || undefined
                    }))
                    : [],

                metrics: {
                    totalFollowers: initialData.metrics?.totalFollowers || 0,
                    engagementRate: initialData.metrics?.engagementRate || 0,
                    averageViews: initialData.metrics?.averageViews || 0,
                    contentFrequency: initialData.metrics?.contentFrequency || ''
                },

                contentTypes: Array.isArray(initialData.contentTypes) ? initialData.contentTypes : [],

                partnershipPreferences: {
                    type: TranslationService.translateObject(
                        initialData.partnershipPreferences?.type || '',
                        selectedLanguage as any
                    ) || '',
                    categories: Array.isArray(initialData.partnershipPreferences?.categories)
                        ? TranslationService.translateObject(
                            initialData.partnershipPreferences.categories,
                            selectedLanguage as any
                        )
                        : [],
                    minimumValue: initialData.partnershipPreferences?.minimumValue || 0,
                    currency: initialData.partnershipPreferences?.currency || 'BRL'
                },

                audienceAge: initialData.audienceAge || undefined,
                audienceGenderMale: initialData.audienceGenderMale !== undefined ? initialData.audienceGenderMale : undefined,
                audienceGenderFemale: initialData.audienceGenderFemale !== undefined ? initialData.audienceGenderFemale : undefined,

                brands: brands.map((b: any) => ({ name: b.name, logo: b.logo, backgroundColor: b.backgroundColor })),

                labels
            };

            console.log('📄 Translated Data for PDF:', translatedContent);
            setTranslatedData(translatedContent);
            setIsTranslating(false);
        };

        if (isOpen) {
            translateData();
        }
    }, [selectedLanguage, initialData, customPhoto, displayName, isOpen]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const getSelectedTemplate = () => {
        if (!translatedData) return null;
        return <MediaKitTemplates.LayoutCorporate data={translatedData} />;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Gerar Media Kit</h2>
                        <p className="text-sm text-gray-500">Personalize seu documento profissional</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step Indicator */}
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Perfil</span>
                            <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-700 mx-2" />
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Download</span>
                        </div>
                    </div>

                    {/* Step 1: Customization */}
                    {step === 1 && (
                        <div className="max-w-xl mx-auto space-y-8">
                            {/* Display Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Nome de Exibição
                                </label>
                                <input
                                    type="text"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Seu nome no Media Kit"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Este nome aparecerá no cabeçalho do documento.
                                </p>
                            </div>

                            {/* Language */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Idioma do Documento
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {LANGUAGES.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => setSelectedLanguage(lang.code)}
                                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${selectedLanguage === lang.code ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                        >
                                            <span className="text-2xl">{lang.flag}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{lang.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-sm">translate</span>
                                    Tradução automática ativada
                                </p>
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Foto de Perfil
                                </label>
                                <div className="flex items-center gap-6">
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 flex-shrink-0">
                                        {customPhoto ? (
                                            <img src={customPhoto} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <span className="material-symbols-outlined text-3xl">person</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">upload</span>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Carregar nova foto</span>
                                            <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                                        </label>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Recomendado: Alta resolução, fundo neutro.
                                            <br />
                                            Se não enviar, o espaço da foto ficará vazio.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Download */}
                    {step === 2 && (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-4xl">check_circle</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tudo Pronto!</h3>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                Seu Media Kit foi configurado com sucesso no idioma <strong>{LANGUAGES.find(l => l.code === selectedLanguage)?.name}</strong>.
                            </p>

                            {isTranslating || !translatedData ? (
                                <div className="flex items-center justify-center gap-2 text-primary">
                                    <span className="animate-spin material-symbols-outlined">progress_activity</span>
                                    <span>Preparando documento...</span>
                                </div>
                            ) : (
                                <div className="flex justify-center">
                                    <PDFDownloadLink
                                        document={getSelectedTemplate() as any}
                                        fileName={`MediaKit_${initialData.name.replace(/\s+/g, '_')}_${selectedLanguage.toUpperCase()}.pdf`}
                                    >
                                        {({ blob, url, loading, error }) => {
                                            if (loading) {
                                                return (
                                                    <button disabled className="flex items-center gap-3 bg-gray-300 text-white px-8 py-4 rounded-xl font-bold text-lg cursor-not-allowed">
                                                        <span className="animate-spin material-symbols-outlined">progress_activity</span>
                                                        Gerando PDF...
                                                    </button>
                                                );
                                            }
                                            if (error) {
                                                console.error('PDF Generation Error:', error);
                                                console.error('Error Stack:', error.stack);
                                                console.error('Translated Data:', translatedData);
                                                return (
                                                    <div className="text-center">
                                                        <div className="text-red-500 font-bold mb-2">
                                                            Erro ao gerar PDF
                                                        </div>
                                                        <div className="text-xs text-gray-600 bg-red-50 p-3 rounded border border-red-200 max-w-md mx-auto">
                                                            {error.message || 'Erro desconhecido'}
                                                        </div>
                                                        <button
                                                            onClick={() => setStep(1)}
                                                            className="mt-4 text-sm text-primary hover:underline"
                                                        >
                                                            Tentar novamente
                                                        </button>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <button className="flex items-center gap-3 bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-primary/20 transform hover:-translate-y-1">
                                                    <span className="material-symbols-outlined">download</span>
                                                    Baixar Media Kit PDF
                                                </button>
                                            );
                                        }}
                                    </PDFDownloadLink>
                                </div>
                            )}

                            <button
                                onClick={() => setStep(1)}
                                className="block mx-auto mt-6 text-sm text-gray-500 hover:text-primary underline"
                            >
                                Começar de novo
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {step < 2 && (
                    <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between">
                        {step > 1 ? (
                            <button
                                onClick={() => setStep(s => s - 1)}
                                className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white px-4"
                            >
                                Voltar
                            </button>
                        ) : <div />}

                        <button
                            onClick={() => setStep(s => s + 1)}
                            className="px-8 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-colors shadow-lg shadow-primary/20"
                        >
                            {step === 1 ? 'Gerar PDF' : 'Continuar'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

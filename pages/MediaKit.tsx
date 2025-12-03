import React, { useState } from 'react';
import MediaKitGenerationModal from '../components/MediaKitGenerationModal';
import { useInfluencer } from '../context/InfluencerContext';

export default function MediaKit() {
    const { data, totalFollowers } = useInfluencer();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calculate total average views
    const totalAverageViews = data.socials.reduce((acc, curr) => acc + (curr.averageViews || 0), 0);

    // Map context data to the structure expected by the page and modal
    const influencerData = {
        name: data.profile.name,
        bio: data.profile.bio,
        location: data.profile.location,
        email: data.profile.email,
        phone: data.profile.phone,
        photo: null, // Photo is handled in the modal or could be added to context later

        socialMedia: data.socials.map(s => ({
            platform: s.platform,
            handle: s.handle,
            followers: s.followers,
            averageViews: s.averageViews
        })),

        metrics: {
            totalFollowers: totalFollowers,
            engagementRate: data.profile.engagementRate,
            averageViews: totalAverageViews,
            contentFrequency: '3-4 posts por semana' // Placeholder
        },

        niche: data.profile.niche,
        contentTypes: data.profile.contentTypes,

        partnershipPreferences: {
            categories: data.partnerships.categories,
            type: data.partnerships.preferredTypes.join(', '),
            minimumValue: data.partnerships.productValueSuggestion,
            currency: data.partnerships.currency
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">Media Kit</h1>
                    <p className="text-gray-500 mt-1">Gere seu portfólio profissional para apresentar a marcas</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined">download</span>
                        Baixar Media Kit
                    </button>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 p-6 rounded-xl border border-primary/20 flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-primary">
                    <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Novo Gerador de Media Kit</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        Agora você pode personalizar completamente seu documento! Escolha entre <strong>5 layouts profissionais</strong>,
                        selecione as cores da sua marca, faça upload de uma foto personalizada e traduza automaticamente para
                        <strong> Inglês, Espanhol ou Chinês</strong>.
                    </p>
                </div>
            </div>

            {/* Preview Section (Static for now, just to show data) */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 opacity-75 grayscale-[0.5] hover:grayscale-0 transition-all duration-500">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Seus Dados Atuais</h2>
                    <span className="text-xs font-medium px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500">
                        Estes dados serão usados no PDF
                    </span>
                </div>

                {/* Profile Summary */}
                <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{influencerData.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{influencerData.bio || 'Adicione uma bio nas configurações...'}</p>
                    <div className="flex flex-wrap gap-4 text-sm mb-4">
                        <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">location_on</span>
                            {influencerData.location}
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">category</span>
                            {influencerData.niche || 'Nicho não definido'}
                        </span>
                    </div>

                    {/* Socials Preview */}
                    <div className="flex flex-wrap gap-3">
                        {influencerData.socialMedia.map((social, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                <strong>{social.platform}</strong>
                                {social.handle}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-xs uppercase text-gray-500 mb-2">Total de Seguidores</p>
                        <p className="text-3xl font-bold text-primary">{influencerData.metrics.totalFollowers.toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-xs uppercase text-gray-500 mb-2">Taxa de Engajamento</p>
                        <p className="text-3xl font-bold text-green-600">{influencerData.metrics.engagementRate}%</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-xs uppercase text-gray-500 mb-2">Média de Views</p>
                        <p className="text-3xl font-bold text-purple-600">{influencerData.metrics.averageViews.toLocaleString('pt-BR')}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-xs uppercase text-gray-500 mb-2">Frequência</p>
                        <p className="text-lg font-bold text-orange-600">{influencerData.metrics.contentFrequency}</p>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <MediaKitGenerationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={influencerData}
            />
        </div>
    );
}


import React, { useState } from 'react';
import MediaKitGenerationModal from '../components/MediaKitGenerationModal';
import { useInfluencer } from '../context/InfluencerContext';

export default function MediaKit() {
    const { data, totalFollowers } = useInfluencer();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);

    // Retrigger animation on mount
    React.useEffect(() => {
        // Force re-render to retrigger animations
        setAnimationKey(prev => prev + 1);
    }, []);

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
            averageViews: s.averageViews,
            postingFrequency: s.postingFrequency
        })),

        metrics: {
            totalFollowers: totalFollowers,
            engagementRate: data.profile.engagementRate,
            averageViews: totalAverageViews,
            contentFrequency: data.socials
                .filter(s => s.postingFrequency)
                .map(s => `${s.platform}: ${s.postingFrequency}`)
                .join(' | ') || 'Não configurado'
        },

        niche: data.profile.niche,
        contentTypes: data.profile.contentTypes,
        audienceAge: data.profile.audienceAge,
        audienceGenderMale: data.profile.audienceGenderMale,
        audienceGenderFemale: data.profile.audienceGenderFemale,

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
                        onClick={() => {
                            console.log('📊 Media Kit Data being passed to modal:', influencerData);
                            setIsModalOpen(true);
                        }}
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
                        <strong> Inglês ou Português</strong>.
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
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{influencerData.bio || 'Adicione uma bio em Meu Perfil...'}</p>
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

                {/* Three Pie Charts - Distribution */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Distribuição por Plataforma</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Seguidores */}
                        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 text-center">Seguidores</h4>
                            <div className="flex flex-col items-center gap-4">
                                <svg key={`followers-${animationKey}`} viewBox="0 0 200 200" className="w-48 h-48">
                                    <style>{`
                                        @keyframes fillPie {
                                            from { stroke-dashoffset: 502; }
                                            to { stroke-dashoffset: 0; }
                                        }
                                        .pie-slice { 
                                            animation: fillPie 1.5s ease-out forwards;
                                        }
                                    `}</style>
                                    {(() => {
                                        const getPlatformColor = (platform: string) => {
                                            const colorMap: Record<string, string> = {
                                                'Instagram': '#E1306C',
                                                'TikTok': '#000000',
                                                'YouTube': '#FF0000',
                                                'Twitter': '#1DA1F2',
                                                'Twitch': '#9146FF',
                                                'LinkedIn': '#0077B5',
                                                'Other': '#6B7280'
                                            };
                                            return colorMap[platform] || '#6366f1';
                                        };

                                        const total = totalFollowers;
                                        let currentOffset = 0;
                                        const radius = 80;
                                        const circumference = 2 * Math.PI * radius;

                                        return data.socials.map((social, idx) => {
                                            const percentage = (social.followers / total);
                                            const dashLength = circumference * percentage;
                                            const offset = currentOffset;
                                            currentOffset += dashLength;

                                            return (
                                                <circle
                                                    key={social.id}
                                                    cx="100"
                                                    cy="100"
                                                    r={radius}
                                                    fill="none"
                                                    stroke={getPlatformColor(social.platform)}
                                                    strokeWidth="40"
                                                    strokeDasharray={circumference}
                                                    strokeDashoffset={circumference - offset - dashLength}
                                                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                                    style={{
                                                        strokeDasharray: `${dashLength} ${circumference - dashLength}`,
                                                        strokeDashoffset: -offset,
                                                        transition: 'stroke-dashoffset 1.5s ease-out',
                                                        transitionDelay: `${idx * 200}ms`
                                                    }}
                                                    transform="rotate(-90 100 100)"
                                                />
                                            );
                                        });
                                    })()}
                                    <circle cx="100" cy="100" r="50" fill="white" className="dark:fill-gray-800" />
                                    <text x="100" y="105" textAnchor="middle" className="fill-primary text-xl font-bold">{(totalFollowers / 1000).toFixed(0)}K</text>
                                </svg>
                                <div className="flex flex-col gap-2 w-full">
                                    {data.socials.map((social, idx) => {
                                        const getPlatformColor = (platform: string) => {
                                            const colorMap: Record<string, string> = {
                                                'Instagram': '#E1306C',
                                                'TikTok': '#000000',
                                                'YouTube': '#FF0000',
                                                'Twitter': '#1DA1F2',
                                                'Twitch': '#9146FF',
                                                'LinkedIn': '#0077B5',
                                                'Other': '#6B7280'
                                            };
                                            return colorMap[platform] || '#6366f1';
                                        };
                                        const percentage = ((social.followers / totalFollowers) * 100).toFixed(1);
                                        return (
                                            <div key={social.id} className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getPlatformColor(social.platform) }}></div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 flex-1">{social.platform}</p>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">{percentage}%</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Views Mensais */}
                        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 text-center">Views Mensais</h4>
                            <div className="flex flex-col items-center gap-4">
                                <svg key={`views-${animationKey}`} viewBox="0 0 200 200" className="w-48 h-48">
                                    {(() => {
                                        const getPlatformColor = (platform: string) => {
                                            const colorMap: Record<string, string> = {
                                                'Instagram': '#E1306C',
                                                'TikTok': '#000000',
                                                'YouTube': '#FF0000',
                                                'Twitter': '#1DA1F2',
                                                'Twitch': '#9146FF',
                                                'LinkedIn': '#0077B5',
                                                'Other': '#6B7280'
                                            };
                                            return colorMap[platform] || '#6366f1';
                                        };

                                        const total = totalAverageViews;
                                        if (total === 0) {
                                            return (
                                                <>
                                                    <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="40" />
                                                    <circle cx="100" cy="100" r="50" fill="white" className="dark:fill-gray-800" />
                                                    <text x="100" y="105" textAnchor="middle" className="fill-gray-400 text-sm">Sem dados</text>
                                                </>
                                            );
                                        }
                                        let currentOffset = 0;
                                        const radius = 80;
                                        const circumference = 2 * Math.PI * radius;

                                        return (
                                            <>
                                                {data.socials.filter(s => s.averageViews && s.averageViews > 0).map((social, idx) => {
                                                    const percentage = (social.averageViews! / total);
                                                    const dashLength = circumference * percentage;
                                                    const offset = currentOffset;
                                                    currentOffset += dashLength;

                                                    return (
                                                        <circle
                                                            key={social.id}
                                                            cx="100"
                                                            cy="100"
                                                            r={radius}
                                                            fill="none"
                                                            stroke={getPlatformColor(social.platform)}
                                                            strokeWidth="40"
                                                            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                                            style={{
                                                                strokeDasharray: `${dashLength} ${circumference - dashLength}`,
                                                                strokeDashoffset: -offset,
                                                                transition: 'stroke-dashoffset 1.5s ease-out',
                                                                transitionDelay: `${idx * 200}ms`
                                                            }}
                                                            transform="rotate(-90 100 100)"
                                                        />
                                                    );
                                                })}
                                                <circle cx="100" cy="100" r="50" fill="white" className="dark:fill-gray-800" />
                                                <text x="100" y="105" textAnchor="middle" className="fill-purple-600 text-xl font-bold">{(total / 1000).toFixed(0)}K</text>
                                            </>
                                        );
                                    })()}
                                </svg>
                                <div className="flex flex-col gap-2 w-full">
                                    {data.socials.filter(s => s.averageViews && s.averageViews > 0).map((social, idx) => {
                                        const getPlatformColor = (platform: string) => {
                                            const colorMap: Record<string, string> = {
                                                'Instagram': '#E1306C',
                                                'TikTok': '#000000',
                                                'YouTube': '#FF0000',
                                                'Twitter': '#1DA1F2',
                                                'Twitch': '#9146FF',
                                                'LinkedIn': '#0077B5',
                                                'Other': '#6B7280'
                                            };
                                            return colorMap[platform] || '#6366f1';
                                        };
                                        const percentage = ((social.averageViews! / totalAverageViews) * 100).toFixed(1);
                                        return (
                                            <div key={social.id} className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getPlatformColor(social.platform) }}></div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 flex-1">{social.platform}</p>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">{percentage}%</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Frequência de Postagens */}
                        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 text-center">Frequência de Postagens</h4>
                            <div className="flex flex-col items-center gap-4">
                                <svg key={`frequency-${animationKey}`} viewBox="0 0 200 200" className="w-48 h-48">
                                    {(() => {
                                        const getPlatformColor = (platform: string) => {
                                            const colorMap: Record<string, string> = {
                                                'Instagram': '#E1306C',
                                                'TikTok': '#000000',
                                                'YouTube': '#FF0000',
                                                'Twitter': '#1DA1F2',
                                                'Twitch': '#9146FF',
                                                'LinkedIn': '#0077B5',
                                                'Other': '#6B7280'
                                            };
                                            return colorMap[platform] || '#6366f1';
                                        };

                                        const socialsWithFreq = data.socials.filter(s => s.postingFrequency);
                                        if (socialsWithFreq.length === 0) {
                                            return (
                                                <>
                                                    <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="40" />
                                                    <circle cx="100" cy="100" r="50" fill="white" className="dark:fill-gray-800" />
                                                    <text x="100" y="105" textAnchor="middle" className="fill-gray-400 text-sm">Sem dados</text>
                                                </>
                                            );
                                        }
                                        const total = socialsWithFreq.length;
                                        let currentOffset = 0;
                                        const radius = 80;
                                        const circumference = 2 * Math.PI * radius;

                                        return (
                                            <>
                                                {socialsWithFreq.map((social, idx) => {
                                                    const percentage = 1 / total;
                                                    const dashLength = circumference * percentage;
                                                    const offset = currentOffset;
                                                    currentOffset += dashLength;

                                                    return (
                                                        <circle
                                                            key={social.id}
                                                            cx="100"
                                                            cy="100"
                                                            r={radius}
                                                            fill="none"
                                                            stroke={getPlatformColor(social.platform)}
                                                            strokeWidth="40"
                                                            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                                            style={{
                                                                strokeDasharray: `${dashLength} ${circumference - dashLength}`,
                                                                strokeDashoffset: -offset,
                                                                transition: 'stroke-dashoffset 1.5s ease-out',
                                                                transitionDelay: `${idx * 200}ms`
                                                            }}
                                                            transform="rotate(-90 100 100)"
                                                        />
                                                    );
                                                })}
                                                <circle cx="100" cy="100" r="50" fill="white" className="dark:fill-gray-800" />
                                                <text x="100" y="105" textAnchor="middle" className="fill-orange-600 text-xl font-bold">{total}</text>
                                            </>
                                        );
                                    })()}
                                </svg>
                                <div className="flex flex-col gap-2 w-full">
                                    {data.socials.filter(s => s.postingFrequency).map((social, idx) => {
                                        const getPlatformColor = (platform: string) => {
                                            const colorMap: Record<string, string> = {
                                                'Instagram': '#E1306C',
                                                'TikTok': '#000000',
                                                'YouTube': '#FF0000',
                                                'Twitter': '#1DA1F2',
                                                'Twitch': '#9146FF',
                                                'LinkedIn': '#0077B5',
                                                'Other': '#6B7280'
                                            };
                                            return colorMap[platform] || '#6366f1';
                                        };
                                        return (
                                            <div key={social.id} className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getPlatformColor(social.platform) }}></div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 flex-1">{social.platform}</p>
                                                <p className="text-xs font-bold text-orange-600">{social.postingFrequency}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Platform-Specific Cards */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Métricas por Plataforma</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.socials.map((social, idx) => (
                            <div
                                key={social.id}
                                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">{social.platform}</h4>
                                    <span className="text-2xl">{
                                        social.platform === 'Instagram' ? '📸' :
                                            social.platform === 'TikTok' ? '🎵' :
                                                social.platform === 'YouTube' ? '▶️' :
                                                    social.platform === 'Twitter' ? '🐦' :
                                                        social.platform === 'Twitch' ? '🎮' : '🌐'
                                    }</span>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Handle</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{social.handle}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Seguidores</p>
                                            <p className="text-lg font-bold text-primary">{social.followers.toLocaleString('pt-BR')}</p>
                                        </div>
                                        {social.averageViews && social.averageViews > 0 && (
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Views/Mês</p>
                                                <p className="text-lg font-bold text-purple-600">{social.averageViews.toLocaleString('pt-BR')}</p>
                                            </div>
                                        )}
                                    </div>

                                    {social.postingFrequency && (
                                        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 mb-1">Frequência</p>
                                            <p className="text-sm font-medium text-orange-600">{social.postingFrequency}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-xs uppercase text-gray-500 mb-2">Taxa de Engajamento Média</p>
                        <p className="text-3xl font-bold text-green-600">{data.profile.engagementRate}%</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-xs uppercase text-gray-500 mb-2">Total de Views Mensais</p>
                        <p className="text-3xl font-bold text-purple-600">{totalAverageViews.toLocaleString('pt-BR')}</p>
                    </div>
                </div>

                {/* Audience Demographics */}
                {(influencerData.audienceAge || (influencerData.audienceGenderMale !== undefined && influencerData.audienceGenderFemale !== undefined)) && (
                    <div className="mt-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Demografia do Público</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {influencerData.audienceAge && (
                                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <p className="text-xs uppercase text-gray-500 mb-2">Faixa Etária</p>
                                    <p className="text-2xl font-bold text-purple-600">{influencerData.audienceAge}</p>
                                </div>
                            )}
                            {(influencerData.audienceGenderMale !== undefined && influencerData.audienceGenderFemale !== undefined) && (
                                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                                    <p className="text-xs uppercase text-gray-500 mb-3">Distribuição de Gênero</p>
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Masculino</p>
                                            <p className="text-2xl font-bold text-blue-600">{influencerData.audienceGenderMale}%</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Feminino</p>
                                            <p className="text-2xl font-bold text-pink-600">{influencerData.audienceGenderFemale}%</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
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



import React, { useState, useEffect } from 'react';
import { User, Opportunity } from '../types';
import { useInfluencer } from '../context/InfluencerContext';
import CommunityFeed from '../components/Community/CommunityFeed';
import PremiumFeatureWrapper from '../components/PremiumFeatureWrapper';

// Mock ID since we don't have full auth context yet in frontend
const CURRENT_USER_ID = '327aa8c1-7c26-41c2-95d7-b375c25eb896';

const NetworkingContent = () => {
    const [activeTab, setActiveTab] = useState<'community' | 'opportunities' | 'feed'>('community');
    const [publicUsers, setPublicUsers] = useState<User[]>([]);
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isOpportunityModalOpen, setIsOpportunityModalOpen] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedNiche, setSelectedNiche] = useState('');
    const [selectedOppType, setSelectedOppType] = useState('');

    const niches = ['Gamer', 'Tech', 'Lifestyle', 'Reviews', 'Blog'];
    const oppTypes = ['COLLAB', 'JOB', 'EVENT', 'PARTNERSHIP'];

    const fetchPublicUsers = async () => {
        try {
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (selectedNiche) params.append('niche', selectedNiche);

            const res = await fetch(`/api/users/public?${params.toString()}`);
            const data = await res.json();
            setPublicUsers(data);
        } catch (error) {
            console.error('Failed to fetch public users', error);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch(`/api/users/${CURRENT_USER_ID}`);
            const data = await res.json();
            setCurrentUser(data);
        } catch (error) {
            console.error('Failed to fetch current user', error);
        }
    };

    const fetchOpportunities = async () => {
        try {
            const params = new URLSearchParams();
            if (selectedOppType) params.append('type', selectedOppType);

            const res = await fetch(`/api/opportunities?${params.toString()}`);
            const data = await res.json();
            setOpportunities(data);
        } catch (error) {
            console.error('Failed to fetch opportunities', error);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (activeTab === 'community') fetchPublicUsers();
        if (activeTab === 'opportunities') fetchOpportunities();
    }, [activeTab, searchTerm, selectedNiche, selectedOppType]);

    const handleTogglePublic = async (newState: boolean) => {
        try {
            const res = await fetch(`/api/users/${CURRENT_USER_ID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isPublicProfile: newState })
            });
            const updated = await res.json();
            setCurrentUser(prev => ({ ...prev, ...updated }));
            fetchPublicUsers();
        } catch (error) {
            console.error('Failed to toggle profile', error);
        }
    };

    const handleLike = async (toUserId: string) => {
        try {
            const res = await fetch('/api/users/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fromUserId: CURRENT_USER_ID, toUserId })
            });
            const data = await res.json();
            // In a real app we'd update local state optimistically or re-fetch stats
            alert(data.liked ? 'Endosso enviado! 🔥' : 'Endosso removido.');
        } catch (error) {
            console.error('Failed to like', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            {/* Hero Section */}
            <div className="relative bg-[#111621] text-white overflow-hidden rounded-3xl mb-8 mx-4 mt-4 shadow-2xl">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-purple-900/90 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3')] bg-cover bg-center opacity-30 animate-pulse-slow" />
                </div>

                <div className="relative z-10 px-8 py-12 md:py-16 max-w-4xl mx-auto text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-4 animate-bounce">
                        🚀 Comunidade Influetech
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                        Conecte-se com a <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                            Elite dos Influenciadores
                        </span>
                    </h1>

                    {/* Profile & Navigation */}
                    <div className="flex flex-col items-center gap-6 mt-8">
                        {/* Profile Toggle & Edit */}
                        <div className="flex flex-col md:flex-row items-center gap-4 bg-white/5 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-3 px-4">
                                <span className="text-sm font-medium">Seu Perfil está:</span>
                                <button
                                    onClick={() => handleTogglePublic(!(currentUser?.isPublicProfile ?? false))}
                                    className={`
                                    relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none 
                                    ${(currentUser?.isPublicProfile ?? false) ? 'bg-green-500' : 'bg-gray-600'}
                                `}
                                >
                                    <span className={`
                                    inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out
                                    ${(currentUser?.isPublicProfile ?? false) ? 'translate-x-6' : 'translate-x-1'}
                                `} />
                                </button>
                                <span className={`text-sm font-bold ${(currentUser?.isPublicProfile ?? false) ? 'text-green-400' : 'text-gray-400'}`}>
                                    {(currentUser?.isPublicProfile ?? false) ? 'VISÍVEL' : 'OCULTO'}
                                </span>
                            </div>

                            <div className="h-8 w-px bg-white/10 hidden md:block" />

                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-6 py-2 rounded-xl bg-white text-gray-900 font-bold hover:bg-gray-100 transition-all flex items-center gap-2 text-sm"
                            >
                                <span className="material-symbols-outlined text-lg">edit</span>
                                Editar Perfil
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setActiveTab('community')}
                                className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'community'
                                    ? 'bg-white text-gray-900 shadow-lg'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                👥 Membros
                            </button>
                            <button
                                onClick={() => setActiveTab('opportunities')}
                                className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'opportunities'
                                    ? 'bg-white text-gray-900 shadow-lg'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                📌 Mural de Oportunidades
                            </button>
                            <button
                                onClick={() => setActiveTab('feed')}
                                className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'feed'
                                    ? 'bg-white text-gray-900 shadow-lg'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                💬 Feed da Comunidade
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {activeTab === 'community' ? (
                    <>
                        {/* Search & Filter Bar */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 mb-8 sticky top-4 z-20">
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                                <div className="relative w-full md:max-w-md">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                                    <input
                                        type="text"
                                        placeholder="Buscar por nome, nicho ou bio..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white transition-all"
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                                    <button onClick={() => setSelectedNiche('')} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedNiche === '' ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Todos</button>
                                    {niches.map(niche => (
                                        <button key={niche} onClick={() => setSelectedNiche(niche)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedNiche === niche ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>{niche}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Users Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {publicUsers.map(user => (
                                <div key={user.id} className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
                                    <div className="h-24 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 relative">
                                        <button
                                            onClick={() => handleLike(user.id)}
                                            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-red-500 hover:text-white transition-all text-gray-500"
                                            title="Endossar Perfil"
                                        >
                                            <span className="material-symbols-outlined text-lg">local_fire_department</span>
                                        </button>
                                    </div>
                                    <div className="px-6 pb-6 relative">
                                        <div className="relative -mt-12 mb-4">
                                            <div className="w-24 h-24 rounded-2xl bg-white dark:bg-gray-800 p-1 mx-auto shadow-lg">
                                                <div className="w-full h-full rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold text-gray-400">
                                                    {user.name.charAt(0)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center mb-6">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{user.name}</h3>
                                            {user.niche && <p className="text-sm font-medium text-primary mb-2">{user.niche}</p>}
                                            {user.bio && <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{user.bio}</p>}
                                        </div>
                                        {/* Action Button */}
                                        <div className="flex justify-center gap-3 mt-4">
                                            {user.socialInstagram && (
                                                <a href={user.socialInstagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                                </a>
                                            )}
                                            {user.socialTikTok && (
                                                <a href={user.socialTikTok} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.03 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.56.08-3.15-.33-4.54-1.09-1.49-.88-2.61-2.28-3.12-3.95-.62-2.31-.22-4.8 1.14-6.81 1.34-1.89 3.52-3.12 5.86-3.15.13 0 .26 0 .39.02v4.2c-.38-.2-1.32-.42-1.78-.42-1.55-.06-3.03.88-3.66 2.31-.63 1.43-.2 3.14 1.05 4.14 1.25 1.07 3.16.89 4.25-.32.74-.83 1.09-1.92 1.06-3.03V.02z" /></svg>
                                                </a>
                                            )}
                                            {user.socialYoutube && (
                                                <a href={user.socialYoutube} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                                                </a>
                                            )}
                                            {user.socialLinkedin && (
                                                <a href={user.socialLinkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors">
                                                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                                </a>
                                            )}
                                            {user.socialWhatsapp && (
                                                <a href={`https://wa.me/${user.socialWhatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-green-500 transition-colors">
                                                    <span className="material-symbols-outlined text-2xl">chat</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : activeTab === 'opportunities' ? (
                    <>
                        {/* Opportunities Board */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mural de Oportunidades</h2>
                            <button
                                onClick={() => setIsOpportunityModalOpen(true)}
                                className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Nova Oportunidade
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
                            <button onClick={() => setSelectedOppType('')} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedOppType === '' ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>Todas</button>
                            {oppTypes.map(type => (
                                <button key={type} onClick={() => setSelectedOppType(type)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${selectedOppType === type ? 'bg-primary text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                    {type === 'COLLAB' ? 'Collab / Parceria' :
                                        type === 'JOB' ? 'Vaga / Job' :
                                            type === 'EVENT' ? 'Evento' :
                                                type === 'PARTNERSHIP' ? 'Patrocínio' : type}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {opportunities.map(opp => (
                                <div key={opp.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${opp.type === 'COLLAB' ? 'bg-purple-100 text-purple-600' :
                                            opp.type === 'JOB' ? 'bg-green-100 text-green-600' :
                                                opp.type === 'EVENT' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-blue-100 text-blue-600'
                                            }`}>
                                            {opp.type === 'COLLAB' ? 'Collab' :
                                                opp.type === 'JOB' ? 'Job' :
                                                    opp.type === 'EVENT' ? 'Evento' : 'Patrocínio'}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(opp.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{opp.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3">{opp.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold">
                                                {opp.userName ? opp.userName.charAt(0) : '?'}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">{opp.userName || 'Anônimo'}</span>
                                        </div>
                                        <button className="text-primary font-bold text-sm hover:underline">Ver Detalhes</button>
                                    </div>
                                </div>
                            ))}
                            {opportunities.length === 0 && (
                                <div className="col-span-full text-center py-20 text-gray-500">
                                    Nenhuma oportunidade encontrada. Seja o primeiro a postar!
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <CommunityFeed />
                )}
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentUser={currentUser}
                onSave={(updated) => {
                    setCurrentUser(updated);
                    fetchPublicUsers();
                }}
            />

            <NewOpportunityModal
                isOpen={isOpportunityModalOpen}
                onClose={() => setIsOpportunityModalOpen(false)}
                onSave={() => {
                    fetchOpportunities();
                    setIsOpportunityModalOpen(false);
                }}
            />
        </div>
    );
};

const EditProfileModal = ({ isOpen, onClose, currentUser, onSave }: any) => {
    const { data: influencerData } = useInfluencer();
    const [formData, setFormData] = useState({
        name: '', bio: '', niche: '', location: '', socialInstagram: '', socialLinkedin: '', socialWhatsapp: '', socialYoutube: '', socialTikTok: ''
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                bio: currentUser.bio || '',
                niche: currentUser.niche || '',
                location: currentUser.location || '',
                socialInstagram: currentUser.socialInstagram || '',
                socialLinkedin: currentUser.socialLinkedin || '',
                socialWhatsapp: currentUser.socialWhatsapp || '',
                socialYoutube: currentUser.socialYoutube || '',
                socialTikTok: currentUser.socialTikTok || ''
            });
        }
    }, [currentUser, isOpen]);

    const importSocial = (platform: string, url: string) => {
        if (platform === 'Instagram') setFormData(prev => ({ ...prev, socialInstagram: url }));
        if (platform === 'LinkedIn') setFormData(prev => ({ ...prev, socialLinkedin: url }));
        if (platform === 'YouTube') setFormData(prev => ({ ...prev, socialYoutube: url }));
        if (platform === 'TikTok') setFormData(prev => ({ ...prev, socialTikTok: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/users/${CURRENT_USER_ID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            onSave(data);
            onClose();
        } catch (error) {
            console.error('Failed to update profile', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1A202C] w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold mb-6">Editar Perfil</h3>

                {/* Import Socials Section */}
                {influencerData?.socials?.length > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                        <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3">Importar do Meu Perfil</h4>
                        <div className="flex flex-wrap gap-2">
                            {influencerData.socials.map(social => (
                                <button
                                    key={social.id}
                                    type="button"
                                    onClick={() => importSocial(social.platform, social.url || `https://${social.platform.toLowerCase()}.com/${social.handle}`)}
                                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors flex items-center gap-2"
                                >
                                    <span>{social.platform}</span>
                                    <span className="material-symbols-outlined text-sm">add</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Nome" className="w-full p-3 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} placeholder="Bio" className="w-full p-3 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    <select
                        value={formData.niche}
                        onChange={e => setFormData({ ...formData, niche: e.target.value })}
                        className="w-full p-3 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                        <option value="">Selecione um Nicho</option>
                        {['Gamer', 'Tech', 'Lifestyle', 'Reviews', 'Blog'].map(n => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                    <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="Localização" className="w-full p-3 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />

                    <div className="grid grid-cols-2 gap-4">
                        <input value={formData.socialInstagram} onChange={e => setFormData({ ...formData, socialInstagram: e.target.value })} placeholder="Instagram (URL)" className="w-full p-3 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <input value={formData.socialTikTok} onChange={e => setFormData({ ...formData, socialTikTok: e.target.value })} placeholder="TikTok (URL)" className="w-full p-3 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input value={formData.socialYoutube} onChange={e => setFormData({ ...formData, socialYoutube: e.target.value })} placeholder="YouTube (URL)" className="w-full p-3 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                        <input value={formData.socialLinkedin} onChange={e => setFormData({ ...formData, socialLinkedin: e.target.value })} placeholder="LinkedIn (URL)" className="w-full p-3 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    </div>

                    <div>
                        <input
                            value={formData.socialWhatsapp}
                            onChange={e => {
                                let v = e.target.value.replace(/\D/g, '');
                                if (v.length > 13) v = v.slice(0, 13);
                                if (v.length > 11) {
                                    v = v.replace(/^(\d{2})(\d{2})(\d{5})(\d{4}).*/, '+$1 $2 $3-$4');
                                } else if (v.length > 2) {
                                    v = v.replace(/^(\d{2})(\d{0,5})(\d{0,4}).*/, '($1) $2-$3');
                                }
                                setFormData({ ...formData, socialWhatsapp: v });
                            }}
                            placeholder="WhatsApp: (00) 00000-0000"
                            className="w-full p-3 rounded-lg border bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border dark:border-gray-600 dark:text-white">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const NewOpportunityModal = ({ isOpen, onClose, onSave }: any) => {
    const [formData, setFormData] = useState({ title: '', description: '', type: 'COLLAB' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch('/api/opportunities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, userId: CURRENT_USER_ID })
            });
            onSave();
        } catch (error) {
            console.error('Failed to create opportunity', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#1A202C] w-full max-w-md rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Nova Oportunidade</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Título (Ex: Procuro Editor)" className="w-full p-3 rounded-lg border" required />
                    <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Descrição detalhada..." className="w-full p-3 rounded-lg border" rows={4} required />
                    <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full p-3 rounded-lg border">
                        <option value="COLLAB">Collab / Parceria</option>
                        <option value="JOB">Vaga / Freelance</option>
                        <option value="EVENT">Evento</option>
                        <option value="PARTNERSHIP">Patrocínio</option>
                    </select>
                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border">Cancelar</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white">Publicar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default function Networking() {
    return (
        <PremiumFeatureWrapper featureName="Networking">
            <NetworkingContent />
        </PremiumFeatureWrapper>
    );
}

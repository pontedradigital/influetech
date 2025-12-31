import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type CookiePreferences = {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
};

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true, // Always true and disabled
        analytics: true,
        marketing: true,
    });

    useEffect(() => {
        const consent = localStorage.getItem('influetech_cookie_consent');
        if (!consent) {
            // Small delay to not feel jarring on load
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        saveConsent({ necessary: true, analytics: true, marketing: true });
    };

    const handleRejectAll = () => {
        saveConsent({ necessary: true, analytics: false, marketing: false });
    };

    const handleSavePreferences = () => {
        saveConsent(preferences);
    };

    const saveConsent = (prefs: CookiePreferences) => {
        localStorage.setItem('influetech_cookie_consent', JSON.stringify(prefs));
        localStorage.setItem('influetech_cookie_date', new Date().toISOString());
        setIsVisible(false);
        // Here you would trigger actual scripts enabling/disabling based on prefs
    };

    if (!isVisible) return null;

    if (showPreferences) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-neutral-900 border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-300">
                    <h3 className="text-xl font-bold text-white mb-2">Preferências de Cookies</h3>
                    <p className="text-slate-400 text-sm mb-6">
                        Personalize quais cookies você deseja permitir. Cookies necessários não podem ser desativados pois são essenciais para o funcionamento do site.
                    </p>

                    <div className="space-y-4 mb-8">
                        {/* Necessary */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 opacity-70">
                            <div>
                                <p className="font-bold text-white text-sm">Necessários</p>
                                <p className="text-xs text-slate-500">Essenciais para o site funcionar.</p>
                            </div>
                            <input type="checkbox" checked={true} disabled className="accent-purple-600 h-5 w-5 rounded border-white/20 bg-white/10" />
                        </div>

                        {/* Analytics */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                            <div>
                                <p className="font-bold text-white text-sm">Analíticos</p>
                                <p className="text-xs text-slate-500">Ajudam a melhorar a experiência.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={preferences.analytics}
                                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                className="accent-purple-600 h-5 w-5 rounded border-white/20 bg-white/10 cursor-pointer"
                            />
                        </div>

                        {/* Marketing */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5">
                            <div>
                                <p className="font-bold text-white text-sm">Marketing</p>
                                <p className="text-xs text-slate-500">Para anúncios relevantes.</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={preferences.marketing}
                                onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                                className="accent-purple-600 h-5 w-5 rounded border-white/20 bg-white/10 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleSavePreferences}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors w-full sm:flex-1"
                        >
                            Salvar Preferências
                        </button>
                        <button
                            onClick={() => setShowPreferences(false)}
                            className="border border-white/10 hover:bg-white/5 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors w-full sm:flex-1"
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-8 md:bottom-8 md:right-auto md:max-w-md z-[50] animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="bg-neutral-900/95 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-start gap-4 mb-4">
                    <span className="text-2xl pt-1">🍪</span>
                    <div>
                        <h4 className="font-bold text-white text-lg mb-1">Valorizamos sua privacidade</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Utilizamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa <Link to="/privacidade" className="text-purple-400 hover:underline">Política de Privacidade</Link>.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={handleAcceptAll}
                        className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-purple-50 transition-colors text-sm"
                    >
                        Aceitar Tudo
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={handleRejectAll}
                            className="flex-1 py-3 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors text-sm"
                        >
                            Rejeitar
                        </button>
                        <button
                            onClick={() => setShowPreferences(true)}
                            className="flex-1 py-3 bg-transparent border border-white/20 text-white font-bold rounded-xl hover:bg-white/5 transition-colors text-sm"
                        >
                            Preferências
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;

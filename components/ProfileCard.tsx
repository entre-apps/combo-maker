import React, { useEffect, useMemo, useState } from 'react';
import type { Profile, PlanType } from '../types';
import { DB } from '../data/products';
import { formatCurrency } from '../utils/formatters';

interface ProfileCardProps {
    profile: Profile;
    planType: PlanType;
    isSelected: boolean;
    onSelect: (profile: Profile) => void;
}

const getLogoUrl = (appId: string, appName: string): string => {
    const manualMap: Record<string, string> = {
        'app-deezer': 'deezer_logo.png',
        'app-disney-noads': 'disneyplus_logo.png',
        'app-hbo-noads': 'hbo_max_logo.png',
        'app-exitlag': 'exit_lag_logo.png',
    };
    if (manualMap[appId]) return `/images/${manualMap[appId]}`;
    const slug = appName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\+/g, 'plus').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
    return `/images/${slug}_logo.png`;
};

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, planType, isSelected, onSelect }) => {
    const isStreamingProfile = profile.id === 'profile-streaming';
    const [selectedAppId, setSelectedAppId] = useState<string | null>(profile.config.appIds?.[0] || null);

    useEffect(() => setSelectedAppId(profile.config.appIds?.[0] || null), [profile.id]);

    const internetPlan = useMemo(
        () => DB.internet[planType].find((plan) => plan.id === profile.config.internetId),
        [planType, profile.config.internetId],
    );

    const prices = useMemo(() => {
        if (!internetPlan) return { current: 0, full: 0 };
        let current = internetPlan.price;
        let full = internetPlan.fullPrice || internetPlan.price;
        const appIds = isStreamingProfile && selectedAppId ? [selectedAppId] : profile.config.appIds || [];
        appIds.forEach((id) => {
            const app = DB.apps.find((item) => item.id === id);
            if (app) {
                current += app.comboPrice;
                full += app.comboPrice;
            }
        });
        const omni = DB.omni.find((item) => item.id === profile.config.omniId);
        if (omni) {
            current += omni.price;
            full += omni.price;
        }
        return { current, full };
    }, [internetPlan, isStreamingProfile, profile.config.appIds, profile.config.omniId, selectedAppId]);

    const handleSelect = () => {
        onSelect(isStreamingProfile && selectedAppId
            ? { ...profile, config: { ...profile.config, appIds: [selectedAppId] } }
            : profile);
    };

    return (
        <article className={`premium-card relative flex h-full flex-col overflow-hidden rounded-[26px] bg-white ${isSelected ? 'border-entre-purple-mid ring-4 ring-entre-purple-mid/15' : ''}`}>
            {profile.isPopular && (
                <span className="absolute right-4 top-4 z-10 rounded-full bg-entre-orange px-3 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-white">Mais escolhido</span>
            )}

            <div className="px-6 pb-5 pt-7">
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-entre-purple-mid">Combo sugerido</span>
                <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-entre-purple-dark">{profile.name}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">{profile.description}</p>
            </div>

            <div className="mx-6 rounded-2xl bg-entre-purple-light/45 p-4">
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-entre-purple-dark/50">Conexão</p>
                <p className="mt-1 text-base font-extrabold text-entre-purple-dark">{internetPlan?.name} <span className="font-semibold text-entre-purple-mid">com Wi-Fi 6</span></p>
            </div>

            {internetPlan?.includedBenefits?.length ? (
                <div className="mx-6 mt-4 border-y border-entre-purple-light py-4">
                    <p className="mb-3 text-[9px] font-black uppercase tracking-[0.16em] text-entre-purple-dark/50">Benefício incluso</p>
                    {internetPlan.includedBenefits.map((benefit) => (
                        <div key={benefit.id} className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-entre-purple-light/55">
                                <img src={benefit.logoUrl} alt={`Logo ${benefit.name}`} className="h-7 w-7 object-contain" />
                            </div>
                            <span className="text-xs font-extrabold text-entre-purple-dark">{benefit.label}</span>
                        </div>
                    ))}
                </div>
            ) : null}

            <div className="flex-grow px-6 py-5">
                <p className="mb-3 text-[9px] font-black uppercase tracking-[0.16em] text-entre-purple-dark/50">Aplicativos do combo</p>
                <div className="flex flex-wrap gap-2">
                    {profile.config.appIds?.map((appId) => {
                        const app = DB.apps.find((item) => item.id === appId);
                        if (!app) return null;
                        const active = !isStreamingProfile || selectedAppId === appId;
                        return (
                            <button
                                key={app.id}
                                type="button"
                                onClick={() => isStreamingProfile && setSelectedAppId(app.id)}
                                className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all ${active ? 'border-entre-purple-mid/30 bg-white shadow-sm' : 'border-transparent bg-gray-50 opacity-50'}`}
                            >
                                <img src={getLogoUrl(app.id, app.name)} alt="" className="h-7 w-7 object-contain" />
                                <span className="text-[10px] font-extrabold text-entre-purple-dark">{app.name}</span>
                            </button>
                        );
                    })}
                    {profile.config.omniId && <span className="rounded-xl bg-entre-purple-dark px-3 py-2 text-[10px] font-extrabold text-white">+ OMNI LAN</span>}
                </div>
            </div>

            <div className={`mt-auto px-6 py-5 ${profile.isPopular ? 'bg-entre-purple-dark text-white' : 'bg-entre-purple-light/45 text-entre-purple-dark'}`}>
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] opacity-60">Combo completo por</p>
                <div className="mt-1 flex items-baseline gap-1">
                    <span className="font-display text-3xl font-extrabold tracking-tight">{formatCurrency(prices.current)}</span>
                    <span className="text-[10px] opacity-60">/mês</span>
                </div>
                {prices.full !== prices.current && <p className="mt-1 text-[9px] opacity-60">Após 3 meses: {formatCurrency(prices.full)}/mês</p>}
                <button
                    type="button"
                    onClick={handleSelect}
                    className={`mt-4 w-full rounded-full px-5 py-3 text-sm font-extrabold ${isSelected ? 'bg-entre-orange text-white' : profile.isPopular ? 'bg-white text-entre-purple-dark' : 'bg-entre-purple-dark text-white'}`}
                >
                    {isSelected ? 'Combo selecionado' : 'Escolher combo'}
                </button>
            </div>
        </article>
    );
};

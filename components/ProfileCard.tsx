
import React, { useMemo, useState, useEffect } from 'react';
import type { Profile, PlanType } from '../types';
import { DB } from '../data/products';
import { formatCurrency } from '../utils/formatters';

interface ProfileCardProps {
    profile: Profile;
    planType: PlanType;
    isSelected: boolean;
    onSelect: (profile: Profile) => void;
}

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, planType, isSelected, onSelect }) => {
    
    // Identifica se é o perfil de streaming que requer lógica "OU"
    const isStreamingProfile = profile.id === 'profile-streaming';

    // Estado para controlar qual app está selecionado (apenas para streaming)
    const [selectedAppId, setSelectedAppId] = useState<string | null>(
        profile.config.appIds && profile.config.appIds.length > 0 ? profile.config.appIds[0] : null
    );

    // Se o perfil mudar, reseta a seleção
    useEffect(() => {
        if (profile.config.appIds && profile.config.appIds.length > 0) {
            setSelectedAppId(profile.config.appIds[0]);
        }
    }, [profile.id]);

    const internetPlan = useMemo(() => {
        return DB.internet[planType].find(p => p.id === profile.config.internetId);
    }, [planType, profile.config.internetId]);

    const prices = useMemo(() => {
        if (!internetPlan) return { current: 0, full: 0, hasPromo: false };

        let current = internetPlan.price;
        let full = internetPlan.fullPrice || internetPlan.price;
        const hasPromo = !!internetPlan.fullPrice;

        if (isStreamingProfile && selectedAppId) {
            const app = DB.apps.find(a => a.id === selectedAppId);
            if (app) {
                current += app.comboPrice;
                full += app.comboPrice;
            }
        } else {
            profile.config.appIds?.forEach(id => {
                const app = DB.apps.find(a => a.id === id);
                if (app) {
                    current += app.comboPrice;
                    full += app.comboPrice;
                }
            });
        }

        if (profile.config.omniId) {
            const omni = DB.omni.find(o => o.id === profile.config.omniId);
            if (omni) {
                current += omni.price;
                full += omni.price;
            }
        }

        return { current, full, hasPromo };
    }, [profile, planType, isStreamingProfile, selectedAppId, internetPlan]);

    const handleMainClick = () => {
        if (isStreamingProfile && selectedAppId) {
            const modifiedProfile: Profile = {
                ...profile,
                config: {
                    ...profile.config,
                    appIds: [selectedAppId]
                }
            };
            onSelect(modifiedProfile);
        } else {
            onSelect(profile);
        }
    };

    const getLogoUrl = (appId: string, appName: string): string => {
        const manualMap: Record<string, string> = {
            'app-deezer': 'deezer_logo.png',
            'app-disney-noads': 'disneyplus_logo.png',
            'app-disney-ads': 'disneyplus_logo.png',
            'app-hbo-noads': 'hbo_max_logo.png',
            'app-hbo-ads': 'hbo_max_logo.png',
            'app-exitlag': 'exit_lag_logo.png',
        };

        if (manualMap[appId]) {
            return `/images/${manualMap[appId]}`;
        }

        const slug = appName
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim()
            .replace(/\+/g, 'plus')
            .replace(/&/g, 'e')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '_')
            .replace(/-+/g, '_');
        
        return `/images/${slug}_logo.png`;
    };

    // --- LÓGICA DE VISUALIZAÇÃO COMPACTA (MOBILE) ---
    const showCompactMobile = !isSelected;
    const heightClass = showCompactMobile ? 'h-auto lg:h-full' : 'h-full';
    
    // Se estiver compacto, usamos fundo branco para ficar limpo. Se expandido, as cores internas (roxo) preenchem.
    const bgClass = showCompactMobile ? 'bg-white' : 'bg-transparent';

    return (
        <div
            onClick={!isSelected ? handleMainClick : undefined}
            className={`flex flex-col ${heightClass} ${bgClass} rounded-[2rem] overflow-hidden transition-all duration-300 shadow-xl w-full text-center border-4 relative cursor-pointer ${
                isSelected ? 'border-entre-purple-mid ring-4 ring-entre-purple-mid/20 transform -translate-y-2' : 'border-transparent hover:-translate-y-2'
            }`}
        >
            
            {/* --- VISÃO COMPACTA MOBILE --- */}
            {showCompactMobile && (
                <div className="lg:hidden flex flex-row items-center justify-between w-full p-5 h-24 relative">
                     {/* Badge Lider de Vendas Compacto */}
                     {profile.isPopular && (
                         <>
                            <div className="absolute top-0 left-0 right-0 h-1 bg-entre-orange"></div>
                            <div className="absolute top-1 right-4 bg-entre-orange text-white text-[8px] font-black px-2 py-0.5 rounded-b-md uppercase tracking-widest">
                                Líder de Vendas
                            </div>
                         </>
                    )}

                    <div className="flex flex-col items-start text-left">
                        <h3 className="text-lg font-black uppercase tracking-tight leading-none text-entre-purple-dark">
                            {profile.name}
                        </h3>
                         {/* Resumo do Combo */}
                         <span className="text-[10px] text-gray-500 mt-1 max-w-[150px] truncate block font-medium">
                             {internetPlan?.name} + {profile.config.appIds?.length || 0} Apps
                         </span>
                    </div>
                    
                    <div className="flex flex-col items-end">
                        <p className="text-xl font-black leading-none text-gray-900">
                            {profile.config.internetId === 'res-800' && <span className="text-sm mr-0.5">*</span>}
                            {formatCurrency(prices.current).split(',')[0]}<span className="text-xs">,{formatCurrency(prices.current).split(',')[1]}</span>
                        </p>
                        {profile.config.internetId === 'res-800' ? (
                            <p className="text-[8px] text-entre-orange font-bold mt-0.5">*nos primeiros 3 meses</p>
                        ) : (
                            <p className="text-[9px] text-gray-400 mt-0.5 flex items-center gap-1">
                                Ver combo <ChevronDownIcon />
                            </p>
                        )}
                    </div>
                </div>
            )}


            {/* --- VISÃO COMPLETA (Desktop ou Selecionado) --- */}
            <div className={`${showCompactMobile ? 'hidden lg:flex' : 'flex'} flex-col h-full w-full`}>
                
                {/* Social Proof Badge for Profiles */}
                {profile.isPopular && !isSelected && (
                    <div className="absolute top-2 right-4 bg-entre-orange text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg z-20 uppercase tracking-widest animate-bounce">
                        Líder de Vendas
                    </div>
                )}

                {/* Cabeçalho */}
                <div className="bg-entre-purple-light h-28 flex items-center justify-center px-4 shrink-0">
                    <h3 className="text-2xl font-black text-entre-purple-dark uppercase tracking-tight leading-tight">
                        {profile.name}
                    </h3>
                </div>

                {/* Conteúdo - Roxo Escuro */}
                <div className="bg-entre-purple-dark p-5 pb-6 flex flex-col flex-grow items-center text-white relative">
                    
                    {/* Indicadores */}
                    <div className="flex items-center justify-center gap-3 mb-5 w-full bg-white/10 border border-white/10 py-2.5 rounded-xl shadow-inner backdrop-blur-sm shrink-0">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-entre-purple-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                            </svg>
                            <span className="text-sm font-black uppercase tracking-wider text-white">
                                {internetPlan?.name} com WIFI 6
                            </span>
                        </div>
                    </div>

                    {/* Símbolo de "+" */}
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-entre-purple-dark font-black text-2xl shadow-lg z-10 mb-2 shrink-0">
                        +
                    </div>

                    {/* Texto explicativo para Streaming */}
                    {isStreamingProfile && (
                        <p className="text-[10px] font-bold text-entre-purple-light uppercase tracking-widest mb-2 animate-pulse">
                            Escolha um dos apps:
                        </p>
                    )}

                    {/* Área de Apps */}
                    <div className="flex flex-col items-center justify-start min-h-[100px] w-full mb-2">
                        <div className="flex flex-wrap justify-center items-center gap-3">
                            {profile.config.appIds?.map((appId, index) => {
                                const app = DB.apps.find(a => a.id === appId);
                                if (!app) return null;
                                
                                const logoUrl = getLogoUrl(app.id, app.name);
                                const isActive = isStreamingProfile ? selectedAppId === appId : true;

                                const handleAppClick = (e: React.MouseEvent) => {
                                    if (isStreamingProfile) {
                                        e.stopPropagation();
                                        setSelectedAppId(appId);
                                    }
                                };

                                return (
                                    <React.Fragment key={appId}>
                                        <div 
                                            className={`flex flex-col items-center gap-1.5 group transition-all duration-300 ${isStreamingProfile ? 'cursor-pointer' : ''} ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-90 hover:opacity-70'}`}
                                            onClick={handleAppClick}
                                        >
                                            <div className={`w-16 h-16 bg-white/5 border rounded-xl flex items-center justify-center p-2.5 backdrop-blur-sm shadow-xl transition-all duration-300 ${isActive ? 'border-entre-orange ring-2 ring-entre-orange/50 bg-white/10' : 'border-white/20'}`}>
                                                <img 
                                                    src={logoUrl} 
                                                    alt={app.name} 
                                                    className="w-full h-full object-contain" 
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                            <span className={`text-[9px] font-black uppercase tracking-tight transition-colors ${isActive ? 'text-white' : 'text-white/60'}`}>
                                                {app.name.toUpperCase()}
                                            </span>
                                        </div>
                                        
                                        {isStreamingProfile && index === 0 && (
                                            <div className="flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-lg z-20">
                                                <span className="text-[9px] font-black text-entre-orange">OU</span>
                                            </div>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>

                    {/* Preços e Tags */}
                    <div className="mt-auto w-full">
                        <div className="h-7 flex items-center justify-center mb-1">
                            {profile.id === 'profile-gamer' && (
                                <span className="bg-entre-orange text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-tighter">
                                    Com 1 ponto OMNI LAN (cabo)
                                </span>
                            )}
                        </div>
                        
                        <div className="mb-5 flex flex-col items-center">
                            <div className="relative inline-block">
                                <p className="text-4xl font-black leading-none tracking-tighter">
                                    {profile.config.internetId === 'res-800' && <span className="text-xl mr-1">*</span>}
                                    {formatCurrency(prices.current).split(',')[0]}<span className="text-xl">,{formatCurrency(prices.current).split(',')[1]}</span>
                                    <span className="text-base font-bold ml-1">/mês</span>
                                </p>
                            </div>
                            {profile.config.internetId === 'res-800' ? (
                                <p className="text-[10px] text-white font-bold mt-1">
                                    *nos primeiros 3 meses, após {formatCurrency(prices.full)}/mês
                                </p>
                            ) : prices.hasPromo && (
                                <p className="text-[10px] text-white/60 font-medium mt-1">
                                    *Nos primeiros 3 meses, após {formatCurrency(prices.full)}/mês
                                </p>
                            )}
                        </div>

                        <button 
                            onClick={handleMainClick}
                            className={`w-full py-3.5 px-6 rounded-xl font-black text-lg transition-all shadow-xl active:scale-95 ${
                                isSelected 
                                ? 'bg-entre-orange text-white' 
                                : 'bg-white text-entre-purple-dark hover:bg-entre-purple-light'
                            }`}
                        >
                            {isSelected ? 'Selecionado ✓' : 'Escolher este'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

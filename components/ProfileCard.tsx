
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

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, planType, isSelected, onSelect }) => {
    
    // Identifica se é o perfil de streaming que requer lógica "OU"
    const isStreamingProfile = profile.id === 'profile-streaming';

    // Estado para controlar qual app está selecionado (apenas para streaming)
    // Inicializa com o primeiro app da lista
    const [selectedAppId, setSelectedAppId] = useState<string | null>(
        profile.config.appIds && profile.config.appIds.length > 0 ? profile.config.appIds[0] : null
    );

    // Se o perfil mudar, reseta a seleção
    useEffect(() => {
        if (profile.config.appIds && profile.config.appIds.length > 0) {
            setSelectedAppId(profile.config.appIds[0]);
        }
    }, [profile.id]);

    // Lógica para calcular os preços baseados na configuração do perfil
    const prices = useMemo(() => {
        // Preços fixos manuais para perfis específicos (fallback)
        if (planType === 'casa') {
            // Combo Music: 89.90 (Internet) + 10.00 (Deezer Standard) = 99.90
            // Valor fixo permanente
            if (profile.id === 'profile-music') return { current: 99.90, full: 124.90 }; // Full price apenas para ancora
            
            // Combo Gamer: 89.90 (Internet) + 10.00 (ExitLag Standard) + 8.00 (Omni Cabo) = 107.90
            if (profile.id === 'profile-gamer') return { current: 107.90, full: 132.90 };
            
            // Combo Streaming: 89.90 (Internet) + 30.00 (HBO/Disney Premium) = 119.90
            if (profile.id === 'profile-streaming' && !isStreamingProfile) return { current: 119.90, full: 144.90 }; 
        }

        const internet = DB.internet[planType].find(p => p.id === profile.config.internetId);
        if (!internet) return { current: 0, full: 0 };

        let current = internet.price;
        let full = internet.fullPrice || internet.price;

        // Se for Streaming, soma APENAS o app selecionado
        if (isStreamingProfile && selectedAppId) {
            const app = DB.apps.find(a => a.id === selectedAppId);
            if (app) {
                current += app.comboPrice;
                full += app.comboPrice;
            }
        } else {
            // Comportamento padrão: Soma todos os apps (ex: Família, Gamer)
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

        return { current, full };
    }, [profile, planType, isStreamingProfile, selectedAppId]);

    // Manipulador de clique no botão principal "Contratar"
    const handleMainClick = () => {
        if (isStreamingProfile && selectedAppId) {
            // Cria uma cópia do perfil apenas com o app selecionado
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

    // Função auxiliar para garantir os nomes corretos das imagens
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

    return (
        <div
            className={`flex flex-col h-full rounded-[2rem] overflow-hidden transition-all duration-300 shadow-xl w-full text-center border-4 ${
                isSelected ? 'border-entre-purple-mid ring-4 ring-entre-purple-mid/20 transform -translate-y-2' : 'border-transparent hover:-translate-y-2'
            }`}
        >
            {/* Cabeçalho - Altura reduzida para diminuir espaço negativo */}
            <div className="bg-entre-purple-light h-28 flex items-center justify-center px-4 shrink-0">
                <h3 className="text-2xl font-black text-entre-purple-dark uppercase tracking-tight leading-tight">
                    {profile.name}
                </h3>
            </div>

            {/* Conteúdo - Roxo Escuro */}
            <div className="bg-entre-purple-dark p-5 pb-6 flex flex-col flex-grow items-center text-white relative">
                
                {/* Indicadores - Atualizado com ícone Wifi e texto unificado */}
                <div className="flex items-center justify-center gap-3 mb-5 w-full bg-white/10 border border-white/10 py-2.5 rounded-xl shadow-inner backdrop-blur-sm shrink-0">
                     <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-entre-purple-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                        </svg>
                        <span className="text-sm font-black uppercase tracking-wider text-white">800 MEGA com WIFI 6</span>
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

                            // Handler específico para clique no ícone do app
                            const handleAppClick = (e: React.MouseEvent) => {
                                if (isStreamingProfile) {
                                    e.stopPropagation(); // Evita disparar seleção do card inteiro se não desejado, ou mantemos.
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
                    {/* Tag Gamer - Espaço reservado ajustado */}
                    <div className="h-7 flex items-center justify-center mb-1">
                        {profile.id === 'profile-gamer' && (
                            <span className="bg-entre-orange text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-tighter">
                                Com 1 ponto OMNI LAN (cabo)
                            </span>
                        )}
                    </div>
                    
                    <div className="mb-5">
                        <div className="relative inline-block">
                            <p className="text-4xl font-black leading-none tracking-tighter">
                                {formatCurrency(prices.current).split(',')[0]}<span className="text-xl">,{formatCurrency(prices.current).split(',')[1]}</span>
                                <span className="text-base font-bold ml-1">/mês</span>
                            </p>
                        </div>
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
    );
};

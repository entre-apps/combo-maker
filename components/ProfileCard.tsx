
import React, { useMemo } from 'react';
import type { Profile, PlanType } from '../types';
import { DB } from '../data/products';
import { formatCurrency } from '../utils/formatters';

interface ProfileCardProps {
    profile: Profile;
    planType: PlanType;
    isSelected: boolean;
    onSelect: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, planType, isSelected, onSelect }) => {
    
    // Lógica para calcular os preços baseados na configuração do perfil
    const prices = useMemo(() => {
        if (planType === 'casa') {
            if (profile.id === 'profile-music') return { current: 104.90, full: 129.90 };
            if (profile.id === 'profile-gamer') return { current: 112.90, full: 137.90 };
            if (profile.id === 'profile-streaming') return { current: 124.90, full: 149.90 };
        }

        const internet = DB.internet[planType].find(p => p.id === profile.config.internetId);
        if (!internet) return { current: 0, full: 0 };

        let current = internet.price;
        let full = internet.fullPrice || internet.price;

        profile.config.appIds?.forEach(id => {
            const app = DB.apps.find(a => a.id === id);
            if (app) {
                current += app.comboPrice;
                full += app.comboPrice;
            }
        });

        if (profile.config.omniId) {
            const omni = DB.omni.find(o => o.id === profile.config.omniId);
            if (omni) {
                current += omni.price;
                full += omni.price;
            }
        }

        return { current, full };
    }, [profile, planType]);

    const slugify = (text: string): string => {
        return text
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
    };

    return (
        <button
            onClick={onSelect}
            className={`flex flex-col h-full rounded-[2.5rem] overflow-hidden transition-all duration-300 shadow-xl w-full transform hover:-translate-y-2 active:scale-95 text-center border-4 ${
                isSelected ? 'border-entre-purple-mid ring-4 ring-entre-purple-mid/20' : 'border-transparent'
            }`}
        >
            {/* Cabeçalho - Altura FIXA absoluta para alinhamento horizontal perfeito */}
            <div className="bg-entre-purple-light h-[140px] flex items-center justify-center px-6">
                <h3 className="text-3xl font-black text-entre-purple-dark uppercase tracking-tight leading-tight">
                    {profile.name}
                </h3>
            </div>

            {/* Conteúdo - Roxo Escuro */}
            <div className="bg-entre-purple-dark p-6 pb-8 flex flex-col flex-grow items-center text-white relative">
                
                {/* Indicadores - Altura fixa para não empurrar o "+" */}
                <div className="flex items-center justify-center gap-4 h-6 mb-8 w-full">
                     <div className="flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-entre-purple-light fill-current" viewBox="0 0 24 24"><path d="M12 21l-12-18h24z"/></svg>
                        <span className="text-[11px] font-black uppercase tracking-wider">800 Mega</span>
                     </div>
                     <span className="bg-entre-orange text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-tighter">
                        WiFi 6
                    </span>
                </div>

                {/* Símbolo de "+" - Agora ancorado em posição fixa em relação ao topo da div roxa */}
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-entre-purple-dark font-black text-3xl shadow-lg z-10 mb-6">
                    +
                </div>

                {/* Área de Apps - Altura mínima para manter os preços alinhados na base */}
                <div className="flex flex-col items-center justify-start min-h-[140px] w-full mb-4">
                    <div className="flex flex-wrap justify-center items-center gap-4">
                         {profile.config.appIds?.map((appId, index) => {
                            const app = DB.apps.find(a => a.id === appId);
                            if (!app) return null;
                            const logoUrl = `/images/${slugify(app.name)}_logo.png`;
                            return (
                                <React.Fragment key={appId}>
                                    <div className="flex flex-col items-center gap-2 group">
                                        <div className="w-20 h-20 bg-white/5 border border-white/20 rounded-2xl flex items-center justify-center p-3 backdrop-blur-sm shadow-xl transition-all duration-300 group-hover:bg-white/10 group-hover:scale-105">
                                            <img 
                                                src={logoUrl} 
                                                alt={app.name} 
                                                className="w-full h-full object-contain brightness-0 invert" 
                                            />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-tight text-white">
                                            {app.name.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    {profile.id === 'profile-streaming' && index === 0 && (
                                        <div className="flex items-center justify-center w-7 h-7 bg-white rounded-full shadow-lg z-20">
                                            <span className="text-[10px] font-black text-entre-orange">OU</span>
                                        </div>
                                    )}
                                </React.Fragment>
                            )
                         })}
                    </div>
                </div>

                {/* Preços e Tags */}
                <div className="mt-auto w-full">
                    {/* Tag Gamer - Altura fixa reservada para manter alinhamento mesmo onde não existe a tag */}
                    <div className="h-8 flex items-center justify-center mb-2">
                        {profile.id === 'profile-gamer' && (
                            <span className="bg-entre-orange text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-tighter">
                                Ponto Cabo incluso
                            </span>
                        )}
                    </div>
                    
                    <div className="mb-8">
                        <p className="text-xs font-bold opacity-50 line-through mb-1">
                            de: {formatCurrency(prices.full)}/mês
                        </p>
                        <div className="relative inline-block">
                            <p className="text-5xl font-black leading-none tracking-tighter">
                                {formatCurrency(prices.current).split(',')[0]}<span className="text-2xl">,{formatCurrency(prices.current).split(',')[1]}</span>
                                <span className="text-lg font-bold ml-1">/mês*</span>
                            </p>
                        </div>
                        <div className="mt-2 bg-white/10 px-3 py-1 rounded-full inline-block">
                            <p className="text-[10px] font-black uppercase tracking-tighter text-entre-purple-light">
                                *Nos primeiros 3 meses
                            </p>
                        </div>
                    </div>

                    <div className={`w-full py-4 px-6 rounded-2xl font-black text-xl transition-all shadow-xl active:scale-95 ${
                        isSelected 
                        ? 'bg-entre-orange text-white' 
                        : 'bg-white text-entre-purple-dark hover:bg-entre-purple-light'
                    }`}>
                        {isSelected ? 'Selecionado ✓' : 'Contratar'}
                    </div>
                </div>
            </div>
        </button>
    );
};

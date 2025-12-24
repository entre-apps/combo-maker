
import React from 'react';
import type { InternetPlan, TvPlan, OmniPlan, NoBreakPlan } from '../types';
import { formatCurrency } from '../utils/formatters';

type Plan = InternetPlan | TvPlan | OmniPlan | NoBreakPlan;

interface PlanCardProps {
    plan: Plan;
    isSelected: boolean;
    onSelect: () => void;
    planType: 'internet' | 'addon';
    bestOfferText?: string;
    hasComboDiscount?: boolean;
    isDark?: boolean;
    autoHeight?: boolean;
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

export const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect, planType, bestOfferText = 'Melhor Oferta', hasComboDiscount, isDark = false, autoHeight = false }) => {
    
    const isTvPlan = plan.id.startsWith('tv-');
    const isHighlighted = 'bestOffer' in plan && plan.bestOffer;

    const heightClass = autoHeight ? 'h-auto' : 'h-full';
    const cardBaseClasses = `relative flex flex-col ${heightClass} rounded-2xl p-5 border transition-all duration-300 w-full group cursor-pointer`;
    
    // Logic for dynamic borders and shadows (Glow effect)
    const cardStateClasses = isSelected
        ? isDark 
            ? 'bg-gray-800 border-entre-purple-mid shadow-[0_0_20px_rgba(157,78,221,0.3)] scale-[1.02]'
            : 'bg-white border-entre-purple-mid ring-1 ring-entre-purple-mid shadow-[0_0_25px_rgba(157,78,221,0.15)] scale-[1.02]'
        : isDark
            // Alterado aqui: Removemos o hover:bg-gray-700 e adicionamos borda mais clara e leve elevação
            ? 'bg-gray-800 border-gray-700 hover:border-gray-400 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5)] hover:-translate-y-1'
            : 'bg-white border-gray-200 hover:border-entre-purple-mid/50 hover:shadow-lg hover:-translate-y-1';

    const cardColorClasses = isHighlighted && !isSelected
        ? `bg-gradient-to-b from-white to-purple-50 border-entre-purple-light` 
        : '';
    
    const titleColor = (isDark) ? 'text-white' : 'text-entre-purple-dark';
    const textColor = (isDark) ? 'text-gray-300' : 'text-gray-600';
    
    const buttonText = isSelected 
        ? (planType === 'internet' ? 'Plano Selecionado' : 'Remover') 
        : (planType === 'internet' ? 'Escolher este' : 'Adicionar');

    const buttonBaseClasses = 'w-full font-bold py-2 px-4 rounded-xl transition-all duration-300 ease-in-out text-sm tracking-wide';
    
    const buttonSelectedClasses = isDark
            ? 'bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20'
            : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100';
    
    const buttonDefaultClasses = isHighlighted
        ? 'bg-entre-orange text-white shadow-md hover:bg-orange-500 hover:shadow-lg transform hover:scale-[1.02]'
        : isDark
            ? 'bg-gray-700 text-white hover:bg-entre-purple-mid border border-gray-600 hover:border-entre-purple-mid'
            : 'bg-entre-purple-light text-entre-purple-dark hover:bg-entre-purple-mid hover:text-white';

    // Helper to bold specific keywords
    const formatFeature = (text: string) => {
        const keywords = ['Wifi 6', 'Upload', 'Instalação Gratuita', 'roteadores'];
        const parts = text.split(new RegExp(`(${keywords.join('|')})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) => 
                    keywords.some(k => k.toLowerCase() === part.toLowerCase()) 
                        ? <strong key={i} className={isDark ? "text-entre-purple-light" : "text-entre-purple-dark"}>{part}</strong> 
                        : part
                )}
            </span>
        );
    };

    const renderPrice = () => {
        if (isTvPlan) return null;
        
        if ('price' in plan) {
            let currentPrice = plan.price;
            let originalPrice: number | undefined;
            const promoText = 'promo' in plan ? plan.promo : undefined;

            if ('fullPrice' in plan && plan.fullPrice) {
                 originalPrice = plan.fullPrice;
            }
            
            return (
                <div className="mt-2 mb-4">
                    <div className="h-5 flex items-center">
                        {originalPrice && (
                            <span className={`text-xs line-through ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {formatCurrency(originalPrice)}
                            </span>
                        )}
                        {promoText && (
                            <span className="ml-2 text-[9px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Promo
                            </span>
                        )}
                    </div>

                    <div className="flex items-baseline gap-1">
                        <p className={`text-3xl font-black tracking-tight ${(isDark) ? 'text-white' : 'text-gray-900'}`}>
                            {formatCurrency(currentPrice).replace(',00', '')}
                        </p>
                        <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>/mês</span>
                    </div>
                    
                     {promoText && (
                        <p className="text-[10px] text-gray-500 mt-0.5">{promoText}</p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <button onClick={onSelect} className={`${cardBaseClasses} ${cardStateClasses} ${cardColorClasses}`}>
            {isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-entre-orange text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md z-10 uppercase tracking-widest whitespace-nowrap">
                    {bestOfferText}
                </div>
            )}

            <div className="flex-grow flex flex-col w-full">

                {isTvPlan ? (
                    <>
                        <div className="relative aspect-[260/380] mb-4 bg-gray-100 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
                             <img 
                                src={`/images/${plan.id}.png`} 
                                alt={`Canais do plano ${plan.name}`} 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-4 left-0 right-0 px-4 text-center">
                                <h3 className="text-xl font-black text-white leading-tight">
                                    {plan.name}
                                </h3>
                                <p className="text-white/80 text-xs mt-1">{(plan as TvPlan).details}</p>
                            </div>
                        </div>
                        {hasComboDiscount && (
                            <div className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded mb-4 inline-block self-center">
                                Preço Especial Combo
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <h3 className={`text-xl font-black mb-1 text-left ${titleColor}`}>{plan.name}</h3>
                        
                        {'description' in plan ? (
                            <p className={`text-xs mb-4 text-left leading-relaxed min-h-[32px] ${textColor}`}>{(plan as InternetPlan).description}</p>
                        ) : (
                            <p className={`text-xs mb-4 text-left leading-relaxed ${textColor}`}>{(plan as OmniPlan | NoBreakPlan).details}</p>
                        )}
                        
                        {'features' in plan && (
                            <ul className="text-left space-y-2 mb-4">
                                {(plan as InternetPlan).features.map((feature, index) => (
                                    <li key={index} className={`flex items-start text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <CheckIcon />
                                        <span className="leading-tight">{formatFeature(feature)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {'highlight' in plan && plan.highlight && (
                            <div className={`text-[10px] font-bold rounded-lg p-2 mb-4 flex items-center justify-center text-center leading-tight ${
                                isHighlighted 
                                ? "bg-entre-purple-light text-entre-purple-dark border border-entre-purple-mid/20"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                                {plan.highlight}
                            </div>
                        )}
                    </>
                )}
            </div>
            
            <div className="mt-auto w-full">
                {renderPrice()}
                <div className={`${buttonBaseClasses} ${isSelected ? buttonSelectedClasses : buttonDefaultClasses}`}>
                    {buttonText}
                </div>
            </div>
        </button>
    );
};



import React from 'react';
// FIX: Correctly import all necessary types from the `types` module.
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
}

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

export const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect, planType, bestOfferText = 'Melhor Oferta', hasComboDiscount, isDark = false }) => {
    
    const isTvPlan = plan.id.startsWith('tv-');
    const isHighlighted = 'bestOffer' in plan && plan.bestOffer;

    const cardBaseClasses = 'relative flex flex-col h-full rounded-xl p-6 border-2 transition-all duration-300 shadow-lg text-center w-full';
    const cardColorClasses = isHighlighted
        ? `bg-entre-purple-dark text-white border-transparent`
        : isDark
            ? `bg-gray-800 text-white ${isSelected ? 'border-entre-purple-mid ring-4 ring-entre-purple-mid/30' : 'border-gray-700'}`
            : `bg-white ${isSelected ? 'border-entre-purple-dark ring-4 ring-entre-purple-mid/30' : 'border-transparent'}`;
    
    const cardHoverClasses = isSelected ? '' 
        : (isHighlighted || !isDark) 
            ? 'transform hover:-translate-y-1 active:scale-95'
            : 'hover:border-entre-orange';
    
    const titleColor = (isDark || isHighlighted) ? 'text-white' : 'text-entre-purple-dark';
    const textColor = (isDark || isHighlighted) ? 'text-gray-300' : 'text-gray-600';
    
    const buttonText = isSelected 
        ? (planType === 'internet' ? 'Selecionado ✓' : 'Remover') 
        : (planType === 'internet' ? 'Selecionar Plano' : 'Adicionar');

    const buttonBaseClasses = 'w-full font-bold py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out';
    const buttonSelectedClasses = isHighlighted
        ? 'bg-entre-orange text-white'
        : isDark
            ? 'bg-gray-700 text-red-400 border border-red-500 hover:bg-gray-600'
            : 'bg-white text-red-600 border border-red-500 shadow-sm hover:bg-red-50';
    
    const buttonDefaultClasses = isHighlighted
        ? 'bg-white text-entre-purple-dark hover:bg-gray-200'
        : isDark
            ? 'bg-entre-purple-mid text-white hover:bg-entre-purple-dark'
            : 'bg-entre-purple-mid text-white hover:bg-entre-purple-dark';

    const renderPrice = () => {
        if (isTvPlan) {
            return null;
        }
        
        if ('price' in plan) {
            let currentPrice = plan.price;
            let originalPrice: number | undefined;
            const promoText = 'promo' in plan ? plan.promo : undefined;

            if ('fullPrice' in plan && plan.fullPrice) {
                 originalPrice = plan.fullPrice;
            }
            
            return (
                <div className="mb-6">
                    {/* Placeholder for original price to ensure alignment */}
                    <div className="h-7 flex items-center justify-center">
                        {originalPrice && (
                            <p className={`line-through text-lg ${(isDark || isHighlighted) ? 'text-gray-400' : 'text-gray-500'}`}>{formatCurrency(originalPrice)}</p>
                        )}
                    </div>

                    <p className={`text-4xl font-bold ${(isDark || isHighlighted) ? 'text-white' : 'text-entre-purple-dark'}`}>{formatCurrency(currentPrice)}<span className="text-lg font-normal">/mês</span></p>

                    {/* Placeholder for promo text to ensure alignment */}
                    <div className="h-5 mt-1 flex items-center justify-center">
                        {promoText && (
                            <p className={`text-sm font-bold ${((isDark || isHighlighted) ? 'text-entre-purple-light' : 'text-entre-purple-mid')}`}>{promoText}</p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <button
            onClick={onSelect}
            className={`${cardBaseClasses} ${cardColorClasses} ${cardHoverClasses}`}
        >
            {isHighlighted && (
                <div className="absolute top-0 right-4 -translate-y-1/2 bg-entre-orange text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                    {bestOfferText}
                </div>
            )}

            <div className="flex-grow flex flex-col">

                {/* Specific Layout for TV Plans */}
                {isTvPlan ? (
                    <>
                        <div className="relative aspect-[260/380] mb-3 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden shadow-inner">
                             <img 
                                src={`/images/${plan.id}.png`} 
                                alt={`Canais do plano ${plan.name}`} 
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                                <h3 className="text-xl font-bold text-white text-center" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                                    {plan.name}
                                </h3>
                            </div>
                        </div>
                        <div className="mb-3 flex-grow">
                            <p className={`text-sm ${textColor}`}>{(plan as TvPlan).details}</p>
                            {hasComboDiscount && (
                                <p className="text-sm mt-1 font-bold text-green-600">Desconto de combo ativo!</p>
                            )}
                        </div>
                    </>
                ) : (
                /* Layout for Internet and other Addons */
                    <>
                        <h3 className={`text-2xl font-bold mb-2 ${titleColor}`}>{plan.name}</h3>
                        {'description' in plan ? (
                            <p className={`text-sm mb-4 min-h-[60px] ${textColor}`}>{(plan as InternetPlan).description}</p>
                        ) : (
                            <p className={`text-sm mb-4 min-h-[40px] ${textColor}`}>{(plan as OmniPlan | NoBreakPlan).details}</p>
                        )}
                        
                        {'features' in plan && (
                            <ul className="text-left space-y-2 text-sm">
                                {(plan as InternetPlan).features.map((feature, index) => (
                                    <li key={index} className="flex items-center">
                                        <CheckIcon />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="flex-grow">
                            {'highlight' in plan && plan.highlight && (
                                <div className={ isHighlighted 
                                    ? "bg-white/10 text-white font-semibold text-sm rounded-lg p-3 my-4 flex items-center justify-center"
                                    : "bg-entre-purple-light text-entre-purple-dark font-semibold text-sm rounded-lg p-3 my-4 flex items-center justify-center"
                                }>
                                    <span>{plan.highlight}</span>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
            
            <div className="mt-auto">
                {renderPrice()}
                <div className={`${buttonBaseClasses} ${isSelected ? buttonSelectedClasses : buttonDefaultClasses}`}>
                    {buttonText}
                </div>
            </div>
        </button>
    );
};
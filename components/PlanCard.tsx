
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
    const isPopular = 'isPopular' in plan && plan.isPopular;

    const heightClass = autoHeight ? 'h-auto' : 'h-full';
    
    // Pill Shape Container - Replicando estilo do ProfileCard
    const containerClasses = `relative flex flex-col ${heightClass} rounded-[2rem] border-4 transition-all duration-300 w-full group cursor-pointer overflow-hidden shadow-xl`;

    let stateClasses = '';
    
    if (isSelected) {
        stateClasses = isDark 
            ? 'border-entre-purple-mid ring-4 ring-entre-purple-mid/30 bg-gray-800 transform -translate-y-2'
            : 'border-entre-purple-mid ring-4 ring-entre-purple-mid/20 bg-white transform -translate-y-2';
    } else {
        stateClasses = isDark
            ? 'border-transparent bg-gray-800 hover:-translate-y-2 hover:shadow-2xl'
            : 'border-transparent bg-white hover:-translate-y-2 hover:shadow-2xl';
    }

    // Borda sutil para destaques não selecionados
    if ((isHighlighted || isPopular) && !isSelected && !isDark) {
         stateClasses += ' border-entre-purple-light';
    }

    const titleColor = isDark ? 'text-white' : 'text-entre-purple-dark';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-600';
    
    const buttonText = isSelected 
        ? (planType === 'internet' ? 'Selecionado ✓' : 'Remover') 
        : (planType === 'internet' ? 'Escolher este' : 'Adicionar');

    const buttonBaseClasses = 'w-full font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-95 text-lg mt-4';
    
    const buttonClasses = isSelected
        ? 'bg-entre-orange text-white'
        : isDark
            ? 'bg-gray-700 text-white hover:bg-entre-purple-mid border border-gray-600'
            : 'bg-entre-purple-light text-entre-purple-dark hover:bg-entre-purple-mid hover:text-white';
            
    const finalButtonClasses = `${buttonBaseClasses} ${buttonClasses}`;

    const formatFeature = (text: string) => {
        const keywords = [
            'Wifi 6', 
            'Instalação Gratuita', 
            'roteadores', 
            '\\(mais estável\\)',
            'Gerência Proativa',
            'IP Fixo',
            'OMNI',
            'fibra óptica'
        ];
        const parts = text.split(new RegExp(`(${keywords.join('|')})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) => 
                    keywords.some(k => k.replace(/\\/g, '').toLowerCase() === part.toLowerCase()) 
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
            const promoText = 'promo' in plan ? plan.promo : undefined;
            
            return (
                <div className="flex flex-col items-center text-center">
                    <div className="h-5 flex items-center justify-center mb-1">
                        {promoText && (
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Promoção
                            </span>
                        )}
                    </div>

                    <div className="relative inline-block">
                        <p className={`text-4xl font-black tracking-tighter leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {formatCurrency(currentPrice).split(',')[0]}<span className="text-xl">,{formatCurrency(currentPrice).split(',')[1]}</span>
                            <span className={`text-base font-bold ml-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>/mês</span>
                        </p>
                    </div>
                    
                    <div className="min-h-[1.5rem] mt-1">
                        {promoText && (
                            <p className="text-[10px] text-gray-500 leading-tight">{promoText}</p>
                        )}
                        {'installationDetails' in plan && plan.installationDetails && (
                            <p className={`text-[10px] font-medium leading-tight ${isDark ? 'text-gray-400' : 'text-entre-purple-mid'}`}>
                                {plan.installationDetails}
                            </p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <button onClick={onSelect} className={`${containerClasses} ${stateClasses}`}>
            {/* Social Proof Badges */}
            {isHighlighted && !isPopular && !isSelected && (
                <div className="absolute top-3 right-3 bg-entre-orange text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md z-20 uppercase tracking-widest">
                    {bestOfferText}
                </div>
            )}
            {isPopular && !isSelected && (
                <div className="absolute top-3 right-3 bg-entre-purple-dark text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg z-20 uppercase tracking-widest flex items-center gap-1.5 border border-entre-purple-mid/50">
                    <span className="text-entre-orange">★</span> Mais Vendido
                </div>
            )}

            {isTvPlan ? (
                 <div className="w-full h-full relative">
                    <img 
                        src={`/images/${plan.id}.png`} 
                        alt={plan.name} 
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-center">
                        <h3 className="text-2xl font-black text-white leading-tight mb-1">{plan.name}</h3>
                        <p className="text-white/80 text-sm mb-4">{(plan as TvPlan).details}</p>
                        
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 mb-4">
                             <p className="text-white font-black text-xl">
                                {formatCurrency(hasComboDiscount ? (plan as TvPlan).comboPrice : plan.price)}
                             </p>
                             {hasComboDiscount && <p className="text-[9px] text-green-400 font-bold uppercase">Preço Combo</p>}
                        </div>
                        
                        <div className={`${buttonBaseClasses} ${isSelected ? 'bg-entre-orange text-white' : 'bg-white text-entre-purple-dark'} !mt-0`}>
                             {isSelected ? 'Remover' : 'Adicionar'}
                        </div>
                    </div>
                 </div>
            ) : (
                <>
                    {/* Header - Estilo Pílula */}
                    <div className={`h-28 flex items-center justify-center px-6 shrink-0 w-full ${isDark ? 'bg-gray-700' : 'bg-entre-purple-light'}`}>
                        <h3 className={`text-2xl font-black uppercase tracking-tight leading-tight text-center ${titleColor}`}>
                            {plan.name}
                        </h3>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 flex flex-col flex-grow items-center text-center w-full">
                        {'description' in plan ? (
                            <p className={`text-sm mb-6 leading-relaxed ${textColor}`}>{(plan as InternetPlan).description}</p>
                        ) : (
                             <p className={`text-sm mb-6 leading-relaxed ${textColor}`}>{(plan as OmniPlan | NoBreakPlan).details}</p>
                        )}

                        {'features' in plan && (
                            <div className={`w-full mb-6 text-left p-4 rounded-2xl border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50/50 border-gray-100'}`}>
                                <ul className="space-y-3">
                                    {(plan as InternetPlan).features.map((feature, index) => (
                                        <li key={index} className={`flex items-start text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                            <CheckIcon />
                                            <span className="leading-tight">{formatFeature(feature)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {'highlight' in plan && plan.highlight && (
                             <div className="bg-entre-purple-light/50 text-entre-purple-dark text-xs font-bold px-3 py-1 rounded-full mb-6 border border-entre-purple-mid/20">
                                {plan.highlight}
                            </div>
                        )}

                        <div className="mt-auto w-full">
                            {renderPrice()}
                            <div className={finalButtonClasses}>
                                {buttonText}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </button>
    );
};

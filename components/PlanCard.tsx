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
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-entre-purple-mid" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const Price: React.FC<{ plan: Plan; inverse?: boolean }> = ({ plan, inverse = false }) => {
    const [integer, cents] = plan.price.toFixed(2).replace('.', ',').split(',');
    return (
        <div className={inverse ? 'text-white' : 'text-entre-purple-dark'}>
            <div className="flex items-start justify-center leading-none">
                <span className="mr-1 mt-1 text-sm font-extrabold">R$</span>
                <span className="font-display text-4xl font-extrabold tracking-[-0.06em]">{integer}</span>
                <span className="mt-1 text-lg font-extrabold">,{cents}</span>
                <span className={`ml-1 self-end pb-1 text-[11px] font-semibold ${inverse ? 'text-white/65' : 'text-gray-500'}`}>/mês</span>
            </div>
        </div>
    );
};

export const PlanCard: React.FC<PlanCardProps> = ({
    plan,
    isSelected,
    onSelect,
    planType,
    bestOfferText = 'Mais escolhido',
    hasComboDiscount = false,
}) => {
    const isTvPlan = plan.id.startsWith('tv-');
    const isInternet = planType === 'internet' && 'features' in plan;
    const internetPlan = isInternet ? plan as InternetPlan : null;
    const isHighlighted = Boolean(internetPlan?.bestOffer || internetPlan?.isPopular);

    if (isTvPlan) {
        const tvPlan = plan as TvPlan;
        return (
            <button onClick={onSelect} className={`premium-card group relative h-full min-h-[360px] w-full overflow-hidden rounded-[26px] bg-entre-purple-dark text-left ${isSelected ? 'ring-4 ring-entre-orange/35' : ''}`}>
                <img src={`/images/${plan.id}.png`} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-entre-purple-dark via-entre-purple-dark/65 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-extrabold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-white/70">{tvPlan.details}</p>
                    <p className="mt-5 text-2xl font-extrabold">{formatCurrency(hasComboDiscount ? tvPlan.comboPrice : tvPlan.price)}<span className="text-xs text-white/60">/mês</span></p>
                    <span className="mt-4 rounded-full bg-white px-5 py-3 text-center text-sm font-extrabold text-entre-purple-dark">{isSelected ? 'Remover' : 'Adicionar'}</span>
                </div>
            </button>
        );
    }

    if (internetPlan) {
        return (
            <button
                onClick={onSelect}
                aria-pressed={isSelected}
                className={`site-plan-card premium-card relative flex h-full w-full flex-col overflow-visible rounded-[26px] bg-white text-left ${isSelected ? 'is-selected ring-4 ring-entre-purple-mid/20' : ''} ${isHighlighted ? 'is-featured' : ''}`}
            >
                {isHighlighted && (
                    <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-entre-orange px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white shadow-lg">
                        {bestOfferText}
                    </span>
                )}

                <div className="flex min-h-[146px] flex-col px-5 pb-5 pt-7 md:h-[220px]">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-entre-purple-mid">Internet Premium</span>
                    <h3 className="mt-2 font-display text-[2rem] font-extrabold leading-none tracking-[-0.055em] text-entre-purple-dark">{internetPlan.name}</h3>
                    <p className="mt-3 text-sm leading-5 text-gray-500">{internetPlan.description}</p>
                </div>

                {internetPlan.includedBenefits?.length ? (
                    <div className="mx-5 border-y border-entre-purple-light py-4">
                        <p className="mb-3 text-[9px] font-black uppercase tracking-[0.18em] text-entre-purple-dark/55">Benefício incluso</p>
                        {internetPlan.includedBenefits.map((benefit) => (
                            <div key={benefit.id} className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-entre-purple-light/55">
                                    <img src={benefit.logoUrl} alt={`Logo ${benefit.name}`} className="h-7 w-7 object-contain" />
                                </div>
                                <span className="text-xs font-bold text-entre-purple-dark">{benefit.label}</span>
                            </div>
                        ))}
                    </div>
                ) : null}

                <div className="flex-grow px-5 py-4">
                    <p className="mb-3 text-[9px] font-black uppercase tracking-[0.18em] text-entre-purple-dark/55">Recursos</p>
                    <ul className="space-y-2.5">
                        {internetPlan.features.map((feature) => (
                            <li key={feature} className="flex gap-2 text-xs font-semibold leading-5 text-gray-600">
                                <CheckIcon />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-auto rounded-b-[25px] border-t border-entre-purple-light bg-white px-5 pb-5 pt-4 text-center">
                    <div className="flex h-14 items-center justify-center">
                        <Price plan={internetPlan} />
                    </div>
                    <div className="flex h-8 items-start justify-center">
                        {internetPlan.promo && (
                            <p className="text-[9px] leading-4 text-gray-500">{internetPlan.promo}</p>
                        )}
                    </div>
                    <span className={`mt-2 block w-full rounded-full px-5 py-3 text-sm font-extrabold transition-colors ${isSelected ? 'bg-entre-orange text-white' : 'bg-entre-purple-dark text-white'}`}>
                        {isSelected ? 'Plano selecionado' : 'Escolher plano'}
                    </span>
                </div>
            </button>
        );
    }

    const addon = plan as OmniPlan | NoBreakPlan;
    return (
        <button
            onClick={onSelect}
            aria-pressed={isSelected}
            className={`premium-card flex h-full w-full flex-col overflow-hidden rounded-[26px] bg-white p-6 text-center ${isSelected ? 'border-entre-purple-mid ring-4 ring-entre-purple-mid/15' : ''}`}
        >
            <span className="mx-auto mb-5 h-1 w-10 rounded-full bg-gradient-to-r from-entre-orange to-entre-purple-mid" />
            <h3 className="font-display text-2xl font-extrabold tracking-tight text-entre-purple-dark">{addon.name}</h3>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-gray-500">{addon.details}</p>
            {'installationDetails' in addon && addon.installationDetails && <p className="mt-3 text-[10px] font-semibold leading-4 text-entre-purple-mid">{addon.installationDetails}</p>}
            <div className="mt-7">
                <Price plan={addon} />
                <span className={`mt-5 block rounded-full px-5 py-3 text-sm font-extrabold ${isSelected ? 'bg-entre-orange text-white' : 'bg-entre-purple-dark text-white'}`}>
                    {isSelected ? 'Remover adicional' : 'Adicionar ao combo'}
                </span>
            </div>
        </button>
    );
};

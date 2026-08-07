import React from 'react';
import type { AppInfo } from '../types';
import { formatCurrency } from '../utils/formatters';

interface AppCardProps {
    app: AppInfo;
    isSelected: boolean;
    onSelect: () => void;
    appTierCounts: Record<string, number>;
    hasDiscount?: boolean;
    isFeatured?: boolean;
}

const getLogoUrl = (appId: string, appName: string): string => {
    const manualMap: Record<string, string> = {
        'app-deezer': 'deezer_logo.png',
        'app-disney-noads': 'disneyplus_logo.png',
        'app-disney-ads': 'disneyplus_com_anuncio_logo.png',
        'app-hbo-noads': 'hbo_max_logo.png',
        'app-hbo-ads': 'hbo_max_com_anuncio_logo.png',
        'app-exitlag': 'exit_lag_logo.png',
        'app-sky-light': 'skyplus_light_logo.png',
        'app-sky-light-globo': 'skyplus_light_logo.png',
        'app-sky-light-amazon': 'skyplus_light_amazon_logo.jpeg',
        'app-sky-full': 'skyplus_light_logo.png',
        'app-globoplay-ads': 'globoplay_logo.png',
    };

    if (manualMap[appId]) return `/images/${manualMap[appId]}`;

    const slug = appName.normalize('NFD')
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

export const AppCard: React.FC<AppCardProps> = ({ app, isSelected, onSelect, appTierCounts, hasDiscount, isFeatured }) => {
    const isTierFull = !isSelected && (appTierCounts[app.tier] || 0) >= 3;
    const actuallyHasDiscount = Boolean(hasDiscount && app.price > app.comboPrice);

    return (
        <button
            onClick={onSelect}
            disabled={isTierFull}
            aria-pressed={isSelected}
            className={`premium-card premium-app-card group relative flex h-full min-h-[286px] w-full flex-col overflow-hidden bg-white p-5 text-left ${
                isSelected ? 'border-entre-purple-mid ring-4 ring-entre-purple-mid/15' : isFeatured ? 'border-orange-200' : ''
            } ${isTierFull ? 'cursor-not-allowed opacity-55' : ''}`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <span className="text-[9px] font-black uppercase tracking-[0.18em] text-entre-purple-mid">{app.tier}</span>
                    <h3 className="mt-2 font-display text-xl font-extrabold leading-tight tracking-tight text-entre-purple-dark">{app.name}</h3>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-entre-purple-light/45 p-2 ring-1 ring-entre-purple-light">
                    <img
                        src={getLogoUrl(app.id, app.name)}
                        alt={`Logo ${app.name}`}
                        className="h-full w-full object-contain"
                        onError={(event) => {
                            const image = event.currentTarget;
                            image.style.display = 'none';
                            image.parentElement?.classList.add('app-logo-fallback');
                            image.parentElement?.setAttribute('data-letter', app.name.charAt(0));
                        }}
                    />
                </div>
            </div>

            <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-500">{app.details}</p>

            <div className="mt-auto flex items-end justify-between gap-4 border-t border-entre-purple-light pt-4">
                <div>
                    {actuallyHasDiscount && <span className="block text-[10px] font-semibold text-gray-400 line-through">{formatCurrency(app.price)}</span>}
                    <span className="font-display text-2xl font-extrabold tracking-tight text-entre-purple-dark">
                        {formatCurrency(actuallyHasDiscount ? app.comboPrice : app.price)}
                    </span>
                    <span className="text-[10px] text-gray-400">/mês</span>
                </div>
                <span className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-xs font-black transition-all ${
                    isSelected ? 'bg-entre-orange text-white' : 'bg-entre-purple-dark text-white group-hover:bg-entre-purple-mid'
                }`}>
                    {isTierFull ? 'Limite' : isSelected ? '−' : '+'}
                </span>
            </div>
        </button>
    );
};

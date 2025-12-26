
import React from 'react';
import type { AppInfo } from '../types';

interface AppCardProps {
    app: AppInfo;
    isSelected: boolean;
    onSelect: () => void;
    appTierCounts: Record<string, number>;
    hasDiscount?: boolean;
    isFeatured?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({ app, isSelected, onSelect, appTierCounts, hasDiscount, isFeatured }) => {
    const isTierFull = !isSelected && (appTierCounts[app.tier] || 0) >= 3;
    const isDisabled = isTierFull;
    const isDisney = app.id.toLowerCase().includes('disney');
    
    // Verifica se o app realmente tem um preço menor no combo
    const actuallyHasDiscount = hasDiscount && (app.price > app.comboPrice);

    const cardClasses = `relative flex flex-col h-full bg-white rounded-xl p-4 border-2 transition-all duration-300 shadow-lg text-left w-full ${
        isSelected 
            ? 'border-entre-purple-dark ring-4 ring-entre-purple-mid/30' 
            : isFeatured 
                ? 'border-entre-orange/30 shadow-orange-100/50' // Uso do isFeatured para destaque
                : 'border-transparent'
    } ${
        isDisabled
            ? 'opacity-70 cursor-not-allowed'
            : 'transform hover:-translate-y-1 active:scale-95'
    }`;
    
    const buttonText = isSelected ? 'Remover' : 'Adicionar';
    const buttonBaseClasses = 'w-full font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out mt-auto text-sm text-center';
    
    const buttonSelectedClasses = 'bg-white text-red-600 border border-red-500 shadow-sm hover:bg-red-50';
    
    // Uso do isFeatured também nos botões
    const buttonDefaultClasses = isFeatured 
        ? 'bg-entre-orange text-white border border-entre-orange shadow-md hover:bg-orange-600'
        : 'bg-white text-entre-purple-dark border border-entre-purple-mid shadow-sm hover:bg-entre-purple-light';

    // Função auxiliar para garantir os nomes corretos das imagens (Igual ao ProfileCard)
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

    const logoUrl = getLogoUrl(app.id, app.name);
    
    return (
        <button
            onClick={onSelect}
            disabled={isDisabled}
            className={cardClasses}
        >
            {/* Tag "Stream Disney" removida conforme solicitado */}
            
            {(actuallyHasDiscount || (isDisney && app.tier === 'Premium')) && (
                 <div className="absolute -top-2 -right-2 bg-entre-orange text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
                    {isDisney && app.tier === 'Premium' ? 'Recomendado' : 'Desconto!'}
                </div>
            )}

            <div className="flex-grow mb-4">
                <div className="flex justify-between items-center gap-4 mb-3">
                     <h3 className="text-lg font-bold text-entre-purple-mid">
                        {app.name}
                     </h3>
                     <div className={`w-16 h-16 flex-shrink-0 rounded-lg flex items-center justify-center overflow-hidden ${isDisney ? 'bg-entre-purple-dark' : 'bg-gray-100'}`}>
                        <img 
                            src={logoUrl} 
                            alt={`Logo ${app.name}`} 
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if(parent) {
                                     parent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>`;
                                }
                            }}
                        />
                     </div>
                </div>
                <p className="text-sm text-gray-600 leading-tight">{app.details}</p>
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{app.tier}</span>
                </div>
            </div>
            
            <div
                className={`${buttonBaseClasses} ${isSelected ? buttonSelectedClasses : buttonDefaultClasses} ${isDisabled ? 'opacity-50' : ''}`}
            >
                {isTierFull ? 'Limite atingido' : buttonText}
            </div>
        </button>
    );
};

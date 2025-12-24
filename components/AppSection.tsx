
import React, { useState, useMemo } from 'react';
import { AppCard } from './AppCard';
import type { AppInfo } from '../types';

interface AppSectionProps {
    apps: AppInfo[];
    selectedApps: AppInfo[];
    onSelectApp: (app: AppInfo) => void;
    hasComboDiscount: boolean | undefined;
    appTierCounts: Record<string, number>;
}

const ComboMessage: React.FC<{ hasComboDiscount?: boolean }> = ({ hasComboDiscount }) => {
    if (hasComboDiscount === true) {
        return (
            <div className="text-center mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-bold text-green-700">Desconto de combo ativo!</p>
            </div>
        )
    }

    if (hasComboDiscount === false) {
        return (
            <div className="text-center mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-semibold text-amber-800">Aproveite descontos nos planos a partir de 800 MEGA</p>
            </div>
        )
    }
    
    return null;
}

const FEATURED_APP_IDS = ['app-disney-noads', 'app-hbo-noads', 'app-exitlag', 'app-deezer'];

export const AppSection: React.FC<AppSectionProps> = ({ apps, selectedApps, onSelectApp, hasComboDiscount, appTierCounts }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Identifica os apps específicos para o Super Destaque
    const featuredApps = useMemo(() => {
        return apps.filter(app => FEATURED_APP_IDS.includes(app.id));
    }, [apps]);

    // Apps que não estão nos destaques (para a lista filtrável)
    const regularApps = useMemo(() => {
        return apps.filter(app => !FEATURED_APP_IDS.includes(app.id));
    }, [apps]);

    const categories = useMemo(() => {
        return ['Todos', ...Array.from(new Set(regularApps.map(app => app.category)))];
    }, [regularApps]);

    const filteredRegularApps = useMemo(() => {
        if (!selectedCategory || selectedCategory === 'Todos') {
            return regularApps;
        }
        return regularApps.filter(app => app.category === selectedCategory);
    }, [regularApps, selectedCategory]);
    
    const groupedApps = useMemo(() => {
        return filteredRegularApps.reduce<Record<string, AppInfo[]>>((groups, app) => {
            const { category } = app;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(app);
            return groups;
        }, {});
    }, [filteredRegularApps]);

    const renderAppGrid = (appList: AppInfo[], isFeatured: boolean = false) => (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appList.map(app => (
                <AppCard
                    key={app.id}
                    app={app}
                    isSelected={selectedApps.some(a => a.id === app.id)}
                    onSelect={() => onSelectApp(app)}
                    appTierCounts={appTierCounts}
                    // O Sky Full nunca recebe o sinal visual de desconto
                    hasDiscount={app.tier === 'Sky Full' ? false : hasComboDiscount}
                    isFeatured={isFeatured}
                />
            ))}
        </div>
    );

    return (
        <div className="space-y-10">
            <ComboMessage hasComboDiscount={hasComboDiscount} />

            {/* Seção de Destaques - Cores Padronizadas Entre */}
            <div className="bg-gradient-to-br from-entre-purple-light/40 to-white p-6 rounded-2xl border border-entre-purple-mid/20 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <span className="bg-entre-orange text-white text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">Super Destaque</span>
                    <h3 className="text-xl font-bold text-entre-purple-dark">Nossos aplicativos favoritos</h3>
                </div>
                {renderAppGrid(featuredApps, true)}
                <p className="text-center mt-4 text-xs text-entre-purple-mid/70 font-medium">As melhores opções de streaming, games e música para turbinar seu plano.</p>
            </div>

            <div className="pt-6">
                <h3 className="text-center text-xl font-bold text-gray-800 mb-6">Explore outros aplicativos</h3>
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
                    {categories.map(category => {
                        const isSelected = selectedCategory === category || (!selectedCategory && category === 'Todos');
                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category === 'Todos' ? null : category)}
                                className={`px-4 py-2 text-sm font-bold rounded-full transition-colors duration-300 ${
                                    isSelected 
                                    ? 'bg-entre-purple-dark text-white shadow-md' 
                                    : 'bg-white text-entre-purple-dark border border-entre-purple-mid hover:bg-entre-purple-light'
                                }`}
                            >
                                {category}
                            </button>
                        )
                    })}
                </div>

                {selectedCategory && selectedCategory !== 'Todos' ? (
                    renderAppGrid(filteredRegularApps)
                ) : (
                    <div className="space-y-10">
                        {Object.keys(groupedApps).map((category) => (
                            <div key={category}>
                                <h3 className="text-2xl font-bold text-entre-purple-mid mb-6 pb-2 border-b border-entre-purple-light">{category}</h3>
                                {renderAppGrid(groupedApps[category])}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

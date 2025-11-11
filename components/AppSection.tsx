
import React, { useState, useMemo } from 'react';
import { AppCard } from './AppCard';
// FIX: Correctly import all necessary types from the `types` module.
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

export const AppSection: React.FC<AppSectionProps> = ({ apps, selectedApps, onSelectApp, hasComboDiscount, appTierCounts }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = useMemo(() => {
        return ['Todos', ...Array.from(new Set(apps.map(app => app.category)))];
    }, [apps]);

    const filteredApps = useMemo(() => {
        if (!selectedCategory || selectedCategory === 'Todos') {
            return apps;
        }
        return apps.filter(app => app.category === selectedCategory);
    }, [apps, selectedCategory]);
    
    const groupedApps = useMemo(() => {
        return filteredApps.reduce<Record<string, AppInfo[]>>((groups, app) => {
            const { category } = app;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(app);
            return groups;
        }, {});
    }, [filteredApps]);

    const renderAppGrid = (appList: AppInfo[]) => (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appList.map(app => (
                <AppCard
                    key={app.id}
                    app={app}
                    isSelected={selectedApps.some(a => a.id === app.id)}
                    onSelect={() => onSelectApp(app)}
                    appTierCounts={appTierCounts}
                    hasDiscount={hasComboDiscount}
                />
            ))}
        </div>
    );

    return (
        <div className="space-y-10">
            <ComboMessage hasComboDiscount={hasComboDiscount} />

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
                renderAppGrid(filteredApps)
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
    );
};

import React from 'react';
import { AppCard } from './AppCard';
// FIX: Correctly import all necessary types from the `types` module.
import type { AppInfo } from '../types';

interface AppTierProps {
    title: string;
    apps: AppInfo[];
    selectedApps: AppInfo[];
    onSelectApp: (app: AppInfo) => void;
    hasComboDiscount: boolean | undefined;
    appTierCounts: Record<string, number>;
}

export const AppTier: React.FC<AppTierProps> = ({ title, apps, selectedApps, onSelectApp, hasComboDiscount, appTierCounts }) => {
    
    const isFirstSelectedApp = (appId: string) => {
        if (!hasComboDiscount || selectedApps.length === 0) return false;
        return selectedApps[0].id === appId;
    };

    return (
        <div>
            <h3 className="text-2xl font-bold text-entre-purple-mid mb-6 pb-2 border-b border-entre-purple-light">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.map(app => (
                    <AppCard
                        key={app.id}
                        app={app}
                        isSelected={selectedApps.some(a => a.id === app.id)}
                        onSelect={() => onSelectApp(app)}
                        hasDiscount={isFirstSelectedApp(app.id)}
                        // FIX: Pass the required appTierCounts prop to AppCard.
                        appTierCounts={appTierCounts}
                    />
                ))}
            </div>
        </div>
    );
};

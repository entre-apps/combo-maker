
// FIX: Define and export all necessary types for the application.

export type PlanType = 'casa' | 'empresa';

export interface Profile {
    id: string;
    name: string;
    description: string;
    icon: 'gamer' | 'family' | 'home-office' | 'small-business' | 'growing-business';
    config: {
        internetId: string;
        tvId?: string;
        appIds?: string[];
        omniId?: string;
        nobreakId?: string;
    };
    isPopular?: boolean;
}

export interface InternetPlan {
    id: string;
    name: string;
    description: string;
    features: string[];
    price: number;
    fullPrice?: number;
    priceDetails: string;
    originalPrice?: string;
    promo?: string;
    bestOffer?: boolean;
    comboDiscount?: boolean;
    highlight?: string;
    isPopular?: boolean;
}

export interface TvPlan {
    id: string;
    name: string;
    details: string;
    price: number;
    comboPrice: number;
}

export interface AppInfo {
    id: string;
    name: string;
    tier: 'Standard' | 'Advanced' | 'Top' | 'Premium' | 'Sky Full';
    category: string;
    details: string;
    price: number;
    comboPrice: number;
}

export interface OmniPlan {
    id: string;
    name: string;
    details: string;
    price: number;
    installationDetails?: string;
}

export interface NoBreakPlan {
    id: string;
    name: string;
    details: string;
    price: number;
}

export interface CartState {
    planType: PlanType | null;
    internet: InternetPlan | null;
    tv: TvPlan | null;
    apps: AppInfo[];
    omni: OmniPlan | null;
    nobreak: NoBreakPlan | null;
}

export interface UpgradeComparison {
    show: boolean;
    diffMonthly: number;
    diffDaily: number;
    addonsSavings: number;
    isCheaper: boolean;
    totalUpgrade: number;
}

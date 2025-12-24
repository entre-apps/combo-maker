
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
    }
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

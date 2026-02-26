
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { PlanTypeSelector } from './components/PlanTypeSelector';
import { Section } from './components/Section';
import { PlanCard } from './components/PlanCard';
import { AppSection } from './components/AppSection';
import { OmniExplanation } from './components/OmniExplanation';
import { NoBreakExplanation } from './components/NoBreakExplanation';
import { Summary } from './components/Summary';
import { StickySidebar } from './components/StickySidebar';
import { MobileBottomBar } from './components/MobileBottomBar';
import { NextStepButton } from './components/NextStepButton';
import { StepsProgressBar } from './components/StepsProgressBar';
import { BusinessFeaturesExplanation } from './components/BusinessFeaturesExplanation';
import { DB, PROFILES } from './data/products';
import type { PlanType, CartState, InternetPlan, AppInfo, OmniPlan, NoBreakPlan, Profile, UpgradeComparison, SummaryItem } from './types';
import { formatCurrency } from './utils/formatters';
import { ProfileSelector } from './components/ProfileSelector';
import { UpgradeNudgeModal } from './components/UpgradeNudgeModal';
import { RemovalConfirmationModal } from './components/RemovalConfirmationModal';
import { telemetry } from './utils/telemetry';
import { TelemetryDashboard } from './components/TelemetryDashboard';

type StepName = 'internet' | 'omni' | 'nobreak' | 'apps' | 'checkout';
type InternetViewMode = 'plans' | 'combos';

interface NextStepConfig {
    targetRef: React.RefObject<HTMLDivElement> | null;
    label: string;
    targetName: string;
    stepId: StepName;
}

interface PendingRemoval {
    type: string;
    id?: string;
    name: string;
}

const App: React.FC = () => {
    const [cart, setCart] = useState<CartState>({
        planType: null,
        internet: null,
        tv: null,
        apps: [],
        omni: null,
        nobreak: null,
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [itemPendingRemoval, setItemPendingRemoval] = useState<PendingRemoval | null>(null);
    const [showTelemetry, setShowTelemetry] = useState(false);
    
    const [internetViewMode, setInternetViewMode] = useState<InternetViewMode>('combos');
    const [activeSection, setActiveSection] = useState<StepName>('internet');
    const lastTrackedStep = useRef<StepName | null>(null);

    const internetRef = useRef<HTMLDivElement>(null);
    const omniRef = useRef<HTMLDivElement>(null);
    const nobreakRef = useRef<HTMLDivElement>(null);
    const appsRef = useRef<HTMLDivElement>(null);
    const checkoutMarkerRef = useRef<HTMLDivElement>(null);
    const profileSelectorRef = useRef<HTMLDivElement>(null);

    const sectionsRef = useMemo(() => ({
        internet: internetRef,
        apps: appsRef,
        omni: omniRef,
        nobreak: nobreakRef,
        profileSelector: profileSelectorRef,
    }), []);

    const isBusiness = cart.planType === 'empresa';

    const nextStepId = useMemo((): StepName => {
        if (activeSection === 'internet') return 'omni';
        if (activeSection === 'omni') return 'nobreak';
        if (activeSection === 'nobreak') return isBusiness ? 'checkout' : 'apps';
        if (activeSection === 'apps') return 'checkout';
        return 'checkout';
    }, [activeSection, isBusiness]);

    const currentNextStepConfig = useMemo((): NextStepConfig | null => {
        switch (nextStepId) {
            case 'omni':
                return { targetRef: sectionsRef.omni, label: 'Expandir Wi-Fi', targetName: 'Omni', stepId: 'omni' };
            case 'nobreak':
                return { targetRef: sectionsRef.nobreak, label: 'Proteção Elétrica', targetName: 'Mini No-Break', stepId: 'nobreak' };
            case 'apps':
                return { targetRef: sectionsRef.apps, label: 'Conteúdo Digital', targetName: 'Apps', stepId: 'apps' };
            case 'checkout':
                return null;
            default:
                return { targetRef: sectionsRef.internet, label: 'Internet', targetName: 'Planos', stepId: 'internet' };
        }
    }, [nextStepId, sectionsRef]);

    const handleScrollTo = useCallback((ref: React.RefObject<HTMLElement>) => {
        const headerOffset = 100;
        if (ref.current) {
            const elementPosition = ref.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    const handleNextStepClick = useCallback(() => {
        if (currentNextStepConfig?.targetRef) {
            handleScrollTo(currentNextStepConfig.targetRef);
            
            // Avanço manual imediato para melhorar a percepção de resposta
            setActiveSection(nextStepId);
        }
    }, [currentNextStepConfig, handleScrollTo, nextStepId]);

    const showAddons = !!cart.internet;

    // Intersection Observer para detectar a seção ativa e atualizar o botão/telemetria
    useEffect(() => {
        // Se não houver plano selecionado, não há o que observar
        if (!cart.planType) return;

        const observerOptions = {
            root: null,
            // Define uma "linha de chegada" no centro da tela (zona de 10% de altura)
            // Qualquer seção que cruzar essa linha é considerada a ativa
            rootMargin: '-45% 0px -45% 0px', 
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('data-section') as StepName;
                    if (sectionId) {
                        setActiveSection(sectionId);

                        // Telemetria
                        if (lastTrackedStep.current !== sectionId) {
                            telemetry.track({ 
                                type: 'step_navigation', 
                                payload: { from: lastTrackedStep.current || 'start', to: sectionId } 
                            });
                            lastTrackedStep.current = sectionId;
                        }
                    }
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Pequeno delay para garantir que o DOM foi atualizado após a seleção do plano
        const timeoutId = setTimeout(() => {
            const refs = [
                { id: 'internet', ref: internetRef },
                { id: 'omni', ref: omniRef },
                { id: 'nobreak', ref: nobreakRef },
                { id: 'apps', ref: appsRef },
                { id: 'checkout', ref: checkoutMarkerRef }
            ];

            refs.forEach(({ id, ref }) => {
                if (ref.current) {
                    ref.current.setAttribute('data-section', id);
                    observer.observe(ref.current);
                }
            });
        }, 100);

        return () => {
            observer.disconnect();
            clearTimeout(timeoutId);
        };
    }, [cart.planType, showAddons, isBusiness]);

    const resetCartAddons = () => ({
        tv: null,
        apps: [],
        omni: null,
        nobreak: null,
    });

    const handleSelectPlanType = useCallback((type: PlanType) => {
        telemetry.track({ type: 'plan_type_selected', payload: { planType: type } });
        setSelectedProfileId(null);
        setInternetViewMode(PROFILES[type]?.length > 0 ? 'combos' : 'plans');
        setCart({
            planType: type,
            ...resetCartAddons(),
            internet: null,
        });
        setActiveSection('internet');
        
        setTimeout(() => {
            if (sectionsRef.internet.current) {
                handleScrollTo(sectionsRef.internet);
            }
        }, 300);
    }, [handleScrollTo, sectionsRef]);

    const handleSelectInternet = useCallback((plan: InternetPlan) => {
        telemetry.track({ type: 'internet_selected', payload: { planId: plan.id, planName: plan.name } });
        if (plan.id === 'res-600') {
            setShowUpgradeModal(true);
            setCart(prev => ({ ...prev, internet: plan }));
            return;
        }

        setSelectedProfileId(null);
        setCart(prev => ({
            ...prev,
            internet: plan,
        }));

        setActiveSection('omni');
    }, []);

    const handleUpgradeAccept = () => {
        const plan800 = DB.internet.casa.find(p => p.id === 'res-800');
        telemetry.track({ 
            type: 'upgrade_nudge_response', 
            payload: { accepted: true, originalPlanId: cart.internet?.id || '', targetPlanId: 'res-800' } 
        });
        if (plan800) {
            setCart(prev => ({ ...prev, internet: plan800 }));
        }
        setShowUpgradeModal(false);
        setActiveSection('omni');
    };

    const handleUpgradeDecline = () => {
        telemetry.track({ 
            type: 'upgrade_nudge_response', 
            payload: { accepted: false, originalPlanId: cart.internet?.id || '', targetPlanId: 'res-800' } 
        });
        setShowUpgradeModal(false);
        setActiveSection('omni');
    };

    const handleSelectApp = useCallback((app: AppInfo) => {
        setSelectedProfileId(null);
        setCart(prev => {
            const newApps = [...prev.apps];
            const appIndex = newApps.findIndex(a => a.id === app.id);
            const action = appIndex > -1 ? 'removed' : 'added';
            
            telemetry.track({ 
                type: 'addon_toggle', 
                payload: { id: app.id, name: app.name, action, category: 'apps' } 
            });

            if (appIndex > -1) {
                newApps.splice(appIndex, 1);
            } else {
                const tierCount = newApps.filter(a => a.tier === app.tier).length;
                if (tierCount < 3) {
                    newApps.push(app);
                }
            }
            
            return { ...prev, apps: newApps };
        });
    }, []);

    const handleSelectOmni = useCallback((plan: OmniPlan) => {
        setSelectedProfileId(null);
        setCart(prev => {
            const isRemoving = prev.omni?.id === plan.id;
            telemetry.track({ 
                type: 'addon_toggle', 
                payload: { id: plan.id, name: plan.name, action: isRemoving ? 'removed' : 'added', category: 'omni' } 
            });
            return {
                ...prev,
                omni: isRemoving ? null : plan,
            };
        });
        setActiveSection('omni');
    }, []);

    const handleSelectNobreak = useCallback((plan: NoBreakPlan) => {
        setSelectedProfileId(null);
        setCart(prev => {
            const isRemoving = !!prev.nobreak;
            telemetry.track({ 
                type: 'addon_toggle', 
                payload: { id: plan.id, name: plan.name, action: isRemoving ? 'removed' : 'added', category: 'nobreak' } 
            });
            return {
                ...prev,
                nobreak: isRemoving ? null : plan,
            };
        });
    }, []);
    
    const handleSelectProfile = useCallback((profile: Profile) => {
        telemetry.track({ type: 'profile_selected', payload: { profileId: profile.id, profileName: profile.name } });
        setSelectedProfileId(profile.id);
        const config = profile.config;
        const planType = cart.planType;
        if (!planType) return;

        const newCart: CartState = {
            planType,
            internet: DB.internet[planType].find(p => p.id === config.internetId) || null,
            tv: DB.tv.find(p => p.id === config.tvId) || null,
            apps: DB.apps.filter(app => config.appIds?.includes(app.id)) || [],
            omni: DB.omni.find(p => p.id === config.omniId) || null,
            nobreak: config.nobreakId ? DB.nobreak : null,
        };

        setCart(newCart);
        setActiveSection('omni');
    }, [cart.planType]);

    const handleClearCart = useCallback(() => {
        setCart({
            planType: null,
            internet: null,
            tv: null,
            apps: [],
            omni: null,
            nobreak: null,
        });
        setSelectedProfileId(null);
        setInternetViewMode('combos');
        setIsCartOpen(false);
        setActiveSection('internet');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleRemoveItemRequest = useCallback((type: string, id?: string) => {
        let name = '';
        if (type === 'tv') name = cart.tv?.name || 'TV';
        else if (type === 'omni') name = cart.omni?.name || 'Wi-Fi Extra';
        else if (type === 'nobreak') name = cart.nobreak?.name || 'Mini No-Break';
        else if (type === 'app' && id) {
            const app = cart.apps.find(a => a.id === id);
            name = app?.name || 'Aplicativo';
        }

        setItemPendingRemoval({ type, id, name });
    }, [cart]);

    const confirmRemoval = useCallback(() => {
        if (!itemPendingRemoval) return;

        const { type, id, name } = itemPendingRemoval;
        telemetry.track({ 
            type: 'addon_toggle', 
            payload: { id: id || type, name, action: 'removed', category: type } 
        });

        setCart(prev => {
            const newCart = { ...prev };
            
            if (type === 'tv') {
                newCart.tv = null;
            } else if (type === 'omni') {
                newCart.omni = null;
            } else if (type === 'nobreak') {
                newCart.nobreak = null;
            } else if (type === 'app' && id) {
                newCart.apps = prev.apps.filter(app => app.id !== id);
            }
            
            setSelectedProfileId(null);
            return newCart;
        });

        setItemPendingRemoval(null);
    }, [itemPendingRemoval]);

    const cancelRemoval = useCallback(() => {
        setItemPendingRemoval(null);
    }, []);

    const handleSkip = (targetStep: StepName) => {
        const refMap: Record<string, React.RefObject<HTMLDivElement>> = {
            'omni': sectionsRef.omni,
            'nobreak': sectionsRef.nobreak,
            'apps': sectionsRef.apps
        };
        if (refMap[targetStep]) {
            handleScrollTo(refMap[targetStep]);
            // O observer cuidará de atualizar o activeSection
        }
    };

    const toggleInternetViewMode = useCallback(() => {
        setInternetViewMode(prev => prev === 'plans' ? 'combos' : 'plans');
    }, []);

    const appTierCounts = useMemo(() => {
        return cart.apps.reduce((acc, app) => {
            acc[app.tier] = (acc[app.tier] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [cart.apps]);

    const { total, summaryItems, whatsAppMessage, comboDiscountInfo, upgradeComparison } = useMemo(() => {
        if (!cart.internet) return { total: { promo: 0, full: 0 }, summaryItems: [], whatsAppMessage: '', comboDiscountInfo: { isActive: false, amount: 0, percentage: 0 }, upgradeComparison: null };

        let promoTotal = 0;
        let fullTotal = 0;
        const items: SummaryItem[] = [];
        let message = `Olá Entre! Tenho interesse em contratar o seguinte pedido:\n\n`;
        
        const hasComboDiscount = cart.internet.comboDiscount ?? false;
        const isPromoPlan = cart.internet.promo && cart.internet.fullPrice;

        if (isPromoPlan) {
            promoTotal += cart.internet.price;
            fullTotal += cart.internet.fullPrice!;
            const internetItem = {
                id: cart.internet.id,
                type: 'internet',
                name: `${cart.internet.name} (${cart.planType})`,
                price: cart.internet.fullPrice!,
                promoPrice: cart.internet.price,
                promo: cart.internet.promo,
            };
            items.push(internetItem);
            message += `*Plano Internet:* ${internetItem.name} - ${formatCurrency(internetItem.price)} nos 3 primeiros meses (Após: ${formatCurrency(internetItem.price)})\n`;
        } else {
             promoTotal += cart.internet.price;
             fullTotal += cart.internet.price;
             items.push({
                id: cart.internet.id,
                type: 'internet',
                name: `${cart.internet.name} (${cart.planType})`,
                price: cart.internet.price,
             });
             message += `*Plano Internet:* ${cart.internet.name} (${cart.planType}) - ${formatCurrency(cart.internet.price)}\n`;
        }
        
        let addonsFullPrice = 0;
        let addonsPromoPrice = 0;

        if (cart.tv) {
            const price = hasComboDiscount ? cart.tv.comboPrice : cart.tv.price;
            promoTotal += price;
            fullTotal += price;
            addonsFullPrice += cart.tv.price;
            addonsPromoPrice += price;
            items.push({ 
                id: cart.tv.id,
                type: 'tv',
                name: `TV: ${cart.tv.name}`, 
                details: cart.tv.details, 
                price: price,
                promo: hasComboDiscount ? 'Oferta Combo' : undefined 
            });
        }

        if (cart.apps.length > 0) {
            cart.apps.forEach(app => {
                const isSkyFull = app.tier === 'Sky Full';
                const price = (hasComboDiscount && !isSkyFull) ? app.comboPrice : app.price;
                promoTotal += price;
                fullTotal += price;
                addonsFullPrice += app.price;
                addonsPromoPrice += price;
                items.push({
                    id: app.id,
                    type: 'app',
                    name: `App: ${app.name}`,
                    price: price,
                    promo: (hasComboDiscount && !isSkyFull) ? 'Oferta Combo' : undefined,
                });
                message += `*App:* ${app.name}\n`;
            });
        }
        
        const addonsDiscountAmount = addonsFullPrice - addonsPromoPrice;
        const addonsDiscountPercentage = addonsFullPrice > 0 ? (addonsDiscountAmount / addonsFullPrice) * 100 : 0;
    
        if (hasComboDiscount && addonsDiscountAmount > 0) {
            message += `\n*Desconto nos adicionais (TV e Apps):* -${formatCurrency(addonsDiscountAmount)}\n`
        }

        if (cart.omni) {
            promoTotal += cart.omni.price;
            fullTotal += cart.omni.price;
            items.push({ 
                id: cart.omni.id,
                type: 'omni',
                name: `Wi-Fi Extra: ${cart.omni.name}`, 
                details: `${cart.omni.details}`, 
                price: cart.omni.price 
            });
            message += `*Wi-Fi Extra:* ${cart.omni.name} - ${formatCurrency(cart.omni.price)}\n`;
        }

        if (cart.nobreak) {
            promoTotal += cart.nobreak.price;
            fullTotal += cart.nobreak.price;
            items.push({ 
                id: cart.nobreak.id,
                type: 'nobreak',
                name: `Proteção: ${cart.nobreak.name}`, 
                price: cart.nobreak.price 
            });
            message += `*Proteção:* ${cart.nobreak.name} - ${formatCurrency(cart.nobreak.price)}\n`;
        }

        message += `\n*Total Mensal:* ${formatCurrency(fullTotal)}`;
        if (promoTotal !== fullTotal) {
            message += `\n*Nos 3 primeiros meses:* ${formatCurrency(promoTotal)}`;
        }

        let upgradeInfo: UpgradeComparison | null = null;
        const needsNudge = cart.internet?.id === 'res-500' || cart.internet?.id === 'res-600';
        
        if (needsNudge) {
            const plan800 = DB.internet.casa.find(p => p.id === 'res-800');
            if (plan800) {
                const base800Full = plan800.fullPrice || 119.90;
                let hypotheticalUpgradeTotal = base800Full;
                let potentialAddonsSavings = 0;

                cart.apps.forEach(app => {
                    const isSkyFull = app.tier === 'Sky Full';
                    const effectivePrice = isSkyFull ? app.price : app.comboPrice;
                    hypotheticalUpgradeTotal += effectivePrice;
                    potentialAddonsSavings += (app.price - effectivePrice);
                });

                if (cart.tv) {
                    hypotheticalUpgradeTotal += cart.tv.comboPrice;
                    potentialAddonsSavings += (cart.tv.price - cart.tv.comboPrice);
                }

                if (cart.omni) hypotheticalUpgradeTotal += cart.omni.price;
                if (cart.nobreak) hypotheticalUpgradeTotal += cart.nobreak.price;

                const diffMonthly = hypotheticalUpgradeTotal - fullTotal;
                
                upgradeInfo = {
                    show: true,
                    diffMonthly: diffMonthly,
                    diffDaily: diffMonthly / 30,
                    addonsSavings: potentialAddonsSavings,
                    isCheaper: diffMonthly <= 0,
                    totalUpgrade: hypotheticalUpgradeTotal
                };
            }
        }

        return { 
            total: { promo: promoTotal, full: fullTotal }, 
            summaryItems: items, 
            whatsAppMessage: message,
            comboDiscountInfo: {
                isActive: hasComboDiscount && addonsDiscountAmount > 0,
                amount: addonsDiscountAmount,
                percentage: addonsDiscountPercentage,
            },
            upgradeComparison: upgradeInfo
        };
    }, [cart]);

    const internetPlans = cart.planType ? DB.internet[cart.planType] : [];
    const isNoBreakSelected = !!cart.nobreak;
    const ProtectedIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline-block ml-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
    const noBreakTitle = cart.nobreak ? (<span className="flex items-center justify-center">Estou protegido<ProtectedIcon /></span>) : "3. Proteção contra falhas de energia";

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20 lg:pb-0">
            <Header onLogoClick={() => setShowTelemetry(prev => !prev)} />
            <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 flex-grow">
                <Section title="Monte seu combo ideal da Entre" subtitle="Siga os passos abaixo para personalizar os serviços da Entre para você." isIntro />

                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className={`lg:col-span-${showAddons ? '8' : '12'} transition-all duration-500`}>
                        <PlanTypeSelector selectedType={cart.planType} onSelectType={handleSelectPlanType} />

                        {cart.planType && (
                            <div className="animate-fade-in-scale">
                                <div ref={sectionsRef.internet}>
                                    <Section 
                                        title={internetViewMode === 'plans' ? "1. Escolha sua Internet Premium" : "1. Escolha um Combo Sugerido"}
                                        subtitle={internetViewMode === 'plans' ? `A melhor conexão para ${cart.planType === 'casa' ? 'sua casa' : 'sua empresa'}.` : "Perfis montados para diferentes estilos de vida."}
                                        onSecondaryAction={PROFILES[cart.planType]?.length > 0 ? toggleInternetViewMode : undefined} 
                                        secondaryActionText={PROFILES[cart.planType]?.length > 0 ? (internetViewMode === 'plans' ? "Ver Combos Sugeridos" : "Ver Planos Individuais") : undefined}
                                    >
                                        {internetViewMode === 'plans' ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-scale">
                                                {internetPlans.map(plan => (
                                                    <PlanCard key={plan.id} plan={plan} isSelected={cart.internet?.id === plan.id} onSelect={() => handleSelectInternet(plan)} planType="internet" bestOfferText={cart.planType === 'casa' ? 'Melhor Escolha' : 'Melhor Oferta'} />
                                                ))}
                                            </div>
                                        ) : (
                                            <ProfileSelector 
                                                planType={cart.planType} 
                                                selectedProfileId={selectedProfileId} 
                                                onSelectProfile={handleSelectProfile}
                                                simpleMode={true}
                                            />
                                        )}

                                        <p className="text-xs text-gray-400 mt-6 text-center">
                                            ¹Valor da instalação R$500,00 com desconto de até 100% na adesão do Contrato de Permanência.
                                        </p>

                                        {/* EXIBIÇÃO DA DESCRIÇÃO EMPRESARIAL */}
                                        {isBusiness && (
                                            <BusinessFeaturesExplanation />
                                        )}

                                        {!cart.internet && (
                                            <StepsProgressBar planType={cart.planType} />
                                        )}
                                    </Section>
                                </div>
                            </div>
                        )}

                        {showAddons && (
                            <div className="space-y-12 animate-fade-in-scale">
                                <div ref={sectionsRef.omni}>
                                    <Section title="2. Expandindo a cobertura WIFI" subtitle="" onSkip={() => handleSkip('nobreak')} logoSrc="/images/omni_logo.png">
                                        <OmniExplanation />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                            {DB.omni.map(plan => (
                                                <PlanCard key={plan.id} plan={plan} isSelected={cart.omni?.id === plan.id} onSelect={() => handleSelectOmni(plan)} planType="addon" />
                                            ))}
                                        </div>
                                    </Section>
                                </div>
                                <div ref={sectionsRef.nobreak} className={`relative -mx-4 md:-mx-6 lg:mx-0 px-4 md:px-6 lg:rounded-3xl transition-colors duration-700 ease-in-out ${isNoBreakSelected ? 'bg-entre-purple-light/50' : 'bg-gray-900'}`} id="section-nobreak">
                                    <div className="absolute top-8 right-8 hidden lg:block opacity-80 pointer-events-none" aria-hidden="true"><img src="/images/nobreak_source.png" alt="" className="h-20 w-auto max-w-[200px]" /></div>
                                    <Section title={noBreakTitle} subtitle="" isDarkSection={!isNoBreakSelected} onSkip={isBusiness ? undefined : () => handleSkip('apps')}>
                                        <NoBreakExplanation isDark={!isNoBreakSelected} />
                                        <div className="max-w-md mx-auto">
                                            <PlanCard key={DB.nobreak.id} plan={DB.nobreak} isSelected={isNoBreakSelected} onSelect={() => handleSelectNobreak(DB.nobreak)} planType="addon" isDark={!isNoBreakSelected} autoHeight={true} />
                                        </div>
                                    </Section>
                                </div>
                                
                                {cart.planType === 'casa' && (
                                    <div ref={sectionsRef.apps}>
                                        <Section title="4. Streaming e Apps" subtitle="Selecione quantos aplicativos desejar para adicionar ao seu combo.">
                                            <AppSection apps={DB.apps} selectedApps={cart.apps} onSelectApp={handleSelectApp} hasComboDiscount={cart.internet?.comboDiscount} appTierCounts={appTierCounts} />
                                        </Section>
                                    </div>
                                )}
                            </div>
                        )}
                        <div ref={checkoutMarkerRef} className="h-1" />
                    </div>

                    {showAddons && (
                        <div className="hidden lg:block lg:col-span-4 transition-all duration-500 animate-slide-in-right">
                            <div className="sticky top-24">
                                <StickySidebar 
                                    summaryItems={summaryItems} 
                                    total={total} 
                                    whatsAppMessage={whatsAppMessage} 
                                    comboDiscountInfo={comboDiscountInfo} 
                                    onClearCart={handleClearCart} 
                                    onRemoveItem={handleRemoveItemRequest}
                                    upgradeComparison={upgradeComparison}
                                    onAcceptUpgrade={handleUpgradeAccept}
                                />
                                {currentNextStepConfig && (
                                    <NextStepButton label={currentNextStepConfig.label} targetName={currentNextStepConfig.targetName} onClick={handleNextStepClick} variant="desktop" />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            
            {showUpgradeModal && (
                <UpgradeNudgeModal 
                    plan600={DB.internet.casa.find(p => p.id === 'res-600')!}
                    plan800={DB.internet.casa.find(p => p.id === 'res-800')!}
                    onAccept={handleUpgradeAccept}
                    onDecline={handleUpgradeDecline}
                />
            )}

            {itemPendingRemoval && (
                <RemovalConfirmationModal 
                    itemName={itemPendingRemoval.name}
                    onConfirm={confirmRemoval}
                    onCancel={cancelRemoval}
                />
            )}

            {showAddons && currentNextStepConfig && (
                <NextStepButton label={currentNextStepConfig.label} targetName={currentNextStepConfig.targetName} onClick={handleNextStepClick} variant="mobile" />
            )}

            {showAddons && (
                <MobileBottomBar total={total.promo} itemCount={summaryItems.length} onViewDetails={() => setIsCartOpen(true)} />
            )}

            {isCartOpen && (
                <Summary 
                    summaryItems={summaryItems} 
                    total={total} 
                    whatsAppMessage={whatsAppMessage} 
                    onClose={() => setIsCartOpen(false)} 
                    onRemoveItem={handleRemoveItemRequest}
                    comboDiscountInfo={comboDiscountInfo} 
                    upgradeComparison={upgradeComparison}
                    onAcceptUpgrade={handleUpgradeAccept}
                />
            )}

            {showTelemetry && <TelemetryDashboard onClose={() => setShowTelemetry(false)} />}
        </div>
    );
};

export default App;

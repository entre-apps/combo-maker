
import React, { useState, useMemo, useCallback, useRef } from 'react';
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
import { DB, PROFILES } from './data/products';
import type { PlanType, CartState, InternetPlan, AppInfo, OmniPlan, NoBreakPlan, Profile } from './types';
import { formatCurrency } from './utils/formatters';
import { ProfileSelector } from './components/ProfileSelector';

type StepName = 'internet' | 'omni' | 'nobreak' | 'apps' | 'checkout';
type InternetViewMode = 'plans' | 'combos';

interface NextStepConfig {
    targetRef: React.RefObject<HTMLDivElement> | null;
    label: string;
    targetName: string;
    stepId: StepName;
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
    
    // Estado para controlar a visualização da seção de internet (Planos vs Combos)
    const [internetViewMode, setInternetViewMode] = useState<InternetViewMode>('plans');
    
    // Estado para controlar qual é o "Próximo Passo" lógico sugerido pelo botão
    const [nextStepId, setNextStepId] = useState<StepName>('internet');

    const internetRef = useRef<HTMLDivElement>(null);
    const appsRef = useRef<HTMLDivElement>(null);
    const omniRef = useRef<HTMLDivElement>(null);
    const nobreakRef = useRef<HTMLDivElement>(null);
    const profileSelectorRef = useRef<HTMLDivElement>(null);

    const sectionsRef = useMemo(() => ({
        internet: internetRef,
        apps: appsRef,
        omni: omniRef,
        nobreak: nobreakRef,
        profileSelector: profileSelectorRef,
    }), []);

    // Configuração do destino do botão baseado no state nextStepId
    const currentNextStepConfig = useMemo((): NextStepConfig | null => {
        switch (nextStepId) {
            case 'omni':
                return { targetRef: sectionsRef.omni, label: 'Expandir Wi-Fi', targetName: 'Omni', stepId: 'omni' };
            case 'nobreak':
                return { targetRef: sectionsRef.nobreak, label: 'Proteção Elétrica', targetName: 'Mini NoBreak', stepId: 'nobreak' };
            case 'apps':
                return { targetRef: sectionsRef.apps, label: 'Conteúdo Digital', targetName: 'Apps', stepId: 'apps' };
            case 'checkout':
                return null; // Chegou ao fim, esconde o botão
            default:
                return { targetRef: sectionsRef.internet, label: 'Internet', targetName: 'Planos', stepId: 'internet' };
        }
    }, [nextStepId, sectionsRef]);

    const handleScrollTo = useCallback((ref: React.RefObject<HTMLElement>) => {
        const headerOffset = 100; // Um pouco mais de espaço para o header
        if (ref.current) {
            const elementPosition = ref.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    // Ação do botão "Próximo Passo"
    const handleNextStepClick = useCallback(() => {
        if (currentNextStepConfig?.targetRef) {
            handleScrollTo(currentNextStepConfig.targetRef);
            
            // Avança o estado lógico para o próximo item da sequência após o clique/scroll
            // Sequência: Internet -> Omni -> NoBreak -> Apps -> Checkout (Esconde)
            if (nextStepId === 'internet') setNextStepId('omni');
            else if (nextStepId === 'omni') setNextStepId('nobreak');
            else if (nextStepId === 'nobreak') setNextStepId('apps');
            else if (nextStepId === 'apps') setNextStepId('checkout'); // Esconde o botão ao chegar nos apps
        }
    }, [currentNextStepConfig, handleScrollTo, nextStepId]);

    const resetCartAddons = () => ({
        tv: null,
        apps: [],
        omni: null,
        nobreak: null,
    });

    const handleSelectPlanType = useCallback((type: PlanType) => {
        setSelectedProfileId(null);
        setInternetViewMode('plans'); // Reseta a visualização para planos ao trocar o tipo
        setCart({
            planType: type,
            ...resetCartAddons(),
            internet: null,
        });
        // Reinicia o fluxo
        setNextStepId('internet');
        
        setTimeout(() => {
            if (sectionsRef.internet.current) {
                handleScrollTo(sectionsRef.internet);
            }
        }, 300);
    }, [handleScrollTo, sectionsRef]);

    const handleSelectInternet = useCallback((plan: InternetPlan) => {
        setSelectedProfileId(null);
        setCart(prev => ({
            ...prev,
            internet: plan,
        }));

        setNextStepId('omni');
    }, []);

    const handleSelectApp = useCallback((app: AppInfo) => {
        setSelectedProfileId(null);
        setCart(prev => {
            const newApps = [...prev.apps];
            const appIndex = newApps.findIndex(a => a.id === app.id);
            
            if (appIndex > -1) {
                newApps.splice(appIndex, 1);
            } else {
                const tierCount = newApps.filter(a => a.tier === app.tier).length;
                if (tierCount < 3) {
                    newApps.push(app);
                } else {
                    console.warn(`Tier limit for ${app.tier} reached.`);
                }
            }
            
            return { ...prev, apps: newApps };
        });
    }, []);


    const handleSelectOmni = useCallback((plan: OmniPlan) => {
        setSelectedProfileId(null);
        setCart(prev => {
            return {
                ...prev,
                omni: prev.omni?.id === plan.id ? null : plan,
            };
        });
        setNextStepId('nobreak');
    }, []);

    const handleSelectNobreak = useCallback((plan: NoBreakPlan) => {
        setSelectedProfileId(null);
        setCart(prev => {
            return {
                ...prev,
                nobreak: prev.nobreak ? null : plan,
            };
        });
        setNextStepId('apps');
    }, []);
    
    const handleSelectProfile = useCallback((profile: Profile) => {
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
        setNextStepId('omni');
        
        // Scroll automático removido conforme solicitado para manter o usuário no card selecionado
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
        setInternetViewMode('plans');
        setIsCartOpen(false);
        setNextStepId('internet');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleRemoveItem = useCallback((type: string, id?: string) => {
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
    }, []);

    const handleSkip = (targetStep: StepName) => {
        setNextStepId(targetStep);
        const refMap: Record<string, React.RefObject<HTMLDivElement>> = {
            'omni': sectionsRef.omni,
            'nobreak': sectionsRef.nobreak,
            'apps': sectionsRef.apps
        };
        if (refMap[targetStep]) {
            handleScrollTo(refMap[targetStep]);
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

    const { total, summaryItems, whatsAppMessage, comboDiscountInfo, totalPromoText } = useMemo(() => {
        if (!cart.internet) return { total: { promo: 0, full: 0 }, summaryItems: [], whatsAppMessage: '', comboDiscountInfo: { isActive: false, amount: 0, percentage: 0 }, totalPromoText: undefined };

        let promoTotal = 0;
        let fullTotal = 0;
        const items: { id: string; type: string; name: string; details?: string; price: number; promoPrice?: number; priceNote?: string; promo?: string; }[] = [];
        let message = `Olá Entre! Tenho interesse em contratar o seguinte pedido:\n\n`;
        
        const hasComboDiscount = cart.internet.comboDiscount ?? false;
        const isPromoPlan = cart.internet.promo && cart.internet.fullPrice;
        const totalPromoText = isPromoPlan ? cart.internet.promo : undefined;

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
            message += `*Plano Internet:* ${internetItem.name} - ${formatCurrency(internetItem.price)} (Promoção: ${formatCurrency(internetItem.promoPrice)} ${internetItem.promo!.replace('*', '')})\n`;
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

        // Lógica de TV mantida apenas para exibir itens se estiverem no state (ex: via Profile), mas a seleção manual foi removida
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
                price: cart.tv.price, 
                promoPrice: hasComboDiscount ? price : undefined, 
                promo: hasComboDiscount ? 'Oferta Combo' : undefined 
            });
            message += `*TV:* ${cart.tv.name}\n`;
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
                    price: app.price,
                    promoPrice: (hasComboDiscount && !isSkyFull) ? price : undefined,
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

        if (promoTotal !== fullTotal && isPromoPlan) {
             message += `\n*Total Mensal:* ${formatCurrency(fullTotal)} (${formatCurrency(promoTotal)} ${cart.internet.promo!.replace('*', '')})`;
        } else {
             message += `\n*Total Mensal:* ${formatCurrency(promoTotal)}`;
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
            totalPromoText
        };
    }, [cart]);

    const internetPlans = cart.planType ? DB.internet[cart.planType] : [];
    const showAddons = !!cart.internet;
    const isNoBreakSelected = !!cart.nobreak;
    const hasProfiles = cart.planType && PROFILES[cart.planType]?.length > 0;
    const ProtectedIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline-block ml-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
    const noBreakTitle = cart.nobreak ? (<span className="flex items-center justify-center">Estou protegido<ProtectedIcon /></span>) : "Proteja a Internet contra falhas de energia";

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20 lg:pb-0">
            <Header />
            <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 flex-grow">
                <Section title="Monte seu combo ideal da Entre" subtitle="Siga os passos abaixo para personalizar os serviços da Entre para você." isIntro />

                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Column - Main Content */}
                    <div className={`lg:col-span-${showAddons ? '8' : '12'} transition-all duration-500`}>
                        <PlanTypeSelector selectedType={cart.planType} onSelectType={handleSelectPlanType} />

                        {cart.planType && (
                            <div className="animate-fade-in-scale">
                                <div ref={sectionsRef.internet}>
                                    <Section 
                                        title={internetViewMode === 'plans' ? "1. Escolha sua Internet Premium" : "1. Escolha um Combo Sugerido"}
                                        subtitle={internetViewMode === 'plans' ? `A melhor conexão para ${cart.planType === 'casa' ? 'sua casa' : 'sua empresa'}.` : "Perfis montados para diferentes estilos de vida."}
                                        onSecondaryAction={hasProfiles ? toggleInternetViewMode : undefined} 
                                        secondaryActionText={hasProfiles ? (internetViewMode === 'plans' ? "Ver Combos Sugeridos" : "Ver Planos Individuais") : undefined}
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
                                            *Valor da instalação R$500,00 com desconto de até 100% na adesão do Contrato de Permanência.
                                        </p>

                                        {cart.planType === 'empresa' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 max-w-5xl mx-auto animate-fade-in-scale">
                                                <div className="bg-white border-l-4 border-entre-purple-mid p-5 rounded-r-xl shadow-sm text-left">
                                                    <h4 className="font-bold text-entre-purple-dark text-sm mb-2">¹ Gerência Proativa</h4>
                                                    <p className="text-xs text-gray-600 leading-relaxed">
                                                        Monitoramento proativo e contínuo da sua conexão. Em qualquer caso de instabilidade nossa equipe entra em contato imediato com você e, se necessário, mobiliza suporte técnico para reparo.
                                                    </p>
                                                </div>
                                                <div className="bg-white border-l-4 border-entre-purple-mid p-5 rounded-r-xl shadow-sm text-left">
                                                    <h4 className="font-bold text-entre-purple-dark text-sm mb-2">² IP Fixo</h4>
                                                    <p className="text-xs text-gray-600 leading-relaxed">
                                                        Sua empresa passa a ter um endereço IP exclusivo na Internet, facilitando acessos remotos, integrações com sistemas e aumentando a segurança das operações.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </Section>
                                </div>
                            </div>
                        )}

                        {showAddons && (
                            <div className="space-y-12 animate-fade-in-scale">
                                <div ref={sectionsRef.omni}>
                                    <Section title="2. Expandindo o Wi-Fi" subtitle="" onSkip={() => handleSkip('nobreak')} logoSrc="/images/omni_logo.png">
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
                                    <Section title={noBreakTitle} subtitle="" isDarkSection={!isNoBreakSelected} onSkip={() => handleSkip('apps')}>
                                        <NoBreakExplanation isDark={!isNoBreakSelected} />
                                        <div className="max-w-md mx-auto">
                                            <PlanCard key={DB.nobreak.id} plan={DB.nobreak} isSelected={isNoBreakSelected} onSelect={() => handleSelectNobreak(DB.nobreak)} planType="addon" isDark={!isNoBreakSelected} autoHeight={true} />
                                        </div>
                                    </Section>
                                </div>
                                
                                {/* Seção TV removida */}

                                <div ref={sectionsRef.apps}>
                                    <Section title="3. Streaming e Apps" subtitle="Selecione quantos aplicativos desejar para adicionar ao seu combo.">
                                        <AppSection apps={DB.apps} selectedApps={cart.apps} onSelectApp={handleSelectApp} hasComboDiscount={cart.internet?.comboDiscount} appTierCounts={appTierCounts} />
                                    </Section>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sticky Sidebar (Desktop Only) */}
                    {showAddons && (
                        <div className="hidden lg:block lg:col-span-4 transition-all duration-500 animate-slide-in-right">
                            <div className="sticky top-24">
                                <StickySidebar summaryItems={summaryItems} total={total} whatsAppMessage={whatsAppMessage} comboDiscountInfo={comboDiscountInfo} onClearCart={handleClearCart} onRemoveItem={handleRemoveItem} totalPromoText={totalPromoText} />
                                {currentNextStepConfig && (
                                    <NextStepButton label={currentNextStepConfig.label} targetName={currentNextStepConfig.targetName} onClick={handleNextStepClick} variant="desktop" />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
            
            {/* Mobile Floating Button - Renderizado condicionalmente apenas quando há um próximo passo */}
            {showAddons && currentNextStepConfig && (
                <NextStepButton label={currentNextStepConfig.label} targetName={currentNextStepConfig.targetName} onClick={handleNextStepClick} variant="mobile" />
            )}

            {/* Mobile Bottom Bar */}
            {showAddons && (
                <MobileBottomBar total={total.promo} itemCount={summaryItems.length} onViewDetails={() => setIsCartOpen(true)} />
            )}

            {isCartOpen && (
                <Summary summaryItems={summaryItems} total={total} whatsAppMessage={whatsAppMessage} onClose={() => setIsCartOpen(false)} onClearCart={handleClearCart} comboDiscountInfo={comboDiscountInfo} onRemoveItem={handleRemoveItem} totalPromoText={totalPromoText} />
            )}
        </div>
    );
};

export default App;

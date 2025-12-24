
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
import { DB, PROFILES } from './data/products';
import type { PlanType, CartState, InternetPlan, TvPlan, AppInfo, OmniPlan, NoBreakPlan, Profile } from './types';
import { formatCurrency } from './utils/formatters';
import { ProfileSelector } from './components/ProfileSelector';

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

    const internetRef = useRef<HTMLDivElement>(null);
    const tvRef = useRef<HTMLDivElement>(null);
    const appsRef = useRef<HTMLDivElement>(null);
    const omniRef = useRef<HTMLDivElement>(null);
    const nobreakRef = useRef<HTMLDivElement>(null);
    const profileSelectorRef = useRef<HTMLDivElement>(null);

    const sectionsRef = useMemo(() => ({
        internet: internetRef,
        tv: tvRef,
        apps: appsRef,
        omni: omniRef,
        nobreak: nobreakRef,
        profileSelector: profileSelectorRef,
    }), []);

    const handleScrollTo = useCallback((ref: React.RefObject<HTMLElement>) => {
        const headerOffset = 80;
        if (ref.current) {
            const elementPosition = ref.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }, []);

    const resetCartAddons = () => ({
        tv: null,
        apps: [],
        omni: null,
        nobreak: null,
    });

    const handleSelectPlanType = useCallback((type: PlanType) => {
        setSelectedProfileId(null);
        setCart({
            planType: type,
            ...resetCartAddons(),
            internet: null,
        });
        // Removido auto-scroll para UX mais suave (controle do usuário)
    }, []);

    const handleSelectInternet = useCallback((plan: InternetPlan) => {
        setSelectedProfileId(null);
        setCart(prev => ({
            ...prev,
            internet: plan,
            // Mantemos addons se o usuário estiver apenas trocando a velocidade
            // ...resetCartAddons(), 
        }));
    }, []);

    const handleSelectTv = useCallback((plan: TvPlan) => {
        setSelectedProfileId(null);
        setCart(prev => {
            return {
                ...prev,
                tv: prev.tv?.id === plan.id ? null : plan,
            };
        });
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
    }, []);

    const handleSelectNobreak = useCallback((plan: NoBreakPlan) => {
        setSelectedProfileId(null);
        setCart(prev => {
            return {
                ...prev,
                nobreak: prev.nobreak ? null : plan,
            };
        });
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

        // Scroll suave apenas para confirmar a seleção do perfil e mostrar o resultado
        setTimeout(() => {
            if (internetRef.current) handleScrollTo(internetRef);
        }, 100);

    }, [cart.planType, handleScrollTo]);

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
        setIsCartOpen(false);
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
            
            // Se removermos itens do perfil selecionado, desmarcamos o perfil
            setSelectedProfileId(null);
            
            return newCart;
        });
    }, []);

    const handleContinue = useCallback(() => {
        if (!cart.internet) return;

        // Lógica de navegação:
        // Se tem desconto de combo (plano premium), vai para a seleção de perfis/combo.
        // Se NÃO tem desconto de combo (plano básico), pula direto para o NoBreak (ignorando perfis e omni).
        if (cart.internet.comboDiscount) {
            handleScrollTo(sectionsRef.profileSelector);
        } else {
            handleScrollTo(sectionsRef.nobreak);
        }
    }, [cart.internet, handleScrollTo, sectionsRef]);

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
        
        // Define o texto promocional se o plano de internet for promocional
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
    
    // Verifica se existem perfis disponíveis para o tipo de plano selecionado
    const hasProfiles = cart.planType && PROFILES[cart.planType]?.length > 0;

    const ProtectedIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 inline-block ml-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const ArrowDownIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
        </svg>
    );

    const noBreakTitle = cart.nobreak ? (
        <span className="flex items-center justify-center">
            Estou protegido
            <ProtectedIcon />
        </span>
    ) : "Proteja-se contra falhas de energia";

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20 lg:pb-0">
            <Header />
            <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 flex-grow">
                
                {/* Intro Section - Full Width */}
                <Section
                    title="Monte seu combo ideal da Entre"
                    subtitle="Siga os passos abaixo para personalizar os serviços da Entre para você."
                    isIntro
                />

                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    
                    {/* Left Column - Main Content */}
                    <div className={`lg:col-span-${showAddons ? '8' : '12'} transition-all duration-500`}>
                        
                        <PlanTypeSelector
                            selectedType={cart.planType}
                            onSelectType={handleSelectPlanType}
                        />

                        {cart.planType && (
                            <div className="animate-fade-in-scale">
                                <div ref={sectionsRef.internet}>
                                    <Section
                                        title="1. Escolha sua Internet Premium"
                                        subtitle={`A melhor conexão para ${cart.planType === 'casa' ? 'sua casa' : 'sua empresa'}.`}
                                        onSecondaryAction={hasProfiles ? () => handleScrollTo(sectionsRef.profileSelector) : undefined}
                                        secondaryActionText={hasProfiles ? "Ver Combos Sugeridos" : undefined}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {internetPlans.map(plan => (
                                                <PlanCard
                                                    key={plan.id}
                                                    plan={plan}
                                                    isSelected={cart.internet?.id === plan.id}
                                                    onSelect={() => handleSelectInternet(plan)}
                                                    planType="internet"
                                                    bestOfferText={cart.planType === 'casa' ? 'Melhor Escolha' : 'Melhor Oferta'}
                                                />
                                            ))}
                                        </div>
                                        
                                        {/* Seta de Continuar com Glow - Substitui o botão anterior */}
                                        {cart.internet && (
                                            <div className="mt-8 flex justify-center animate-fade-in-scale">
                                                <button
                                                    onClick={handleContinue}
                                                    className="p-4 rounded-full text-entre-purple-mid hover:text-entre-purple-dark transition-colors duration-300 hover:scale-110 transform cursor-pointer"
                                                    aria-label="Continuar para a próxima etapa"
                                                    title="Continuar"
                                                >
                                                     <div className="animate-bounce drop-shadow-[0_0_8px_rgba(157,78,221,0.6)]">
                                                        <ArrowDownIcon />
                                                     </div>
                                                </button>
                                            </div>
                                        )}
                                    </Section>
                                </div>

                                <div ref={sectionsRef.profileSelector}>
                                    <ProfileSelector
                                        planType={cart.planType}
                                        selectedProfileId={selectedProfileId}
                                        onSelectProfile={handleSelectProfile}
                                    />
                                </div>
                            </div>
                        )}

                        {showAddons && (
                            <div className="space-y-12 animate-fade-in-scale">
                                <div ref={sectionsRef.omni}>
                                    <Section
                                        title="2. Expandindo o Wi-Fi (Opcional)"
                                        subtitle="Leve a máxima conexão para todos os cantos com o OMNI Wi-Fi."
                                        onSkip={() => handleScrollTo(sectionsRef.nobreak)}
                                        logoSrc="/images/omni_logo.png"
                                    >
                                        <OmniExplanation />
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                                            {DB.omni.map(plan => (
                                                <PlanCard
                                                    key={plan.id}
                                                    plan={plan}
                                                    isSelected={cart.omni?.id === plan.id}
                                                    onSelect={() => handleSelectOmni(plan)}
                                                    planType="addon"
                                                />
                                            ))}
                                        </div>
                                    </Section>
                                </div>

                                <div 
                                    ref={sectionsRef.nobreak} 
                                    className={`relative -mx-4 md:-mx-6 lg:mx-0 px-4 md:px-6 lg:rounded-3xl transition-colors duration-700 ease-in-out ${isNoBreakSelected ? 'bg-entre-purple-light/50' : 'bg-gray-900'}`} 
                                    id="section-nobreak"
                                >
                                    <div className="absolute top-8 right-8 hidden lg:block opacity-80 pointer-events-none" aria-hidden="true">
                                        <img src="/images/nobreak_source.png" alt="" className="h-20 w-auto max-w-[200px]" />
                                    </div>
                                    <Section
                                        title={noBreakTitle}
                                        subtitle="Não fique offline nem quando a luz acabar."
                                        isDarkSection={!isNoBreakSelected}
                                        onSkip={() => handleScrollTo(sectionsRef.tv)}
                                    >
                                        <NoBreakExplanation isDark={!isNoBreakSelected} />
                                        <div className="max-w-md mx-auto">
                                            <PlanCard
                                                key={DB.nobreak.id}
                                                plan={DB.nobreak}
                                                isSelected={isNoBreakSelected}
                                                onSelect={() => handleSelectNobreak(DB.nobreak)}
                                                planType="addon"
                                                isDark={!isNoBreakSelected}
                                                autoHeight={true}
                                            />
                                        </div>
                                    </Section>
                                </div>
                                
                                <div ref={sectionsRef.tv} className="relative">
                                    <div className="absolute top-12 right-12 hidden lg:block" aria-hidden="true">
                                        <img src="/images/watch_logo.png" alt="Logo Watch TV" className="w-[100px] h-[40px]" />
                                    </div>
                                    <Section
                                        title="3. Adicione TV ao vivo"
                                        subtitle="Turbine seu plano com canais e streaming by Watch."
                                        onSkip={() => handleScrollTo(sectionsRef.apps)}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                            {DB.tv.map(plan => (
                                                <PlanCard
                                                    key={plan.id}
                                                    plan={plan}
                                                    isSelected={cart.tv?.id === plan.id}
                                                    onSelect={() => handleSelectTv(plan)}
                                                    planType="addon"
                                                    hasComboDiscount={cart.internet?.comboDiscount}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-center mt-8 text-gray-500 text-sm">Assista no celular, tablet, computador e SmarTVs compatíveis</p>
                                    </Section>
                                </div>
                                
                                <div ref={sectionsRef.apps}>
                                    <Section
                                        title="4. Streaming e Apps"
                                        subtitle="Selecione quantos aplicativos desejar para adicionar ao seu combo."
                                    >
                                        <AppSection
                                            apps={DB.apps}
                                            selectedApps={cart.apps}
                                            onSelectApp={handleSelectApp}
                                            hasComboDiscount={cart.internet?.comboDiscount}
                                            appTierCounts={appTierCounts}
                                        />
                                    </Section>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Sticky Sidebar (Desktop Only) */}
                    {showAddons && (
                        <div className="hidden lg:block lg:col-span-4 transition-all duration-500 animate-slide-in-right">
                            <StickySidebar 
                                summaryItems={summaryItems}
                                total={total}
                                whatsAppMessage={whatsAppMessage}
                                comboDiscountInfo={comboDiscountInfo}
                                onClearCart={handleClearCart}
                                onRemoveItem={handleRemoveItem}
                                totalPromoText={totalPromoText}
                            />
                        </div>
                    )}
                </div>

            </main>
            
            {/* Mobile Bottom Bar */}
            {showAddons && (
                <MobileBottomBar 
                    total={total.promo} 
                    itemCount={summaryItems.length}
                    onViewDetails={() => setIsCartOpen(true)} 
                />
            )}

            {/* Mobile Modal for Details */}
            {isCartOpen && (
                <Summary 
                    summaryItems={summaryItems}
                    total={total}
                    whatsAppMessage={whatsAppMessage}
                    onClose={() => setIsCartOpen(false)}
                    onClearCart={handleClearCart}
                    comboDiscountInfo={comboDiscountInfo}
                    onRemoveItem={handleRemoveItem}
                    totalPromoText={totalPromoText}
                />
            )}
        </div>
    );
};

export default App;

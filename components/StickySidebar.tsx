
import React from 'react';
import { formatCurrency } from '../utils/formatters';
import type { UpgradeComparison, SummaryItem } from '../types';

interface StickySidebarProps {
    summaryItems: SummaryItem[];
    total: { promo: number; full: number; };
    whatsAppMessage: string;
    comboDiscountInfo: {
        isActive: boolean;
        amount: number;
        percentage: number;
    };
    onClearCart: () => void;
    onRemoveItem: (type: string, id?: string) => void;
    upgradeComparison: UpgradeComparison | null;
    onAcceptUpgrade?: () => void;
}

const TrashIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-entre-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

export const StickySidebar: React.FC<StickySidebarProps> = ({ summaryItems, total, whatsAppMessage, comboDiscountInfo, onClearCart, onRemoveItem, upgradeComparison, onAcceptUpgrade }) => {
    
    const handleWhatsAppClick = () => {
        const phoneNumber = '5522974001553';
        const encodedMessage = encodeURIComponent(whatsAppMessage);
        const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(url, '_blank');
    };

    const isDisabled = summaryItems.length === 0;
    const dailyPrice = total.full / 30;
    
    // Identifica se é um plano que não deve mostrar valor por dia
    const isLowTierPlan = summaryItems.some(item => item.id === 'res-500' || item.id === 'res-600');

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-300">
            <div className="bg-entre-purple-dark p-4 text-white text-center">
                <h3 className="font-bold text-lg uppercase tracking-wide">Seu Pacote Personalizado</h3>
            </div>
            
            <div className="p-6 flex flex-col max-h-[calc(100vh-260px)] overflow-y-auto custom-scrollbar">
                <div className="space-y-4 mb-6 flex-grow">
                    {summaryItems.length > 0 ? (
                        summaryItems.map((item, index) => (
                            <div key={`${item.type}-${item.id}-${index}`} className="flex justify-between items-start text-sm group">
                                <div className="pr-2 flex-grow">
                                    <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                                    {item.details && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 group-hover:line-clamp-none transition-all">{item.details}</p>}
                                </div>
                                <div className="text-right pl-2 flex flex-col items-end">
                                    {item.promoPrice ? (
                                        <>
                                             <p className="font-bold text-entre-purple-mid whitespace-nowrap">
                                                {formatCurrency(item.promoPrice)}<span className="text-[10px] font-normal text-gray-500">/mês</span>
                                             </p>
                                             <p className="text-[10px] text-green-600 font-bold text-right leading-tight max-w-[120px]">
                                                {item.promo ? item.promo.replace('*', '') : `Após 3 meses: ${formatCurrency(item.price)}/mês`}
                                             </p>
                                        </>
                                    ) : (
                                        <p className="font-bold text-gray-700 whitespace-nowrap">
                                            {formatCurrency(item.price)}<span className="text-[10px] font-normal text-gray-500">/mês</span>
                                        </p>
                                    )}
                                    
                                    {item.type !== 'internet' && (
                                        <button 
                                            onClick={() => onRemoveItem(item.type, item.id)}
                                            className="mt-1 text-gray-300 hover:text-red-500 transition-colors p-1 -mr-1"
                                            title="Remover item"
                                        >
                                            <TrashIcon className="h-3 w-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 opacity-50">
                            <p className="text-sm">Seu carrinho está vazio</p>
                        </div>
                    )}
                </div>

                {/* COMPARATIVO DE UPGRADE (Gatilho de Decisão Inteligente) */}
                {upgradeComparison?.show && (
                    <div className="mb-6 bg-gradient-to-br from-entre-purple-light/50 to-white border-2 border-entre-purple-mid/30 rounded-2xl p-4 shadow-sm relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-12 h-12 bg-entre-orange/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                        
                        <div className="flex items-center gap-2 mb-2">
                            <LightbulbIcon />
                            <span className="text-[10px] font-black text-entre-purple-dark uppercase tracking-widest">Upgrade Inteligente</span>
                        </div>

                        {upgradeComparison.isCheaper ? (
                            <p className="text-xs text-gray-700 leading-tight">
                                <span className="text-green-600 font-bold">Incrível!</span> O plano de <span className="font-black">800 Mega</span> sai <span className="font-black text-green-600">mais barato</span> que este por causa dos descontos nos apps.
                            </p>
                        ) : upgradeComparison.addonsSavings === 0 ? (
                            <p className="text-xs text-gray-700 leading-tight">
                                Por apenas <span className="font-black text-entre-purple-mid">+{formatCurrency(upgradeComparison.diffMonthly)}/mês</span>, você leva <span className="font-black">800 Mega</span> e recebe descontos nos combos com aplicativos
                            </p>
                        ) : (
                            <p className="text-xs text-gray-700 leading-tight">
                                Por apenas <span className="font-black text-entre-purple-mid">+{formatCurrency(upgradeComparison.diffMonthly)}/mês</span>, você leva <span className="font-black">800 Mega</span> e economiza <span className="font-black text-green-600">{formatCurrency(upgradeComparison.addonsSavings)}</span> nos seus apps.
                            </p>
                        )}

                        <button 
                            onClick={onAcceptUpgrade}
                            className="w-full mt-3 bg-white border border-entre-purple-mid text-entre-purple-dark text-[10px] font-black py-1.5 rounded-lg hover:bg-entre-purple-mid hover:text-white transition-all shadow-sm"
                        >
                            TROCAR PARA 800 MEGA
                        </button>
                    </div>
                )}

                {comboDiscountInfo.isActive && (
                    <div className="mb-6 bg-green-100 border-2 border-green-200 rounded-xl p-3 text-center shadow-inner">
                        <p className="text-[10px] text-green-800 font-black uppercase tracking-widest mb-1">Economia de Combo!</p>
                        <p className="text-sm text-green-900 font-bold">
                             Vantagem de: <span className="text-base text-green-600">-{formatCurrency(comboDiscountInfo.amount)}</span>
                        </p>
                    </div>
                )}

                <div className="border-t border-dashed border-gray-200 pt-4 mt-auto">
                    {!isDisabled && !isLowTierPlan && (
                        <div className="bg-entre-purple-light/30 rounded-lg p-2 mb-4 text-center border border-entre-purple-light">
                            <p className="text-xs font-bold text-entre-purple-dark">
                                Apenas <span className="text-sm font-black text-entre-purple-mid">{formatCurrency(dailyPrice)}</span> por dia!
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col items-end gap-1 mb-6">
                        <div className="flex justify-between w-full items-baseline">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-tight">Total</span>
                            <span className="text-2xl font-black text-entre-purple-dark leading-none">
                                {formatCurrency(total.full)}
                                <span className="text-sm font-normal text-gray-400">/mês</span>
                            </span>
                        </div>
                        
                        {total.promo !== total.full && (
                            <div className="flex justify-between w-full items-baseline mt-2">
                                <span className="text-xs font-bold text-green-600 uppercase tracking-tight">Nos primeiros 3 meses:</span>
                                <span className="text-2xl font-black text-green-600 leading-none">
                                    {formatCurrency(total.promo)}
                                    <span className="text-sm font-normal text-green-600/70">/mês</span>
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleWhatsAppClick}
                        disabled={isDisabled}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-green-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <span>Enviar meu pacote</span>
                    </button>
                    
                    <button 
                        onClick={onClearCart}
                        disabled={isDisabled}
                        className="w-full mt-3 text-xs text-gray-400 hover:text-red-500 transition-colors underline disabled:opacity-0"
                    >
                        Limpar carrinho
                    </button>
                </div>
            </div>
        </div>
    );
};

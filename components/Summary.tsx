
import React from 'react';
import { formatCurrency } from '../utils/formatters';
import type { UpgradeComparison, SummaryItem } from '../types';

interface SummaryProps {
    summaryItems: SummaryItem[];
    total: { promo: number; full: number; };
    whatsAppMessage: string;
    onClose: () => void;
    onClearCart: () => void;
    onRemoveItem: (type: string, id?: string) => void;
    comboDiscountInfo: {
        isActive: boolean;
        amount: number;
        percentage: number;
    };
    upgradeComparison: UpgradeComparison | null;
    onAcceptUpgrade?: () => void;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-entre-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

export const Summary: React.FC<SummaryProps> = ({ summaryItems, total, whatsAppMessage, onClose, onClearCart, onRemoveItem, comboDiscountInfo, upgradeComparison, onAcceptUpgrade }) => {

    const handleWhatsAppClick = () => {
        const phoneNumber = '5522974001553';
        const encodedMessage = encodeURIComponent(whatsAppMessage);
        const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(url, '_blank');
    };
    
    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white p-6 md:p-8 rounded-xl shadow-2xl max-w-2xl w-full relative transform transition-all duration-300 ease-in-out opacity-0 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors z-10"
                >
                    <CloseIcon />
                </button>
                
                <div className="max-h-[80vh] overflow-y-auto custom-scrollbar pr-2">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Resumo do Pedido</h3>
                    
                    <div className="space-y-2 mb-6">
                        {summaryItems.length > 0 ? (
                            summaryItems.map((item, index) => (
                                <div key={`${item.type}-${item.id}-${index}`} className={`py-3 ${index > 0 ? 'border-t border-gray-200' : ''}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-grow">
                                            <p className="font-bold text-lg text-gray-800">{item.name}</p>
                                            {item.details && <p className="text-sm text-gray-600">{item.details}</p>}
                                        </div>
                                        
                                        <div className="text-right pl-4 flex flex-col items-end">
                                            {item.promoPrice ? (
                                                <>
                                                    <span className="font-bold text-xl text-entre-purple-dark whitespace-nowrap">
                                                        {formatCurrency(item.promoPrice)}<span className="text-xs font-normal">/mês</span>
                                                    </span>
                                                    <span className="text-xs text-green-600 font-bold mb-0.5 text-right max-w-[180px] leading-tight">
                                                        {item.promo ? item.promo.replace('*', '') : `Após 3 meses: ${formatCurrency(item.price)}/mês`}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="font-bold text-lg text-gray-800 whitespace-nowrap">
                                                    {formatCurrency(item.price)}/mês
                                                </span>
                                            )}
                                            
                                            {item.type !== 'internet' && (
                                                <button 
                                                    // FIX: Changed 'id' to 'item.id' to correctly reference the item ID in the removal function.
                                                    onClick={() => onRemoveItem(item.type, item.id)}
                                                    className="mt-2 text-sm text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                    Remover
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-8">Seu carrinho está vazio.</p>
                        )}
                    </div>

                    {/* COMPARATIVO DE UPGRADE NO RESUMO */}
                    {upgradeComparison?.show && (
                        <div className="my-6 bg-gradient-to-br from-entre-purple-light/40 to-white border-2 border-entre-purple-mid/20 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-white p-2 rounded-full shadow-sm">
                                    <LightbulbIcon />
                                </div>
                                <h4 className="text-lg font-black text-entre-purple-dark uppercase tracking-tight">O plano de 800 Mega vale mais a pena!</h4>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/50 p-3 rounded-xl border border-entre-purple-mid/10">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Seu Plano Atual</p>
                                        <p className="text-lg font-black text-gray-800">{formatCurrency(total.full)}<span className="text-xs font-normal">/mês</span></p>
                                    </div>
                                    <div className="bg-entre-purple-dark p-3 rounded-xl shadow-lg transform scale-105">
                                        <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mb-1">Plano 800 MEGA</p>
                                        <p className="text-lg font-black text-white">{formatCurrency(upgradeComparison.totalUpgrade)}<span className="text-xs font-normal">/mês</span></p>
                                    </div>
                                </div>

                                {upgradeComparison.isCheaper ? (
                                    <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                                        <p className="text-sm text-green-800 leading-tight">
                                            <span className="font-bold">Incrível!</span> O plano de 800 Mega sai <span className="font-bold">mais barato</span> que este por causa dos descontos nos apps e TV.
                                        </p>
                                    </div>
                                ) : upgradeComparison.addonsSavings === 0 ? (
                                    <div className="bg-entre-purple-light/20 p-3 rounded-xl border border-entre-purple-mid/10">
                                        <p className="text-sm text-gray-700 leading-tight">
                                            Por apenas <span className="font-bold text-entre-purple-dark">+{formatCurrency(upgradeComparison.diffMonthly)}/mês</span>, você leva 800 Mega e recebe descontos nos combos com aplicativos.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                                        <p className="text-sm text-green-800 leading-tight">
                                            No plano de 800 Mega você paga apenas <span className="font-bold text-entre-purple-dark">+{formatCurrency(upgradeComparison.diffMonthly)}/mês</span> e economiza <span className="font-bold text-lg">{formatCurrency(upgradeComparison.addonsSavings)}</span> em todos os seus aplicativos e TV.
                                        </p>
                                    </div>
                                )}

                                <button 
                                    onClick={onAcceptUpgrade}
                                    className="w-full bg-entre-purple-dark text-white font-black py-3 rounded-xl hover:bg-entre-purple-mid transition-all shadow-lg active:scale-95"
                                >
                                    APROVEITAR ESTA VANTAGEM AGORA
                                </button>
                            </div>
                        </div>
                    )}

                    {comboDiscountInfo.isActive && (
                        <div className="my-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                            <p className="font-bold text-green-800">Desconto de Combo Ativado!</p>
                            <p className="text-sm text-green-700">
                                Você economizou <span className="font-bold">{formatCurrency(comboDiscountInfo.amount)}</span> nos seus adicionais.
                            </p>
                        </div>
                    )}

                    <div className="border-t-2 border-dashed border-gray-300 pt-6">
                        <div className="flex flex-col items-end gap-2 mb-6">
                            <div className="flex justify-between w-full items-baseline">
                                <span className="text-xl md:text-2xl font-bold text-gray-700">Total:</span>
                                <span className="text-xl md:text-2xl font-black text-entre-purple-dark">
                                    {formatCurrency(total.full)}<span className="text-lg font-bold">/mês</span>
                                </span>
                            </div>

                            {total.promo !== total.full && (
                                <div className="flex justify-between w-full items-baseline">
                                    <span className="text-xl md:text-2xl font-bold text-green-600">Nos primeiros 3 meses:</span>
                                    <span className="text-xl md:text-2xl font-black text-green-600">
                                        {formatCurrency(total.promo)}<span className="text-lg font-bold">/mês</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleWhatsAppClick}
                            disabled={summaryItems.length === 0}
                            className="w-full mt-2 text-lg font-bold py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out bg-entre-purple-dark text-white hover:bg-entre-purple-mid disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Enviar meu pacote
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


import React from 'react';
import { formatCurrency } from '../utils/formatters';

interface StickySidebarProps {
    summaryItems: { id: string; type: string; name: string; details?: string; price: number; promoPrice?: number; promo?: string; }[];
    total: { promo: number; full: number; };
    whatsAppMessage: string;
    comboDiscountInfo: {
        isActive: boolean;
        amount: number;
        percentage: number;
    };
    onClearCart: () => void;
    onRemoveItem: (type: string, id?: string) => void;
    totalPromoText?: string;
}

const TrashIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

export const StickySidebar: React.FC<StickySidebarProps> = ({ summaryItems, total, whatsAppMessage, comboDiscountInfo, onClearCart, onRemoveItem, totalPromoText }) => {
    
    const handleWhatsAppClick = () => {
        const phoneNumber = '5522974001553';
        const encodedMessage = encodeURIComponent(whatsAppMessage);
        const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(url, '_blank');
    };

    const isDisabled = summaryItems.length === 0;

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-entre-purple-dark p-4 text-white text-center">
                <h3 className="font-bold text-lg uppercase tracking-wide">Seu Pacote Personalizado</h3>
            </div>
            
            <div className="p-6 flex flex-col max-h-[calc(100vh-260px)] overflow-y-auto custom-scrollbar">
                {/* Lista de Itens */}
                <div className="space-y-4 mb-6 flex-grow">
                    {summaryItems.length > 0 ? (
                        summaryItems.map((item, index) => (
                            <div key={`${item.type}-${item.id}-${index}`} className="flex justify-between items-start text-sm group">
                                <div className="pr-2 flex-grow">
                                    <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                                    {item.details && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 group-hover:line-clamp-none transition-all">{item.details}</p>}
                                    {item.promo && <p className="text-[10px] text-green-600 font-bold mt-0.5">{item.promo.replace('*','')}</p>}
                                </div>
                                <div className="text-right whitespace-nowrap pl-2 flex flex-col items-end">
                                    {item.promoPrice ? (
                                        <>
                                             <p className="font-bold text-entre-purple-mid">{formatCurrency(item.promoPrice)}</p>
                                             <p className="text-[10px] text-gray-500">Após 3 meses: {formatCurrency(item.price)}</p>
                                        </>
                                    ) : (
                                        <p className="font-bold text-gray-700">{formatCurrency(item.price)}</p>
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-sm">Seu carrinho está vazio</p>
                        </div>
                    )}
                </div>

                {/* Descontos */}
                {comboDiscountInfo.isActive && (
                    <div className="mb-6 bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                        <p className="text-xs text-green-800 font-medium">
                            Economia Combo: <span className="font-bold">-{formatCurrency(comboDiscountInfo.amount)}</span>
                        </p>
                    </div>
                )}

                {/* Total e Ações */}
                <div className="border-t border-dashed border-gray-200 pt-4 mt-auto">
                    <div className="flex flex-col items-end gap-1 mb-6">
                        {/* Total Mensal */}
                        <div className="flex justify-between w-full items-baseline">
                            <span className="text-sm font-bold text-gray-500 uppercase tracking-tight">Total Mensal</span>
                            <span className="text-2xl font-black text-entre-purple-dark leading-none">
                                {formatCurrency(total.full)}
                            </span>
                        </div>
                        
                        {/* Promoção 3 meses - Mesmo tamanho de fonte do valor acima */}
                        {total.promo !== total.full && (
                            <div className="flex justify-between w-full items-baseline mt-2">
                                <span className="text-xs font-bold text-green-600 uppercase tracking-tight">Nos 3 primeiros meses:</span>
                                <span className="text-2xl font-black text-green-600 leading-none">
                                    {formatCurrency(total.promo)}
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleWhatsAppClick}
                        disabled={isDisabled}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-green-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                    >
                        <span>Enviar meu pacote</span>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
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

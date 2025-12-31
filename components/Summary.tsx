
import React from 'react';
import { formatCurrency } from '../utils/formatters';

interface SummaryProps {
    summaryItems: { id: string; type: string; name: string; details?: string; price: number; promoPrice?: number; priceNote?: string; promo?: string; }[];
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
    totalPromoText?: string;
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


export const Summary: React.FC<SummaryProps> = ({ summaryItems, total, whatsAppMessage, onClose, onClearCart, onRemoveItem, comboDiscountInfo }) => {

    const handleWhatsAppClick = () => {
        const phoneNumber = '5522974001553'; // Replace with the actual phone number
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
                    aria-label="Fechar resumo do pedido"
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
                                            {item.promo && (
                                                <p className="text-sm font-semibold text-green-600 mt-1">{item.promo.replace('*', '')}</p>
                                            )}
                                        </div>
                                        
                                        <div className="text-right whitespace-nowrap pl-4 flex flex-col items-end">
                                            {item.promoPrice ? (
                                                <>
                                                    <span className="font-bold text-xl text-entre-purple-dark">{formatCurrency(item.promoPrice)}</span>
                                                    <span className="text-xs text-gray-500 mb-0.5">Após 3 meses: {formatCurrency(item.price)}</span>
                                                </>
                                            ) : (
                                                <span className="font-bold text-lg text-gray-800">{formatCurrency(item.price)}</span>
                                            )}
                                            
                                            {item.type !== 'internet' && (
                                                <button 
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

                    {comboDiscountInfo.isActive && (
                        <div className="my-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                            <p className="font-bold text-green-800">Desconto de Combo Ativado!</p>
                            <p className="text-sm text-green-700">
                                Você economizou <span className="font-bold">{formatCurrency(comboDiscountInfo.amount)}</span> ({comboDiscountInfo.percentage.toFixed(0)}%) no valor original dos seus adicionais de TV e Apps.
                            </p>
                        </div>
                    )}

                    <div className="border-t-2 border-dashed border-gray-300 pt-6">
                        <div className="flex flex-col items-end gap-2 mb-6">
                            {/* Linha Total Mensal */}
                            <div className="flex justify-between w-full items-baseline">
                                <span className="text-xl md:text-2xl font-bold text-gray-700">Total Mensal:</span>
                                <span className="text-xl md:text-2xl font-black text-entre-purple-dark">
                                    {formatCurrency(total.full)}
                                </span>
                            </div>

                            {/* Linha Promoção (apenas se houver diferença) */}
                            {total.promo !== total.full && (
                                <div className="flex justify-between w-full items-baseline">
                                    <span className="text-xl md:text-2xl font-bold text-green-600">Nos primeiros 3 meses:</span>
                                    <span className="text-xl md:text-2xl font-black text-green-600">
                                        {formatCurrency(total.promo)}
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
                        <button
                            onClick={onClearCart}
                            disabled={summaryItems.length === 0}
                            className="w-full mt-2 text-sm font-semibold py-2 px-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center text-gray-600 bg-gray-100 hover:bg-gray-200 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <TrashIcon />
                            Limpar tudo e recomeçar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

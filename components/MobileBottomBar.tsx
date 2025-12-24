
import React from 'react';
import { formatCurrency } from '../utils/formatters';

interface MobileBottomBarProps {
    total: number;
    onViewDetails: () => void;
    itemCount: number;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ total, onViewDetails, itemCount }) => {
    if (itemCount === 0) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-50 lg:hidden animate-slide-up">
            <div className="container mx-auto flex justify-between items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Mensal</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-entre-purple-dark">{formatCurrency(total)}</span>
                        <span className="text-xs text-gray-400">/mês</span>
                    </div>
                </div>
                
                <button
                    onClick={onViewDetails}
                    className="bg-entre-purple-dark text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-200 active:scale-95 transition-transform flex items-center gap-2"
                >
                    <span>Ver Resumo</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{itemCount}</span>
                </button>
            </div>
        </div>
    );
};

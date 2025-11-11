import React from 'react';
import { formatCurrency } from '../utils/formatters';

interface FloatingCartProps {
    total: number;
    onOpenCart: () => void;
}

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const FloatingCart: React.FC<FloatingCartProps> = ({ total, onOpenCart }) => {
    return (
        <div className="fixed bottom-6 right-6 z-40">
            <button
                onClick={onOpenCart}
                className="bg-entre-purple-dark text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-3 transition-all transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out"
                aria-label={`Abrir resumo do pedido. Total: ${formatCurrency(total)}`}
                title="Ver resumo do pedido"
            >
                <CartIcon />
                <span className="font-bold text-xl">{formatCurrency(total)}</span>
            </button>
        </div>
    );
};

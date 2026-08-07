
import React, { useState } from 'react';
import { WHATSAPP_URL } from '../config/contact';

interface HeaderProps {
    onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
    const [clickCount, setClickCount] = useState(0);

    const handleLogoClick = () => {
        const newCount = clickCount + 1;
        setClickCount(newCount);
        
        // Se clicar 5 vezes rápidas no logo, abre a telemetria
        if (newCount >= 5 && onLogoClick) {
            onLogoClick();
            setClickCount(0);
        }

        // Reseta o contador após 3 segundos
        setTimeout(() => setClickCount(0), 3000);
    };

    return (
        <header className="bg-white/90 backdrop-blur-xl border-b border-entre-purple-light sticky top-0 z-40">
            <div className="container mx-auto max-w-[1440px] px-4 md:px-6 py-3 flex justify-between items-center">
                <div className="flex items-center gap-4">
                <div
                    onClick={handleLogoClick}
                    className="cursor-default select-none transition-transform active:scale-95"
                    title="Entre Combo Builder"
                >
                    <img src="/images/entre_logo.png" alt="Logo da Entre" className="w-[100px] h-10" />
                </div>
                <div className="hidden h-7 w-px bg-entre-purple-light sm:block" />
                <span className="hidden text-xs font-extrabold uppercase tracking-[0.16em] text-entre-purple-dark/55 sm:block">Monte seu combo</span>
                </div>
                <a 
                    href={WHATSAPP_URL}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-bold bg-entre-purple-brand text-white px-5 py-2.5 rounded-full hover:bg-entre-purple-dark transition-all shadow-sm hover:shadow-md"
                >
                    Fale Conosco
                </a>
            </div>
        </header>
    );
};

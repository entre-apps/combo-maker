
import React, { useState } from 'react';

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
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div 
                    onClick={handleLogoClick}
                    className="cursor-default select-none transition-transform active:scale-95"
                    title="Entre Combo Builder"
                >
                    <img src="/images/entre_logo.png" alt="Logo da Entre" className="w-[100px] h-10" />
                </div>
                <a 
                    href="https://wa.me/5522974001553" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-bold bg-entre-purple-mid text-white px-4 py-2 rounded-lg hover:bg-entre-purple-dark transition-colors shadow-sm"
                >
                    Fale Conosco
                </a>
            </div>
        </header>
    );
};

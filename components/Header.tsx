
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div>
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

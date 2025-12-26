
import React from 'react';

interface NextStepButtonProps {
    label: string;
    targetName: string;
    onClick: () => void;
    variant?: 'desktop' | 'mobile';
}

const ArrowDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
);

export const NextStepButton: React.FC<NextStepButtonProps> = ({ label, targetName, onClick, variant = 'desktop' }) => {
    
    if (variant === 'mobile') {
        return (
            <div className="fixed bottom-[90px] right-4 z-30 lg:hidden animate-fade-in-scale">
                 {/* Glow Compacto */}
                <div className="absolute -inset-1 bg-gradient-to-r from-entre-purple-mid to-entre-orange rounded-full blur opacity-60 animate-pulse"></div>
                
                <button 
                    onClick={onClick}
                    className="rotating-border-container relative bg-white rounded-full p-[2px] shadow-xl transform active:scale-95 transition-all"
                >
                    <div className="bg-white rounded-full px-4 py-2 flex items-center gap-3">
                        <div className="flex flex-col items-start mr-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Próximo</span>
                            <span className="text-sm font-black text-entre-purple-dark leading-none mt-0.5">{targetName}</span>
                        </div>
                        <div className="bg-entre-purple-light text-entre-purple-dark p-1.5 rounded-full w-8 h-8 flex items-center justify-center">
                             <ArrowDownIcon />
                        </div>
                    </div>
                </button>
            </div>
        );
    }

    // Desktop Version
    return (
        <div className="mt-6 relative group w-full">
            {/* Efeito de Glow/Blur atrás */}
            <div className="absolute -inset-1 bg-gradient-to-r from-entre-purple-mid to-entre-orange rounded-xl blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
            
            {/* Botão Principal com Borda Giratória via CSS Class */}
            <button 
                onClick={onClick}
                className="rotating-border-container relative w-full bg-white rounded-xl p-[2px] cursor-pointer transform transition-all duration-200 hover:scale-[1.01] active:scale-[0.98]"
            >
                {/* Miolo do Botão (fundo branco) */}
                <div className="bg-white rounded-[10px] px-6 py-4 flex items-center justify-between">
                    <div className="flex flex-col items-start">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Próxima Etapa</span>
                        <div className="flex items-center">
                            <span className="text-lg font-black text-entre-purple-dark">{label}</span>
                            <span className="mx-2 text-gray-300">|</span>
                            <span className="text-sm font-semibold text-gray-600">{targetName}</span>
                        </div>
                    </div>
                    <div className="bg-entre-purple-light text-entre-purple-dark p-2 rounded-full">
                         <ArrowDownIcon />
                    </div>
                </div>
            </button>
        </div>
    );
};

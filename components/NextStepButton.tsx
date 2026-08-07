
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
                <button 
                    onClick={onClick}
                    className="relative bg-white/95 backdrop-blur-xl rounded-full border border-entre-purple-mid/20 shadow-[0_16px_40px_rgba(41,12,76,0.18)] transform active:scale-[0.98] transition-all"
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
            <button 
                onClick={onClick}
                className="premium-card relative w-full bg-white rounded-2xl border border-entre-purple-mid/15 cursor-pointer transition-all duration-500 active:scale-[0.99] overflow-hidden"
            >
                <div className="bg-gradient-to-r from-white to-entre-purple-light/30 px-6 py-4 flex items-center justify-between">
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

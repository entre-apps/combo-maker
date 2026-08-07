import React from 'react';
import type { PlanType } from '../types';

interface StepsProgressBarProps {
    planType: PlanType | null;
}

export const StepsProgressBar: React.FC<StepsProgressBarProps> = ({ planType }) => {
    const steps = [
        'Internet',
        'Cobertura Wi-Fi',
        'Proteção elétrica',
        ...(planType === 'empresa' ? [] : ['Apps']),
        'Resumo',
    ];

    return (
        <div className="mx-auto mt-10 max-w-4xl animate-fade-in-scale">
            <p className="mb-4 text-center text-[10px] font-extrabold uppercase tracking-[0.18em] text-entre-purple-dark/45">Sua jornada de personalização</p>
            <div className="flex items-center justify-center gap-1.5 md:gap-3">
                {steps.map((step, index) => (
                    <React.Fragment key={step}>
                        <div className={`flex items-center gap-2 rounded-full px-2.5 py-2 md:px-3 ${index === 0 ? 'bg-entre-purple-dark text-white' : 'bg-white text-entre-purple-dark/45 ring-1 ring-entre-purple-light'}`}>
                            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black ${index === 0 ? 'bg-white/15' : 'bg-entre-purple-light'}`}>{index + 1}</span>
                            <span className="hidden text-[10px] font-bold md:inline">{step}</span>
                        </div>
                        {index < steps.length - 1 && <span className="h-px w-2 bg-entre-purple-light md:w-5" />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

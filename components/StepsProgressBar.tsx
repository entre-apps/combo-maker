
import React from 'react';
import type { PlanType } from '../types';

interface StepsProgressBarProps {
    planType: PlanType | null;
}

export const StepsProgressBar: React.FC<StepsProgressBarProps> = ({ planType }) => {
    const isBusiness = planType === 'empresa';

    const steps = [
        { id: 1, label: 'Internet', active: true },
        { id: 2, label: 'Wi-Fi Extra', active: false },
        { id: 3, label: 'Proteção Elétrica', active: false },
        // Adiciona Apps apenas se não for empresa
        ...(!isBusiness ? [{ id: 4, label: 'Streaming e Apps', active: false }] : []),
        { id: isBusiness ? 4 : 5, label: 'Resumo', active: false }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto mt-12 mb-4 animate-fade-in-scale">
            <div className="relative">
                {/* Linha de conexão de fundo */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0" />
                
                <div className="relative z-10 flex justify-between items-start w-full">
                    {steps.map((step) => {
                        // Lógica de cores
                        const circleColor = step.active 
                            ? 'bg-entre-purple-mid text-white ring-4 ring-entre-purple-light' 
                            : 'bg-white border-2 border-gray-200 text-gray-300';
                        
                        const labelColor = step.active 
                            ? 'text-entre-purple-dark font-bold' 
                            : 'text-gray-400 font-medium';

                        return (
                            <div key={step.id} className="flex flex-col items-center group cursor-default">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 mb-2 ${circleColor}`}>
                                    {step.active ? (
                                        // Ícone de check ou número para o ativo
                                        <span>1</span>
                                    ) : (
                                        <span>{step.id}</span>
                                    )}
                                </div>
                                <span className={`text-xs md:text-sm text-center max-w-[80px] md:max-w-none transition-colors duration-300 ${labelColor}`}>
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="text-center mt-6">
                 <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Próximas etapas do seu pedido</p>
            </div>
        </div>
    );
};

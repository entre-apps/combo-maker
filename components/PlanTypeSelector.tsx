import React from 'react';
import type { PlanType } from '../types';

interface PlanTypeSelectorProps {
    selectedType: PlanType | null;
    onSelectType: (type: PlanType) => void;
}

export const PlanTypeSelector: React.FC<PlanTypeSelectorProps> = ({ selectedType, onSelectType }) => {
    const getButtonClasses = (type: PlanType) => selectedType === type
        ? 'bg-entre-purple-dark text-white shadow-[0_10px_28px_rgba(90,24,154,.24)]'
        : 'bg-transparent text-entre-purple-dark hover:bg-white';

    return (
        <section className="audience-selector mb-10 md:mb-14">
            <div className="mb-5 text-center">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-entre-purple-mid">Escolha seu perfil</span>
                <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-entre-purple-dark">Qual internet combina com você?</h2>
            </div>
            <div className="mx-auto grid max-w-md grid-cols-2 rounded-full border border-entre-purple-mid/15 bg-entre-purple-light/45 p-1.5 shadow-inner">
                <button
                    onClick={() => onSelectType('casa')}
                    className={`rounded-full px-5 py-3.5 text-sm font-extrabold transition-all duration-500 ${getButtonClasses('casa')}`}
                    aria-pressed={selectedType === 'casa'}
                >
                    Residencial
                </button>
                <button
                    onClick={() => onSelectType('empresa')}
                    className={`rounded-full px-5 py-3.5 text-sm font-extrabold transition-all duration-500 ${getButtonClasses('empresa')}`}
                    aria-pressed={selectedType === 'empresa'}
                >
                    Empresarial
                </button>
            </div>
        </section>
    );
};

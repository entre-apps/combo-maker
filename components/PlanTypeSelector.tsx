import React from 'react';
import type { PlanType } from '../types';

interface PlanTypeSelectorProps {
    selectedType: PlanType | null;
    onSelectType: (type: PlanType) => void;
}

const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
);

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 11.01L3 11v11h18V11.01zM21 3H3v6h18V3zM11 18H7v-4h4v4zm8 0h-4v-4h4v4z"/>
    </svg>
);


export const PlanTypeSelector: React.FC<PlanTypeSelectorProps> = ({ selectedType, onSelectType }) => {
    
    const baseButtonClasses = 'w-full md:w-96 text-left p-6 rounded-xl shadow-lg border-2 transition-all duration-300 ease-in-out transform hover:-translate-y-1 active:scale-95 flex items-center gap-5';

    const getButtonClasses = (type: PlanType) => {
        if (selectedType === type) {
            return `${baseButtonClasses} bg-entre-purple-light border-entre-purple-dark ring-4 ring-entre-purple-mid/30`;
        }
        return `${baseButtonClasses} bg-white border-transparent hover:border-entre-purple-mid`;
    };

    return (
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-entre-purple-dark mb-2 text-center">Comece por aqui</h2>
            <p className="text-lg text-gray-600 mb-8 text-center">Para quem você está contratando?</p>
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-4xl mx-auto">
                <button
                    onClick={() => onSelectType('casa')}
                    className={getButtonClasses('casa')}
                    aria-pressed={selectedType === 'casa'}
                >
                    <div className="flex-shrink-0 text-entre-purple-mid">
                        <HomeIcon />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-entre-purple-dark">Para minha Casa</h3>
                        <p className="text-gray-600 mt-1">A melhor conexão para streaming, jogos e home office.</p>
                    </div>
                </button>
                <button
                    onClick={() => onSelectType('empresa')}
                    className={getButtonClasses('empresa')}
                    aria-pressed={selectedType === 'empresa'}
                >
                     <div className="flex-shrink-0 text-entre-purple-mid">
                        <BuildingIcon />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-entre-purple-dark">Para minha Empresa</h3>
                        <p className="text-gray-600 mt-1">Soluções de alta velocidade e estabilidade para o seu negócio.</p>
                    </div>
                </button>
            </div>
        </section>
    );
};
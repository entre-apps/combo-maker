
import React from 'react';

interface SkipButtonProps {
    onClick: () => void;
    isDark: boolean;
}

const SkipButton: React.FC<SkipButtonProps> = ({ onClick, isDark }) => (
    <button 
        onClick={onClick} 
        className={`mx-auto block mt-[-1rem] mb-4 text-xs font-bold rounded-full px-4 py-1.5 transition-all duration-300 shadow-sm transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDark 
            ? 'bg-gray-700/80 border border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-entre-purple-mid focus:ring-offset-gray-800' 
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-entre-purple-mid focus:ring-offset-white'
        }`}
    >
        Pular esta etapa
    </button>
);

const LightbulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);


interface SectionProps {
    title: React.ReactNode;
    subtitle: string;
    children?: React.ReactNode;
    isIntro?: boolean;
    onSkip?: () => void;
    isDarkSection?: boolean;
    onSecondaryAction?: () => void;
    secondaryActionText?: string;
    logoSrc?: string;
}

export const Section: React.FC<SectionProps> = ({ title, subtitle, children, isIntro = false, onSkip, isDarkSection = false, onSecondaryAction, secondaryActionText, logoSrc }) => {
    
    const titleColor = isDarkSection ? 'text-white' : 'text-entre-purple-dark';
    const subtitleColor = isDarkSection ? 'text-gray-300' : 'text-gray-600';
    
    // Remove borda clara se a seção for escura
    const borderClass = isDarkSection ? 'border-gray-800' : 'border-gray-200';

    if (isIntro) {
        return (
            <section className="text-center mb-12">
                <h1 className="text-4xl font-bold text-entre-purple-dark mb-2">{title}</h1>
                <p className="text-xl text-gray-600">{subtitle}</p>
            </section>
        );
    }
    
    return (
        <section className={`py-12 border-t ${borderClass} relative`}>
            {logoSrc && (
                <div className="absolute top-12 right-12 hidden lg:block" aria-hidden="true">
                    <img src={logoSrc} alt="Logo da Seção" className="h-24" />
                </div>
            )}
            <h2 className={`text-3xl font-bold mb-2 text-center ${titleColor}`}>{title}</h2>
            <p className={`text-lg mb-8 text-center ${subtitleColor}`}>{subtitle}</p>
            
            {onSecondaryAction && secondaryActionText && (
                <div className="text-center mb-8">
                     <button
                        onClick={onSecondaryAction}
                        className="inline-flex items-center justify-center px-5 py-2.5 text-base font-bold text-entre-purple-dark bg-entre-purple-light border-2 border-entre-purple-mid/20 rounded-lg hover:bg-white hover:border-entre-purple-mid transition-all duration-300 ease-in-out transform hover:scale-105"
                    >
                        <LightbulbIcon />
                        {secondaryActionText}
                    </button>
                </div>
            )}

            {onSkip && <SkipButton onClick={onSkip} isDark={isDarkSection} />}
            {children}
        </section>
    );
};

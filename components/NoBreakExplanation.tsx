
import React from 'react';

interface NoBreakExplanationProps {
    isDark: boolean;
}

export const NoBreakExplanation: React.FC<NoBreakExplanationProps> = ({ isDark }) => {
    const titleColor = isDark ? 'text-white' : 'text-entre-purple-dark';
    const textColor = isDark ? 'text-gray-200' : 'text-gray-700';

    return (
        <div className="max-w-3xl mx-auto mb-8 text-center">
            <h3 className={`text-xl font-bold ${titleColor} mb-2`}>Como funciona o Mini NoBreak?</h3>
            <p className={`${textColor} mb-4`}>
                O Mini NoBreak é um dispositivo que fica conectado ao seu roteador. Se a energia cair, ele assume automaticamente, mantendo sua internet funcionando por até 4 horas! Ideal para regiões que sofrem com falhas de energia.
            </p>
        </div>
    );
};

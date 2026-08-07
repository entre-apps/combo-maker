
import React from 'react';

interface NoBreakExplanationProps {
    isDark: boolean;
}

export const NoBreakExplanation: React.FC<NoBreakExplanationProps> = ({ isDark }) => {
    const titleColor = isDark ? 'text-white' : 'text-entre-purple-dark';
    const textColor = isDark ? 'text-gray-200' : 'text-gray-700';

    return (
        <div className="premium-callout max-w-3xl mx-auto mb-8 rounded-[26px] p-6 md:p-8 text-left">
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-entre-purple-mid">Conexão protegida</span>
            <h3 className={`mt-2 text-xl font-extrabold ${titleColor} mb-2`}>O que é o Mini No-Break?</h3>
            <p className={`${textColor} text-sm leading-6 mb-1`}>
                O Mini No-Break é um dispositivo que fica conectado aos seus dispositivos de rede. Se a energia cair, ele assume automaticamente, mantendo sua internet funcionando por até 4 horas!
                <br />
                Ideal para regiões que sofrem com falhas de energia.
            </p>
        </div>
    );
};

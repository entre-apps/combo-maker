
import React from 'react';

export const OmniExplanation: React.FC = () => {
    return (
        <div className="premium-callout max-w-3xl mx-auto mb-8 rounded-[26px] p-6 md:p-8 text-left">
            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-entre-purple-mid">Cobertura inteligente</span>
            <h3 className="mt-2 text-xl font-extrabold text-entre-purple-dark mb-2">O que é o OMNI?</h3>
            <p className="text-sm leading-6 text-gray-600 mb-3">
                O OMNI é a nossa solução de Wi-Fi Mesh que cria uma rede unificada e inteligente na sua casa ou empresa. Ele garante que você tenha o melhor sinal em todos os cômodos.
            </p>
            <p className="text-entre-purple-dark font-extrabold text-sm">
                Ideal para casas de 2 andares ou com mais de 3 cômodos.
            </p>
        </div>
    );
};

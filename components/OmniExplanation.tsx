import React from 'react';

export const OmniExplanation: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto mb-8 text-center">
            <h3 className="text-xl font-bold text-entre-purple-mid mb-2">O que é o OMNI?</h3>
            <p className="text-gray-600 mb-4">
                O OMNI é a nossa solução de Wi-Fi Mesh que cria uma rede unificada e inteligente na sua casa ou empresa. Ele garante que você tenha o melhor sinal em todos os cômodos, sem quedas ou pontos cegos.
            </p>
            <p className="text-sm font-semibold text-gray-700">
                A instalação tem um custo inicial a partir de <span className="text-entre-purple-dark">R$ 40,00 por ponto</span> + R$ 6,00 por metro de cabo (se necessário), avaliado na visita técnica.
            </p>
        </div>
    );
};
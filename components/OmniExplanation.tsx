
import React from 'react';

export const OmniExplanation: React.FC = () => {
    return (
        <div className="max-w-3xl mx-auto mb-6 text-center">
            <h3 className="text-xl font-bold text-entre-purple-mid mb-2">O que é o OMNI?</h3>
            <p className="text-gray-600 mb-4">
                O OMNI é a nossa solução de Wi-Fi Mesh que cria uma rede unificada e inteligente na sua casa ou empresa. Ele garante que você tenha o melhor sinal em todos os cômodos, sem quedas ou pontos cegos.
            </p>
            
            <div className="max-w-md mx-auto mt-4">
                <h4 className="text-2xl font-bold text-entre-purple-dark mb-2 tracking-tight">Instalação</h4>
                <div className="bg-white border border-entre-purple-light rounded-3xl p-4 shadow-sm">
                    <p className="text-entre-purple-dark font-bold text-base leading-relaxed">
                        De acordo com parâmetros do projeto, sendo: R$40 por ponto + R$6 / metro de cabo UTP
                    </p>
                </div>
            </div>
        </div>
    );
};

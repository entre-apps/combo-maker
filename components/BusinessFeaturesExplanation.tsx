
import React from 'react';

export const BusinessFeaturesExplanation: React.FC = () => {
    return (
        <div className="mt-12 space-y-8 max-w-5xl mx-auto">
            {/* Bloco Gerência Proativa */}
            <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row items-stretch border border-gray-100">
                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                    <img 
                        src="/images/gerencia_proativa_bg.png" 
                        alt="Monitoramento de rede" 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bbda4865cda1?auto=format&fit=crop&q=80&w=800'; }}
                    />
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-left">
                    <h3 className="text-2xl font-black text-entre-purple-dark mb-4">
                        <sup className="text-sm mr-1">2</sup>Gerência Proativa
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        Monitoramento proativo e contínuo da sua conexão. Em qualquer caso de instabilidade nossa equipe entra em contato imediato com você e, se necessário, mobiliza suporte técnico para reparo.
                    </p>
                </div>
            </div>

            {/* Bloco IP Fixo */}
            <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col md:flex-row-reverse items-stretch border border-gray-100">
                <div className="md:w-1/2 h-64 md:h-auto overflow-hidden">
                    <img 
                        src="/images/ip_fixo_bg.png" 
                        alt="Conectividade empresarial" 
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573163231162-8352cf20d44d?auto=format&fit=crop&q=80&w=800'; }}
                    />
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-left">
                    <h3 className="text-2xl font-black text-entre-purple-dark mb-4">
                        <sup className="text-sm mr-1">3</sup>IP Fixo
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        Sua empresa passa a ter um endereço IP exclusivo na Internet, facilitando acessos remotos, integrações com sistemas e aumentando a segurança das operações.
                    </p>
                </div>
            </div>
        </div>
    );
};

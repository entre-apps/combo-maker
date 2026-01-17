
import React from 'react';
import { formatCurrency } from '../utils/formatters';
import type { InternetPlan } from '../types';

interface UpgradeNudgeModalProps {
    plan600: InternetPlan;
    plan800: InternetPlan;
    onAccept: () => void;
    onDecline: () => void;
}

export const UpgradeNudgeModal: React.FC<UpgradeNudgeModalProps> = ({ plan600, plan800, onAccept, onDecline }) => {
    return (
        <div className="fixed inset-0 bg-entre-purple-dark/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-scale relative">
                {/* Header Decorativo */}
                <div className="bg-gradient-to-r from-entre-purple-dark to-entre-purple-mid h-32 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                        </svg>
                    </div>
                    <div className="z-10 text-white text-center px-4">
                        <span className="bg-white/20 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-1 inline-block">Decisão Inteligente</span>
                        <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">APROVEITE A MELHOR OFERTA!</h3>
                    </div>
                </div>

                <div className="p-8 text-center">
                    <p className="text-gray-600 font-medium mb-8">
                        Notamos que você escolheu o plano de <span className="font-bold text-gray-800">600 Mega ({formatCurrency(plan600.price)})</span>.
                    </p>
                    
                    <div className="bg-gray-50 border-2 border-dashed border-entre-purple-mid/30 rounded-2xl p-6 pt-8 mb-8 relative">
                         {/* Tag de oferta */}
                         <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[9px] font-black px-3 py-0.5 rounded-full shadow-md z-10 uppercase tracking-widest whitespace-nowrap">
                            Por apenas R$ 1,00 a mais!
                        </div>
                        
                        <h4 className="text-2xl font-black text-entre-purple-dark mb-2 uppercase tracking-tight">Upgrade para 800 MEGA</h4>
                        <p className="text-sm text-gray-500 leading-relaxed mb-6 px-2">
                            Você ganha <span className="font-bold text-entre-purple-dark">+200 Mega de velocidade de download</span>; e upgrade de tecnologia <span className="font-bold text-entre-purple-dark">Wifi 6 (mais estabilidade)</span>.
                        </p>
                        
                        <div className="flex flex-col items-center">
                            <span className="text-sm text-gray-400">De: <span className="line-through">{formatCurrency(plan600.price)}</span>/mês</span>
                            
                            <div className="flex flex-col items-center mt-1">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Por apenas:</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-entre-purple-dark">{formatCurrency(plan800.fullPrice || 119.90)}</span>
                                    <span className="text-xs font-bold text-gray-400">/mês*</span>
                                </div>
                            </div>

                            <div className="mt-6 w-full bg-entre-purple-light/50 px-4 py-3 rounded-2xl border border-entre-purple-mid/20">
                                <p className="text-xs font-bold text-entre-purple-dark leading-tight">
                                    E ainda garante desconto nos primeiros 3 meses:
                                </p>
                                <p className="text-2xl font-black text-entre-purple-dark mt-1">
                                    {formatCurrency(plan800.price)}<span className="text-sm font-bold">/mês</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button 
                            onClick={onAccept}
                            className="w-full bg-entre-purple-dark hover:bg-entre-purple-mid text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-200 transition-all transform hover:scale-[1.02] active:scale-95 text-lg flex items-center justify-center gap-2"
                        >
                            <span>SIM! QUERO O UPGRADE AGORA!</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </button>
                        
                        <button 
                            onClick={onDecline}
                            className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors py-2 px-4 rounded-lg"
                        >
                            Continuar com 600 Mega (Velocidade menor)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


import React from 'react';

interface RemovalConfirmationModalProps {
    itemName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const RemovalConfirmationModal: React.FC<RemovalConfirmationModalProps> = ({ itemName, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-scale border border-gray-100">
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    
                    <h3 className="text-2xl font-black text-gray-800 mb-3 leading-tight">
                        Você tem certeza?
                    </h3>
                    
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Ao remover o item <span className="font-bold text-entre-purple-dark">"{itemName}"</span>, você perderá as vantagens exclusivas e os descontos de parceiro negociados especialmente para nossos clientes.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={onCancel}
                            className="w-full bg-entre-purple-dark hover:bg-entre-purple-mid text-white font-black py-4 rounded-2xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
                        >
                            MANTER MEUS BENEFÍCIOS
                        </button>
                        
                        <button 
                            onClick={onConfirm}
                            className="text-sm font-bold text-red-400 hover:text-red-600 transition-colors py-2"
                        >
                            Sim, desejo remover e perder as vantagens
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

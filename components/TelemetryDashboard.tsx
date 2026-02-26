import React, { useState, useEffect } from 'react';
import { telemetry, AggregatedStats } from '../utils/telemetry';
import { supabase } from '../lib/supabase';

interface TelemetryDashboardProps {
  onClose: () => void;
}

export const TelemetryDashboard: React.FC<TelemetryDashboardProps> = ({ onClose }) => {
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'Supabase Cloud' | 'Local Fallback'>('Supabase Cloud');

  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) {
        setAuthLoading(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthenticated(true);
      }
      setAuthLoading(false);
    };

    checkSession();

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isAuthenticated) {
      const loadStats = async () => {
        setLoading(true);
        const data = await telemetry.fetchGlobalStats();
        if (data) {
          setStats(data);
        } else {
          setDataSource('Local Fallback');
        }
        setLoading(false);
      };

      loadStats();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setAuthLoading(true);
    setAuthError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setIsAuthenticated(true);
    } catch (err: any) {
      setAuthError(err.message || 'Falha na autenticação');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setStats(null);
    }
  };

  if (authLoading) {
    return (
        <div className="fixed inset-0 z-[200] bg-gray-950/98 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-entre-purple-mid border-t-transparent rounded-full animate-spin"></div>
                <p className="text-entre-purple-mid font-mono animate-pulse">Verificando credenciais...</p>
            </div>
        </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-gray-950/98 backdrop-blur-xl flex items-center justify-center p-4 font-mono">
        <div className="bg-gray-900 border-2 border-entre-purple-mid/40 rounded-[2.5rem] w-full max-w-md p-10 shadow-[0_0_80px_rgba(157,78,221,0.2)] animate-fade-in-scale">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-entre-purple-dark/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-entre-purple-mid/30">
              <svg className="w-8 h-8 text-entre-purple-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Acesso Restrito</h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mt-2">Área de Telemetria Administrativa</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2">E-mail Admin</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-entre-purple-mid outline-none transition-all"
                placeholder="admin@entre.com"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-black mb-2">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-entre-purple-mid outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] p-3 rounded-xl font-bold uppercase text-center">
                {authError}
              </div>
            )}

            <div className="flex gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-[10px] font-black py-4 rounded-xl border border-gray-700 transition-all uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={authLoading}
                className="flex-[2] bg-entre-purple-mid hover:bg-entre-purple-dark text-white text-[10px] font-black py-4 rounded-xl shadow-[0_0_20px_rgba(157,78,221,0.4)] transition-all uppercase tracking-widest disabled:opacity-50"
              >
                {authLoading ? 'Verificando...' : 'Entrar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
        <div className="fixed inset-0 z-[200] bg-gray-950/98 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-entre-purple-mid border-t-transparent rounded-full animate-spin"></div>
                <p className="text-entre-purple-mid font-mono animate-pulse">Processando dados globais...</p>
            </div>
        </div>
    )
  }

  if (!stats) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-gray-950/98 backdrop-blur-xl flex items-center justify-center p-4 lg:p-10 font-mono animate-fade-in-scale">
      <div className="bg-gray-900 border-2 border-entre-purple-mid/40 rounded-[2.5rem] w-full max-w-6xl max-h-full overflow-hidden flex flex-col shadow-[0_0_80px_rgba(157,78,221,0.3)]">
        
        {/* Header Profissional */}
        <div className="p-8 border-b border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-900/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Entre Insight Engine <span className="text-entre-purple-mid text-xs font-bold border border-entre-purple-mid/30 px-2 py-0.5 rounded ml-2">v2.0 - {dataSource}</span></h2>
            </div>
            <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                Amostra: {stats.totalEvents} eventos processados • Atualizado: {stats.lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
              onClick={() => {
                  const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `entre-stats-${new Date().toISOString()}.json`;
                  a.click();
              }}
              className="bg-gray-800 hover:bg-gray-700 text-white text-[10px] font-black py-2.5 px-4 rounded-xl border border-gray-700 transition-all flex items-center gap-2 uppercase tracking-widest"
            >
              Exportar
            </button>
            <button 
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 text-[10px] font-black py-2.5 px-4 rounded-xl border border-gray-700 transition-all flex items-center gap-2 uppercase tracking-widest"
            >
              Sair
            </button>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2.5 rounded-xl border border-gray-700"
              title="Fechar (ESC)"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-10 custom-scrollbar space-y-10">
          
          {/* Métricas de Alto Nível */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Sessões Globais', value: stats.sessions, color: 'text-white', sub: 'Dispositivos Únicos' },
              { label: 'Conversões Reais', value: stats.conversions, color: 'text-green-400', sub: 'Clicks no WhatsApp' },
              { label: 'Taxa de Conv.', value: `${stats.conversionRate.toFixed(1)}%`, color: 'text-entre-purple-mid', sub: 'Eficiência Geral' },
              { label: 'Aceite Upgrade', value: `${stats.upgradeAcceptanceRate.toFixed(1)}%`, color: 'text-entre-orange', sub: 'Taxa de Upsell' },
            ].map((m, i) => (
              <div key={i} className="bg-gray-800/40 p-6 rounded-3xl border border-gray-700/50 shadow-inner group hover:border-entre-purple-mid/30 transition-all">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-black">{m.label}</p>
                <p className={`text-4xl font-black ${m.color} tracking-tighter mb-1`}>{m.value}</p>
                <p className="text-[9px] text-gray-600 font-bold uppercase">{m.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Funil de Drop-off */}
            <div className="bg-gray-800/20 p-8 rounded-[2rem] border border-gray-700/50">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                <div className="p-2 bg-entre-purple-dark/20 rounded-lg"><svg className="w-5 h-5 text-entre-purple-mid" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg></div>
                Fricção Global (Onde os clientes param?)
              </h3>
              <div className="space-y-6">
                {Object.entries(stats.stepDropoffs).map(([step, count]) => {
                  const percentage = (stats.sessions as number) > 0 ? ((count as number) / (stats.sessions as number)) * 100 : 0;
                  return (
                    <div key={step} className="group">
                      <div className="flex justify-between text-[10px] mb-2 uppercase font-black tracking-wider">
                        <span className="text-gray-400 group-hover:text-white transition-colors">{step}</span>
                        <span className="text-entre-purple-mid">{count as number} hits <span className="text-gray-600 ml-1">({percentage.toFixed(0)}%)</span></span>
                      </div>
                      <div className="h-2.5 bg-gray-950 rounded-full overflow-hidden border border-gray-800 shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-entre-purple-dark to-entre-purple-mid transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(157,78,221,0.4)]" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Popularidade de Add-ons */}
            <div className="bg-gray-800/20 p-8 rounded-[2rem] border border-gray-700/50">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                <div className="p-2 bg-entre-orange/20 rounded-lg"><svg className="w-5 h-5 text-entre-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></div>
                Global Heatmap: Apps & Wi-Fi
              </h3>
              <div className="space-y-4">
                {Object.entries(stats.topAddons)
                  .sort((a, b) => (b[1] as number) - (a[1] as number))
                  .slice(0, 6)
                  .map(([name, count], idx) => (
                    <div key={name} className="flex justify-between items-center bg-gray-900/60 p-4 rounded-2xl border border-gray-800/50 group hover:border-entre-orange/30 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-gray-700">{idx + 1}.</span>
                        <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{name}</span>
                      </div>
                      <span className="bg-entre-orange/10 text-entre-orange px-3 py-1 rounded-full text-[10px] font-black border border-entre-orange/20">
                        {count as number} VENDAS
                      </span>
                    </div>
                ))}
                {Object.keys(stats.topAddons).length === 0 && (
                  <div className="h-40 flex flex-col items-center justify-center text-gray-600 gap-2">
                    <svg className="w-10 h-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    <p className="text-[10px] font-black uppercase tracking-widest">Sem dados globais suficientes...</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer com Meta-dados */}
        <div className="p-8 bg-gray-900 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-gray-400 font-bold uppercase">Conectado ao Supabase</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] text-gray-600 font-bold uppercase">Storage</span>
              <span className="text-[10px] text-gray-400 font-black">POSTGRESQL</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
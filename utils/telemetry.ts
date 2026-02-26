import { supabase } from '../lib/supabase';

export type TelemetryEvent = 
  | { type: 'session_start'; payload: { timestamp: number } }
  | { type: 'plan_type_selected'; payload: { planType: string } }
  | { type: 'profile_selected'; payload: { profileId: string; profileName: string } }
  | { type: 'internet_selected'; payload: { planId: string; planName: string } }
  | { type: 'addon_toggle'; payload: { id: string; name: string; action: 'added' | 'removed'; category: string } }
  | { type: 'upgrade_nudge_response'; payload: { accepted: boolean; originalPlanId: string; targetPlanId: string } }
  | { type: 'conversion_initiated'; payload: { totalFull: number; totalPromo: number; itemsCount: number } }
  | { type: 'step_navigation'; payload: { from: string; to: string } };

export interface AggregatedStats {
  totalEvents: number;
  sessions: number;
  conversions: number;
  conversionRate: number;
  upgradeAcceptanceRate: number;
  topAddons: Record<string, number>;
  stepDropoffs: Record<string, number>;
  lastUpdated: Date;
}

class TelemetryService {
  private static instance: TelemetryService;
  // Acesso seguro ao env
  private isDevelopment = ((import.meta as any).env && (import.meta as any).env.DEV) || false;
  private storageKey = 'entre_telemetry_v1';
  private sessionId: string;

  private constructor() {
    this.sessionId = this.getSessionId();
    // Inicia sessão
    if (!sessionStorage.getItem('entre_session_tracked')) {
        this.track({ type: 'session_start', payload: { timestamp: Date.now() } });
        sessionStorage.setItem('entre_session_tracked', 'true');
    }
  }

  public static getInstance(): TelemetryService {
    if (!TelemetryService.instance) {
      TelemetryService.instance = new TelemetryService();
    }
    return TelemetryService.instance;
  }

  private getSessionId(): string {
    let sid = localStorage.getItem('entre_device_id');
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('entre_device_id', sid);
    }
    return sid;
  }

  /**
   * Envia o evento para o Supabase (Fire and Forget)
   * Também salva no localStorage como backup/cache
   */
  public async track(event: TelemetryEvent) {
    const eventWithMeta = { 
      session_id: this.sessionId,
      event_type: event.type,
      payload: event.payload,
      // O timestamp é gerado automaticamente pelo banco, mas podemos mandar se quisermos precisão do cliente
    };

    // 1. Log Local (Backup e Debug)
    const localEvents = this.getStoredEvents();
    localEvents.push({ ...event, timestamp: Date.now(), sessionId: this.sessionId });
    if (localEvents.length > 500) localEvents.shift();
    localStorage.setItem(this.storageKey, JSON.stringify(localEvents));

    if (this.isDevelopment) {
      console.groupCollapsed(`📡 Telemetry: ${event.type}`);
      console.log(event.payload);
      console.groupEnd();
    }

    // 2. Envio para Supabase
    if (supabase) {
      try {
        const { error } = await supabase.from('events').insert(eventWithMeta);
        if (error) console.warn('Telemetry Supabase Error:', error.message);
      } catch (err) {
        console.warn('Telemetry Network Error:', err);
      }
    }
  }

  public getStoredEvents(): any[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  public clearLocal() {
    localStorage.removeItem(this.storageKey);
  }

  /**
   * Busca estatísticas GLOBAIS direto do Supabase via RPC
   * Isso é mais seguro e performático que buscar todos os eventos
   */
  public async fetchGlobalStats(): Promise<AggregatedStats | null> {
    if (!supabase) return this.getLocalStats();

    try {
      // Chamada via RPC (Postgres Function) para agregação no servidor
      const { data, error } = await supabase.rpc('get_telemetry_stats');

      if (error) {
        // Se der erro (ex: permissão ou função não existe), tenta o fallback manual
        console.warn('RPC get_telemetry_stats falhou, tentando busca manual:', error.message);
        
        const { data: rawData, error: fetchError } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(2000);

        if (fetchError || !rawData) throw fetchError;

        return this.processEvents(rawData.map(d => ({
          type: d.event_type,
          payload: d.payload,
          sessionId: d.session_id,
          timestamp: new Date(d.created_at).getTime()
        })));
      }

      // Se o RPC retornou dados, eles já vêm agregados
      return {
        ...data,
        lastUpdated: new Date()
      };

    } catch (err) {
      console.error('Falha ao buscar stats globais:', err);
      return this.getLocalStats(); // Fallback
    }
  }

  private getLocalStats(): AggregatedStats {
    const events = this.getStoredEvents();
    return this.processEvents(events);
  }

  private processEvents(events: any[]): AggregatedStats {
    const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
    const conversions = events.filter(e => e.type === 'conversion_initiated').length;
    
    const upgradeResponses = events.filter(e => e.type === 'upgrade_nudge_response');
    const upgradeAccepts = upgradeResponses.filter(e => e.payload.accepted).length;

    const topAddons: Record<string, number> = {};
    events.filter(e => e.type === 'addon_toggle' && e.payload.action === 'added').forEach(e => {
      const name = e.payload.name;
      topAddons[name] = (topAddons[name] || 0) + 1;
    });

    const stepDropoffs: Record<string, number> = {
      'internet': 0,
      'omni': 0,
      'nobreak': 0,
      'apps': 0,
      'checkout': 0
    };

    events.filter(e => e.type === 'step_navigation').forEach(e => {
        if (e.payload.to in stepDropoffs) {
            stepDropoffs[e.payload.to] = (stepDropoffs[e.payload.to] || 0) + 1;
        }
    });

    return {
      totalEvents: events.length,
      sessions: uniqueSessions,
      conversions,
      conversionRate: uniqueSessions > 0 ? (conversions / uniqueSessions) * 100 : 0,
      upgradeAcceptanceRate: upgradeResponses.length > 0 ? (upgradeAccepts / upgradeResponses.length) * 100 : 0,
      topAddons,
      stepDropoffs,
      lastUpdated: new Date()
    };
  }
}

export const telemetry = TelemetryService.getInstance();
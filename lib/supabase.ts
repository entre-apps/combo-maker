import { createClient } from '@supabase/supabase-js';

// Garante que não quebre se import.meta.env for undefined (alguns ambientes de build/preview)
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

// Verifica se as variáveis existem antes de criar o cliente para evitar erros em runtime se não configurado
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Recupera o contexto automotivo da Knowledge Base no Supabase
 */
export const retrieveAutoContext = async (message: string) => {
  const normalizedMessage = message.toLowerCase();
  
  const { data, error } = await supabase
    .from('auto_knowledge_base')
    .select('*');

  if (error || !data) {
    console.error("Erro RAG Auto:", error);
    return { context: "", isUrgent: false };
  }

  const matches = data.filter((entry: any) => 
    entry.keywords.some((kw: string) => normalizedMessage.includes(kw.toLowerCase()))
  );

  if (matches.length === 0) {
    return { context: "Contexto automotivo genérico. Conduza de forma premium: qual veículo o cliente procura?", isUrgent: false };
  }

  const isUrgent = matches.some((m: any) => m.priority_level === 3);
  const context = matches.map((m: any) => `[TÓPICO: ${m.topic}] ${m.context}`).join("\n");

  return { context, isUrgent };
};

import React, { useState } from 'react';
import { 
  BrainCircuit, Search, FileText, Plus, Zap, Sparkles, Database, Car, Link as LinkIcon 
} from 'lucide-react';
import AutoGraph from './AutoGraph';

const MOCK_NOTES = [
  { id: '1', title: 'Script: Financiamento Rápido', content: '# Roteiro de Atendimento\n\n1. Perguntar modelo de interesse\n2. Verificar score no sistema\n3. Oferecer simulação em até 3 bancos\n4. Usar [[Planilha de Taxas]] atualizada', updated: '5 min', category: 'Vendas' },
  { id: '2', title: 'Análise Polars: Estoque Parado', content: '# Veículos > 60 dias\n\nO motor **Polars** detectou que pickups acima de R$120k estão com baixa rotação. Sugerir destaque na vitrine.', updated: '1h ago', category: 'Analytics' },
  { id: '3', title: 'Protocolo: Troca / Retoma', content: '# Checklist de Avaliação\n\n- [ ] Fotos externas (4 ângulos)\n- [ ] KM do painel\n- [ ] Consulta [[FIPE]] atualizada\n- [ ] Verificar pendências DETRAN', updated: 'Ontem', category: 'Operação' },
];

const SecondBrainAuto: React.FC = () => {
  const [activeNoteId, setActiveNoteId] = useState('1');
  const activeNote = MOCK_NOTES.find(n => n.id === activeNoteId) || MOCK_NOTES[0];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 300px', gap: '24px', minHeight: 'calc(100vh - 120px)', padding: '24px' }}>
      {/* Sidebar Notas */}
      <aside style={{ background: '#0f172a', borderRadius: '24px', padding: '24px', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <BrainCircuit size={24} color="#22c55e" />
          <h2 style={{ fontSize: '16px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase' }}>AUTO BRAIN</h2>
        </div>

        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: '#475569' }} />
          <input 
            type="text"
            placeholder="Buscar scripts..." 
            style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '12px', border: '1px solid #1e293b', background: '#1e293b', color: 'white', outline: 'none', fontSize: '13px' }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {MOCK_NOTES.map(note => (
            <button
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              style={{
                width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: '16px', marginBottom: '8px', cursor: 'pointer', border: 'none', transition: '0.2s',
                background: activeNoteId === note.id ? '#22c55e' : 'transparent',
                color: activeNoteId === note.id ? '#0f172a' : '#94a3b8',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={14} />
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{note.title}</span>
              </div>
              <div style={{ fontSize: '10px', opacity: 0.6, marginLeft: '22px', marginTop: '4px' }}>{note.category}</div>
            </button>
          ))}
        </div>

        <button style={{ marginTop: '16px', width: '100%', padding: '14px', background: '#22c55e', color: '#0f172a', borderRadius: '16px', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Plus size={16} /> NOVA NOTA
        </button>
      </aside>

      {/* Editor */}
      <main style={{ background: 'white', borderRadius: '28px', padding: '40px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span style={{ background: '#f0fdf4', color: '#166534', padding: '6px 14px', borderRadius: '99px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', border: '1px solid #bbf7d0' }}>
              <Database size={10} style={{ display: 'inline', marginRight: '4px' }} />
              Polars Sync
            </span>
            <span style={{ background: '#f1f5f9', color: '#475569', padding: '6px 14px', borderRadius: '99px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Celery Active
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Editado: {activeNote.updated}</span>
        </div>

        <input 
          value={activeNote.title} 
          onChange={() => {}} 
          style={{ fontSize: '28px', fontWeight: 900, border: 'none', outline: 'none', width: '100%', marginBottom: '24px', color: '#0f172a', letterSpacing: '-0.02em' }}
        />

        {/* Logo destaque como background decorativo */}
        <div style={{ position: 'relative', flex: 1, background: '#fafafa', borderRadius: '20px', padding: '28px', overflow: 'hidden' }}>
          <img 
            src="/logo-auto-destaque.png" 
            alt="" 
            style={{ position: 'absolute', right: '-60px', bottom: '-40px', width: '360px', opacity: 0.04, pointerEvents: 'none' }} 
          />
          <pre style={{ fontSize: '14px', lineHeight: '2', color: '#334155', whiteSpace: 'pre-wrap', position: 'relative', zIndex: 1, fontFamily: "'Inter', sans-serif" }}>
            {activeNote.content}
          </pre>
        </div>
      </main>

      {/* Painel de Conexões */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ background: '#0f172a', borderRadius: '24px', padding: '24px', color: 'white', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LinkIcon size={18} color="#22c55e" />
            <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>MAPA DE VENDAS</h3>
          </div>

          <AutoGraph />

          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Zap size={14} color="#eab308" />
              <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Insight RAG</span>
            </div>
            <p style={{ fontSize: '11px', opacity: 0.7, lineHeight: '1.6' }}>
              O RAG detectou alta procura por "financiamento SUV". Sugerimos criar uma campanha WhatsApp focada em Creta e T-Cross.
            </p>
          </div>

          {/* Logo principal como badge */}
          <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '20px', padding: '20px', marginTop: 'auto', textAlign: 'center', border: '1px solid rgba(34,197,94,0.2)' }}>
            <img src="/logo-auto-principal.png" alt="Solara Auto" style={{ width: '100%', borderRadius: '12px', marginBottom: '12px', opacity: 0.9 }} />
            <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: '#22c55e' }}>Solara Auto Intelligence</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default SecondBrainAuto;

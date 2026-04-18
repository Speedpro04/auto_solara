import React, { useState } from 'react';
import { 
  BrainCircuit, Search, FileText, Plus, Zap, Database, Link as LinkIcon, Clock, Share2
} from 'lucide-react';
import AutoGraph from '../../components/admin/AutoGraph';
import { motion } from 'framer-motion';

const MOCK_NOTES = [
  { id: '1', title: 'Script: Financiamento Rápido', content: '# Roteiro de Atendimento\n\n1. Perguntar modelo de interesse\n2. Verificar score no sistema\n3. Oferecer simulação em até 3 bancos\n4. Usar [[Planilha de Taxas]] atualizada', updated: '5 min', category: 'Vendas' },
  { id: '2', title: 'Análise Polars: Estoque Parado', content: '# Veículos > 60 dias\n\nO motor **Polars** detectou que pickups acima de R$120k estão com baixa rotação. Sugerir destaque na vitrine.', updated: '1h ago', category: 'Analytics' },
  { id: '3', title: 'Protocolo: Troca / Retoma', content: '# Checklist de Avaliação\n\n- [ ] Fotos externas (4 ângulos)\n- [ ] KM do painel\n- [ ] Consulta [[FIPE]] atualizada\n- [ ] Verificar pendências DETRAN', updated: 'Ontem', category: 'Operação' },
];

const SecondBrainAuto: React.FC = () => {
  const [activeNoteId, setActiveNoteId] = useState('1');
  const activeNote = MOCK_NOTES.find(n => n.id === activeNoteId) || MOCK_NOTES[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'grid', gridTemplateColumns: '300px 1fr 320px', gap: '32px', minHeight: 'calc(100vh - 160px)', padding: '32px' }}
    >
      {/* Sidebar Notas */}
      <aside style={{ background: '#080808', borderRadius: '32px', padding: '32px', color: 'white', display: 'flex', flexDirection: 'column', border: '1px solid white/5' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <div style={{ padding: '10px', background: 'rgba(29, 209, 161, 0.1)', borderRadius: '12px' }}>
            <BrainCircuit size={24} color="#1dd1a1" />
          </div>
          <h2 style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', fontStyle: 'italic', fontFamily: 'Impact' }}>AUTO BRAIN</h2>
        </div>

        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <Search size={14} style={{ position: 'absolute', left: '16px', top: '14px', color: '#333' }} />
          <input 
            type="text"
            placeholder="Buscar Inteligência..." 
            style={{ width: '100%', padding: '12px 12px 12px 44px', borderRadius: '16px', border: '1px solid #111', background: '#000', color: 'white', outline: 'none', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px' }} className="space-y-2">
          {MOCK_NOTES.map(note => (
            <button
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              style={{
                width: '100%', textAlign: 'left', padding: '16px 20px', borderRadius: '20px', cursor: 'pointer', border: '1px solid transparent', transition: '0.3s',
                background: activeNoteId === note.id ? 'linear-gradient(135deg, #1dd1a1, #10ac84)' : 'transparent',
                color: activeNoteId === note.id ? '#000' : '#444',
                boxShadow: activeNoteId === note.id ? '0 10px 20px -5px rgba(29,209,161,0.2)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={14} />
                <span style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{note.title}</span>
              </div>
              <div style={{ fontSize: '9px', opacity: 0.6, marginLeft: '24px', marginTop: '6px', fontWeight: 700, textTransform: 'uppercase' }}>{note.category}</div>
            </button>
          ))}
        </div>

        <button style={{ width: '100%', padding: '18px', background: '#1dd1a1', color: '#000', borderRadius: '20px', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(29,209,161,0.2)' }}>
          <Plus size={18} /> NEW INSIGHT
        </button>
      </aside>

      {/* Editor */}
      <main style={{ background: '#000', borderRadius: '40px', padding: '48px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'rgba(29, 209, 161, 0.05)', filter: 'blur(100px)', borderRadius: '100%', pointerEvents: 'none' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ background: 'rgba(29, 209, 161, 0.1)', color: '#1dd1a1', padding: '8px 16px', borderRadius: '99px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', border: '1px solid rgba(29, 209, 161, 0.2)' }}>
              <Database size={12} style={{ display: 'inline', marginRight: '6px' }} />
              Polars Engine
            </span>
            <span style={{ background: 'white/5', color: '#444', padding: '8px 16px', borderRadius: '99px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              <Clock size={12} style={{ display: 'inline', marginRight: '6px' }} />
              Sync: {activeNote.updated}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
             <button style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: 'none', cursor: 'pointer', color: '#444' }}><Share2 size={16} /></button>
          </div>
        </div>

        <input 
          value={activeNote.title} 
          onChange={() => {}} 
          style={{ fontSize: '42px', fontWeight: 900, border: 'none', outline: 'none', width: '100%', marginBottom: '32px', color: 'white', letterSpacing: '-0.04em', background: 'transparent', fontFamily: 'Impact', fontStyle: 'italic', textTransform: 'uppercase' }}
        />

        {/* Editor Area with Logo Background */}
        <div style={{ position: 'relative', flex: 1, background: '#050505', borderRadius: '32px', padding: '40px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
          <img 
            src="/logo-auto-destaque.png" 
            alt="" 
            style={{ position: 'absolute', right: '-80px', bottom: '-50px', width: '450px', opacity: 0.03, pointerEvents: 'none', objectFit: 'contain' }} 
          />
          <pre style={{ fontSize: '15px', lineHeight: '2.2', color: '#576574', whiteSpace: 'pre-wrap', position: 'relative', zIndex: 1, fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
            {activeNote.content}
          </pre>
        </div>
      </main>

      {/* Painel de Conexões */}
      <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ background: '#080808', borderRadius: '32px', padding: '32px', color: 'white', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', background: 'rgba(29, 209, 161, 0.1)', borderRadius: '10px' }}>
              <LinkIcon size={18} color="#1dd1a1" />
            </div>
            <h3 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', fontStyle: 'italic', fontFamily: 'Impact' }}>Sales Graph</h3>
          </div>

          <div style={{ background: '#000', borderRadius: '24px', overflow: 'hidden', border: '1px solid white/5' }}>
            <AutoGraph />
          </div>

          <div style={{ background: 'rgba(29, 209, 161, 0.05)', borderRadius: '24px', padding: '24px', border: '1px solid rgba(29, 209, 161, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Zap size={14} color="#1dd1a1" />
              <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1dd1a1' }}>Intel Engine</span>
            </div>
            <p style={{ fontSize: '11px', color: '#444', lineHeight: '1.8', fontWeight: 700 }}>
              O mecanismo RAG identificou tendência de alta em <span style={{ color: '#1dd1a1' }}>híbridos premium</span>. Atualize seus scripts de financiamento.
            </p>
          </div>

          {/* Luxury Badge */}
          <div style={{ background: 'linear-gradient(135deg, #111, #000)', borderRadius: '32px', padding: '32px', marginTop: 'auto', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <img src="/logo-auto-principal.png" alt="Solara Auto" style={{ width: '140px', margin: '0 auto 20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', objectFit: 'contain' }} />
            <div style={{ width: '40px', height: '2px', background: '#1dd1a1', margin: '0 auto 16px' }} />
            <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: 'white' }}>Solara</span>
            <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: '#1dd1a1' }}> Auto</span>
          </div>
        </div>
      </aside>
    </motion.div>
  );
};

export default SecondBrainAuto;

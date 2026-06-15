import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Store, User, Phone, Mail, CheckCircle2, Lock, Eye, EyeOff, ArrowLeft, CreditCard, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../lib/api'

function AdminRegister() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showRegPass, setShowRegPass] = useState(false)
  const [showRegConfirm, setShowRegConfirm] = useState(false)
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    phone: '',
    storeName: '',
    password: '',
    confirmPassword: ''
  })
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (regData.password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.')
      setLoading(false)
      return
    }

    if (regData.password !== regData.confirmPassword) {
      setError('As senhas não coincidem.')
      setLoading(false)
      return
    }

    try {
      // Acesso VIP Gratuito — cria conta direto sem checkout
      await api.post('/auth/register', {
        email: regData.email,
        password: regData.password,
        store_name: regData.storeName,
        phone: regData.phone,
        name: regData.name
      })

      navigate('/cadastro-sucesso')
    } catch (err: any) {
      const detail = err?.response?.data?.detail || 'Erro ao processar. Tente novamente.'
      setError(detail)
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 font-sans relative overflow-hidden py-20">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-[#1dd1a1]/10 blur-[120px] rounded-[4px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-[#1dd1a1]/5 blur-[120px] rounded-[4px]" />
      </div>

      <a 
        href="/parceiro" 
        className="absolute top-8 left-8 z-50 p-4 border border-white/5 bg-white/5 rounded-[4px] text-[#444] hover:text-[#1dd1a1] hover:bg-white/10 hover:border-[#1dd1a1]/20 transition-all group flex items-center gap-3"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">Voltar aos Planos</span>
      </a>

      <div className="relative z-50 w-full max-w-xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-[#0a0a0a] border border-white/10 rounded-[4px] p-8 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1dd1a1]/5 blur-[100px] rounded-[4px] pointer-events-none" />

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-black font-impact italic text-white uppercase tracking-tighter mb-2">Seja um Parceiro</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#555]">Preencha e crie sua conta agora mesmo</p>
          </div>

          {/* Badge de acesso gratuito temporário */}
          <div className="mb-8 flex items-center justify-center gap-3 bg-[#1dd1a1]/10 border border-[#1dd1a1]/20 rounded-[4px] px-5 py-3">
            <CheckCircle2 className="w-5 h-5 text-[#1dd1a1]" />
            <span className="text-sm font-black text-[#1dd1a1] uppercase tracking-widest">15 Dias Grátis — Sem Cartão</span>
          </div>

          <form onSubmit={handleRegister} className="space-y-8 relative z-10">
            {error && (
              <div className="text-[#ff6b6b] border border-[#ff6b6b]/20 bg-[#ff6b6b]/5 px-4 py-3 rounded-[4px] text-xs font-bold uppercase tracking-wider text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#555] ml-1">
                  <User className="w-3 h-3 text-[#1dd1a1]" /> Nome Completo
                </label>
                <input
                  required
                  type="text"
                  value={regData.name}
                  onChange={(e) => setRegData({...regData, name: e.target.value})}
                  className="w-full bg-black/60 text-white px-5 py-4 rounded-[4px] border border-white/5 focus:border-[#1dd1a1]/50 focus:bg-black outline-none transition-all placeholder:text-[#222] font-semibold text-sm"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#555] ml-1">
                  <Mail className="w-3 h-3 text-[#1dd1a1]" /> E-mail Profissional
                </label>
                <input
                  required
                  type="email"
                  value={regData.email}
                  onChange={(e) => setRegData({...regData, email: e.target.value})}
                  className="w-full bg-black/60 text-white px-5 py-4 rounded-[4px] border border-white/5 focus:border-[#1dd1a1]/50 focus:bg-black outline-none transition-all placeholder:text-[#222] font-semibold text-sm"
                  placeholder="joao@loja.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#555] ml-1">
                  <Store className="w-3 h-3 text-[#1dd1a1]" /> Nome da Loja
                </label>
                <input
                  required
                  type="text"
                  value={regData.storeName}
                  onChange={(e) => setRegData({...regData, storeName: e.target.value})}
                  className="w-full bg-black/60 text-white px-5 py-4 rounded-[4px] border border-white/5 focus:border-[#1dd1a1]/50 focus:bg-black outline-none transition-all placeholder:text-[#222] font-semibold text-sm"
                  placeholder="Ex: Luxury Motors"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#555] ml-1">
                  <Phone className="w-3 h-3 text-[#1dd1a1]" /> WhatsApp
                </label>
                <input
                  required
                  type="text"
                  value={regData.phone}
                  onChange={(e) => setRegData({...regData, phone: e.target.value})}
                  className="w-full bg-black/60 text-white px-5 py-4 rounded-[4px] border border-white/5 focus:border-[#1dd1a1]/50 focus:bg-black outline-none transition-all placeholder:text-[#222] font-semibold text-sm"
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#555] ml-1">
                  <Lock className="w-3 h-3 text-[#1dd1a1]" /> Senha
                </label>
                <div className="relative">
                  <input
                    required
                    type={showRegPass ? 'text' : 'password'}
                    value={regData.password}
                    onChange={(e) => setRegData({...regData, password: e.target.value})}
                    className="w-full bg-black/60 text-white px-5 py-4 pr-12 rounded-[4px] border border-white/5 focus:border-[#1dd1a1]/50 focus:bg-black outline-none transition-all placeholder:text-[#222] font-semibold text-sm tracking-widest"
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPass(!showRegPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#1dd1a1] transition-colors"
                  >
                    {showRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#555] ml-1">
                  <Lock className="w-3 h-3 text-[#1dd1a1]" /> Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    required
                    type={showRegConfirm ? 'text' : 'password'}
                    value={regData.confirmPassword}
                    onChange={(e) => setRegData({...regData, confirmPassword: e.target.value})}
                    className="w-full bg-black/60 text-white px-5 py-4 pr-12 rounded-[4px] border border-white/5 focus:border-[#1dd1a1]/50 focus:bg-black outline-none transition-all placeholder:text-[#222] font-semibold text-sm tracking-widest"
                    placeholder="••••••••"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirm(!showRegConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#1dd1a1] transition-colors"
                  >
                    {showRegConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 bg-[#1dd1a1] text-black px-6 py-6 rounded-[4px] hover:bg-white hover:text-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_40px_rgba(29,209,161,0.3)] disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-[4px] animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Criar Minha Conta Grátis</span>
                </>
              )}
            </button>

            <p className="text-center text-[9px] text-[#444] uppercase tracking-widest font-bold">
              Ao criar a conta você terá acesso total ao sistema de gestão premium.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminRegister

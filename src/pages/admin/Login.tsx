import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate('/admin')
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 font-sans relative overflow-hidden">
      {/* Back Button and decorative gradients */}
      <a 
        href="/" 
        className="absolute top-8 left-8 z-50 p-4 border border-white/5 bg-white/5 rounded-2xl text-[#444] hover:text-[#1dd1a1] hover:bg-white/10 hover:border-[#1dd1a1]/20 transition-all group flex items-center gap-3"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">Sair do Painel</span>
      </a>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#1dd1a1]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1dd1a1]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#111111]/80 backdrop-blur-3xl rounded-[30px] p-10 border border-white/5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#1dd1a1]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img 
                  src="/logo-auto-principal.png" 
                  alt="Solara Auto" 
                  className="w-[156px] h-[124px] object-contain rounded-2xl relative z-10 border border-white/10 shadow-2xl"
                />
              </div>
            </div>
            <h1 className="text-xl font-black text-white tracking-tighter mb-2 uppercase font-impact italic">
              SOLARA <span className="text-[#1dd1a1]">AUTO</span>
            </h1>
            <p className="text-[#737373] text-[10px] font-black uppercase tracking-[0.3em]">Gestão de Estoque Premium</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-[#ff6b6b] border border-[#ff6b6b]/20 bg-[#ff6b6b]/5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#555] ml-1">
                E-mail de Acesso
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 text-white px-5 py-4 rounded-xl border border-white/5 focus:border-[#1dd1a1]/50 focus:bg-black outline-none transition-all placeholder:text-[#333] font-medium"
                placeholder="seu@acesso.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#555] ml-1">
                Chave de Segurança
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 text-white px-5 py-4 rounded-xl border border-white/5 focus:border-[#1dd1a1]/50 focus:bg-black outline-none transition-all placeholder:text-[#333] font-medium tracking-widest"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#1dd1a1] text-black px-6 py-5 rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-black uppercase text-xs tracking-[0.2em] shadow-[0_10px_20px_-5px_rgba(29,209,161,0.3)] disabled:opacity-50 mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Entrar no Sistema</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between px-2">
              <a href="#" className="text-[9px] font-black uppercase tracking-widest text-[#444] hover:text-[#1dd1a1] transition-colors">
                Esqueci minha senha
              </a>
              <a href="#" className="text-[9px] font-black uppercase tracking-widest text-[#1dd1a1] hover:text-white transition-colors">
                Criar conta parceira
              </a>
            </div>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#444] hover:text-[#1dd1a1] transition-colors group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Voltar para a vitrine pública
            </a>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[9px] font-bold text-[#222] uppercase tracking-[0.4em]">
          Powered by Axoshub Technology — Luxury Division
        </p>
      </div>
    </div>
  )
}

export default AdminLogin

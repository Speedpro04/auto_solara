import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, CheckCircle2, ShieldCheck, Zap, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

function Checkout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Simulando dados que viriam do registro ou estado global
  const planData = {
    name: 'Plano Parceiro',
    price: '89,00',
    trialDays: 15,
    description: 'Vitrine Premium Compartilhada',
    features: [
      'Cadastro Ilimitado de Veículos',
      'Acesso ao Módulo Racer Redes (Vídeos IA)',
      'Integração com Second Brain (IA)',
      'Suporte Prioritário',
      '15 dias grátis para testar'
    ]
  }

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    // Fluxo de assinatura para loja JÁ logada (conversão pós-trial).
    // Usa o token de sessão — não precisa reenviar senha/dados de cadastro.
    if (!localStorage.getItem('auth_token')) {
      setError('Você precisa estar logado para assinar. Redirecionando para o login...')
      setTimeout(() => navigate('/login'), 2500)
      setLoading(false)
      return
    }

    try {
      const response = await api.post('/payments/subscribe')

      if (response.data.payment_url) {
        window.location.href = response.data.payment_url
      } else {
        throw new Error('Não foi possível gerar o link de pagamento.')
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError('Sessão expirada. Faça login novamente para assinar.')
        setTimeout(() => navigate('/login'), 2500)
      } else {
        setError(err?.response?.data?.detail || 'Erro ao processar a assinatura. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white py-20 px-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1dd1a1]/10 blur-[120px] rounded-[4px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#1dd1a1]/5 blur-[120px] rounded-[4px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-[#444] hover:text-[#1dd1a1] transition-colors text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Plan Summary */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-4xl font-black font-impact italic uppercase tracking-tighter mb-2">
                Checkout <span className="text-[#1dd1a1]">Seguro</span>
              </h1>
              <p className="text-[#8395a7] font-medium">Cadastre seu cartão e ganhe <span className="text-[#1dd1a1] font-bold">15 dias grátis</span> para testar o sistema completo.</p>
            </div>

            <div className="bg-[#111111] border border-white/5 rounded-[4px] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-20 h-20 text-[#1dd1a1]" />
              </div>
              
              <h2 className="text-xl font-bold mb-1">{planData.name}</h2>
              <p className="text-xs font-black uppercase tracking-widest text-[#576574] mb-6">{planData.description}</p>
              
              <div className="mb-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-[#1dd1a1]/10 border border-[#1dd1a1]/20 mb-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#1dd1a1]">🎉 15 dias grátis</span>
                </div>
              </div>
              <div className="flex items-end gap-2 mb-8">
                <span className="text-4xl font-black font-impact text-[#1dd1a1]">R$ {planData.price}</span>
                <span className="text-[#576574] text-xs font-bold uppercase tracking-widest pb-1">/mês após o trial</span>
              </div>

              <ul className="space-y-4">
                {planData.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#8395a7]">
                    <CheckCircle2 className="w-4 h-4 text-[#1dd1a1]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-[4px] bg-white/5 border border-white/5">
              <ShieldCheck className="w-8 h-8 text-[#1dd1a1]" />
              <div className="text-[10px] text-[#576574] font-bold uppercase tracking-widest leading-relaxed">
                Pagamento processado via <span className="text-white">Stripe</span>. 
                Ambiente 100% criptografado e seguro.
              </div>
            </div>
          </motion.div>

          {/* Payment Action */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <div className="bg-gradient-to-br from-[#1dd1a1]/10 to-transparent border border-[#1dd1a1]/20 rounded-[4px] p-10 text-center">
              <div className="w-20 h-20 bg-[#1dd1a1] text-black rounded-[4px] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(29,209,161,0.3)]">
                <CreditCard className="w-10 h-10 text-black" />
              </div>
              
              <h3 className="text-2xl font-black font-impact italic uppercase mb-4">Quase lá!</h3>
              <p className="text-sm text-[#8395a7] mb-4 leading-relaxed">
                Cadastre seu cartão de crédito para iniciar seus <span className="text-[#1dd1a1] font-bold">15 dias grátis</span>. Você será redirecionado para a página segura do Stripe.
              </p>
              <p className="text-xs text-[#576574] mb-10 leading-relaxed">
                Nenhuma cobrança será feita durante o período de teste. Após 15 dias, a assinatura de <span className="text-white font-bold">R$ 89,00/mês</span> será ativada automaticamente.
              </p>

              {error && (
                <div className="mb-6 p-4 rounded-[4px] bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                  {error}
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-[#1dd1a1] text-black px-6 py-6 rounded-[4px] hover:bg-white hover:text-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_40px_rgba(29,209,161,0.3)] disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Começar 15 Dias Grátis</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="mt-4 text-xs text-[#576574] leading-relaxed">
                Seu cartão será cobrado de forma segura apenas após o término dos 15 dias de teste gratuito. Não haverá cobrança durante o período de teste.
              </p>
              
              <p className="mt-6 text-[9px] text-[#444] font-black uppercase tracking-[0.3em]">
                Sem fidelidade. Cancele a qualquer momento, mesmo durante o trial.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

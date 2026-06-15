import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminHeader from '../components/admin/AdminHeader'
import { useAuth } from '../hooks/useAuth'
import api from '../lib/api'
import { AlertCircle, Clock, CreditCard, X } from 'lucide-react'

function AdminLayout() {
  const { user, store, loading, refreshStore } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [dismissedBanner, setDismissedBanner] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  // Ao voltar do Stripe (sucesso na assinatura), recarrega a loja para refletir
  // o novo plano e liberar o painel sem precisar relogar.
  useEffect(() => {
    if (new URLSearchParams(location.search).get('assinatura') === 'sucesso') {
      refreshStore().finally(() => navigate('/admin', { replace: true }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  // Cria o checkout de assinatura para a loja JÁ logada e redireciona ao Stripe.
  const handleSubscribe = async () => {
    setSubscribing(true)
    try {
      const { data } = await api.post('/payments/subscribe')
      if (data.payment_url) {
        window.location.href = data.payment_url
      } else {
        setSubscribing(false)
      }
    } catch {
      setSubscribing(false)
    }
  }

  const trialInfo = useMemo(() => {
    if (!store?.trial_ends_at) return null
    
    const trialEnd = new Date(store.trial_ends_at)
    const now = new Date()
    const diffMs = trialEnd.getTime() - now.getTime()
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
    const expired = daysLeft <= 0

    return { daysLeft, expired, trialEnd }
  }, [store])

  // Check if trial expired and no active subscription
  const isBlocked = trialInfo?.expired && store?.plan === 'basic'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Trial expirado → bloqueia o painel e redireciona para checkout
  if (isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="w-20 h-20 bg-red-500/20 rounded-[4px] flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          
          <div>
            <h1 className="text-3xl font-black font-impact italic uppercase tracking-tighter text-white mb-3">
              Período de Teste <span className="text-red-400">Expirado</span>
            </h1>
            <p className="text-[#8395a7] text-sm leading-relaxed">
              Seus 15 dias gratuitos terminaram. Para continuar usando o Auto Racer 
              e manter sua loja ativa, assine o Plano Parceiro por apenas <strong className="text-[#1dd1a1]">R$ 89,00/mês</strong>.
            </p>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={subscribing}
            className="w-full flex items-center justify-center gap-3 bg-[#1dd1a1] text-black px-6 py-5 rounded-[4px] hover:bg-white hover:text-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_40px_rgba(29,209,161,0.3)] disabled:opacity-50"
          >
            <CreditCard className="w-5 h-5" />
            <span>{subscribing ? 'Redirecionando...' : 'Assinar Agora — R$ 89,00/mês'}</span>
          </button>

          <p className="text-[9px] text-[#444] font-black uppercase tracking-[0.3em]">
            Sem fidelidade. Cancele quando quiser.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[#d2dae2]">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Trial Banner — mostra quando faltam 5 dias ou menos */}
        {trialInfo && !trialInfo.expired && trialInfo.daysLeft <= 5 && !dismissedBanner && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 flex items-center justify-between gap-4 rounded-[4px] border border-amber-500/30 bg-amber-500/10 px-5 py-3">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <p className="text-sm text-amber-200 font-bold">
                {trialInfo.daysLeft === 1
                  ? 'Último dia de teste gratuito!'
                  : `Restam ${trialInfo.daysLeft} dias de teste gratuito.`}
                {' '}
                <button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="underline text-[#1dd1a1] hover:text-white transition-colors disabled:opacity-50"
                >
                  {subscribing ? 'Redirecionando...' : 'Assinar agora'}
                </button>
                <p className="text-xs text-[#8395a7] mt-2">Seu cartão será cobrado somente após o término dos 15 dias de teste gratuito. Você pode cancelar a qualquer momento sem cobranças.</p>
              </p>
            </div>
            <button onClick={() => setDismissedBanner(true)} className="text-amber-400/50 hover:text-amber-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-[1140px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

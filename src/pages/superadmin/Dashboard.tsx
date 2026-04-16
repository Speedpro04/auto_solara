import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, Users, Target, Activity, Power, ShieldCheck, DollarSign, Database } from 'lucide-react'
import api from '../../lib/api'
import { useNavigate } from 'react-router-dom'

function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Validação mockada de superadmin (pode ser aprimorada checando rules no JWT)
    const token = localStorage.getItem('auth_token')
    if (!token) navigate('/login')

    const fetchSuperData = async () => {
      try {
        const [statsRes, storesRes] = await Promise.all([
          api.get('/api/superadmin/stats'),
          api.get('/api/superadmin/stores')
        ])
        setStats(statsRes.data)
        setStores(storesRes.data)
      } catch (error) {
        console.error('Erro ao carregar dados do Super Admin:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuperData()
  }, [])

  const toggleStoreStatus = async (storeId: string, currentStatus: boolean) => {
    if (!confirm(`Deseja realmente ${currentStatus ? 'desativar' : 'ativar'} esta base logista?`)) return

    try {
      await api.patch(`/api/superadmin/stores/${storeId}/status`, { active: !currentStatus })
      // Atualiza a lista localmente
      setStores(prev => prev.map(store => store.id === storeId ? { ...store, active: !currentStatus } : store))
    } catch (error) {
      console.error('Erro ao alternar status do lojista:', error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">CARREGANDO CENTRAL DE INTELIGÊNCIA...</div>
  }

  return (
    <div className="bg-[#050505] min-h-screen font-sans">
      {/* Super Admin Toolbar */}
      <div className="border-b border-white/5 bg-[#111]">
        <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#1dd1a1] rounded-xl flex items-center justify-center">
                 <ShieldCheck className="w-6 h-6 text-black" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest font-impact italic">SUPER ADMIN</h2>
                <p className="text-[9px] text-[#1dd1a1] font-bold uppercase tracking-[0.3em]">Master Control Panel</p>
              </div>
           </div>
           
           <button 
             onClick={() => { localStorage.clear(); navigate('/login') }}
             className="px-6 py-2.5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#555] hover:text-[#1dd1a1] hover:border-[#1dd1a1]/30 transition-all"
           >
             Logoff Global
           </button>
        </div>
      </div>

      <motion.div 
        initial="hidden" animate="visible" variants={containerVariants}
        className="max-w-[1400px] mx-auto px-8 py-12 space-y-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-[#111] p-8 rounded-[30px] border border-white/5 relative overflow-hidden group">
              <Building2 className="w-8 h-8 text-[#1dd1a1] mb-6" />
              <p className="text-[10px] text-[#555] font-black uppercase tracking-[0.3em] mb-2">Lojas (Inquilinos)</p>
              <h3 className="text-xl font-black text-white tracking-tighter">{stats?.total_stores || 0}</h3>
           </div>
           
           <div className="bg-[#111] p-8 rounded-[30px] border border-white/5 relative overflow-hidden group">
              <Car className="w-8 h-8 text-white mb-6" />
              <p className="text-[10px] text-[#555] font-black uppercase tracking-[0.3em] mb-2">Total de Veículos na Rede</p>
              <h3 className="text-xl font-black text-white tracking-tighter">{stats?.total_vehicles || 0}</h3>
           </div>
           
           <div className="bg-[#111] p-8 rounded-[30px] border border-white/5 relative overflow-hidden group">
              <Users className="w-8 h-8 text-white mb-6" />
              <p className="text-[10px] text-[#555] font-black uppercase tracking-[0.3em] mb-2">Leads Capturados (Rede)</p>
              <h3 className="text-xl font-black text-white tracking-tighter">{stats?.total_leads || 0}</h3>
           </div>

           <div className="bg-gradient-to-br from-[#1dd1a1]/20 to-[#111] p-8 rounded-[30px] border border-[#1dd1a1]/30 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#1dd1a1]/20 blur-3xl rounded-full" />
              <DollarSign className="w-8 h-8 text-[#1dd1a1] mb-6 relative z-10" />
              <p className="text-[10px] text-[#1dd1a1] font-black uppercase tracking-[0.3em] mb-2 relative z-10">MRR Estimado</p>
              <h3 className="text-xl font-black text-[#1dd1a1] tracking-tighter relative z-10">
                 {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.mrr_estimated || 0)}
              </h3>
           </div>
        </div>

        <div>
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter font-impact italic">Clientes SaaS (Lojistas)</h2>
              <button className="px-6 py-3 bg-white/5 text-[#1dd1a1] border border-[#1dd1a1]/20 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#1dd1a1] hover:text-black transition-all">
                + Novo Lojista
              </button>
           </div>
           
           <div className="bg-[#111] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-white/5 bg-[#1a1a1a]">
                       <th className="px-8 py-6 text-[10px] font-black text-[#555] uppercase tracking-widest">Loja / Inquilino</th>
                       <th className="px-8 py-6 text-[10px] font-black text-[#555] uppercase tracking-widest">Subdomínio (Tenant)</th>
                       <th className="px-8 py-6 text-[10px] font-black text-[#555] uppercase tracking-widest text-center">Cadastro</th>
                       <th className="px-8 py-6 text-[10px] font-black text-[#555] uppercase tracking-widest text-center">Status Acesso</th>
                       <th className="px-8 py-6 text-[10px] font-black text-[#555] uppercase tracking-widest text-right">Ação</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {stores.map((store) => (
                       <tr key={store.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center">
                                   <Building2 className="w-5 h-5 text-[#333]" />
                                </div>
                                <div>
                                   <p className="text-white font-bold text-lg">{store.name}</p>
                                   <p className="text-[#555] text-xs font-medium">{store.phone || 'Sem contato'}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-[#1dd1a1] font-bold text-sm">
                             {store.slug}.solaraauto.com.br
                          </td>
                          <td className="px-8 py-6 text-center">
                             <div className="inline-flex items-center justify-center gap-4">
                                <div className="text-center"><span className="block text-white font-bold">{store.vehicles[0]?.count || 0}</span><span className="text-[9px] uppercase text-[#555]">Carros</span></div>
                                <div className="w-1 h-1 rounded-full bg-[#333]" />
                                <div className="text-center"><span className="block text-white font-bold">{store.leads[0]?.count || 0}</span><span className="text-[9px] uppercase text-[#555]">Leads</span></div>
                             </div>
                          </td>
                          <td className="px-8 py-6 text-center">
                             {store.active ? (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-black uppercase tracking-widest">
                                   <Activity className="w-3 h-3" /> ATIVO
                                </span>
                             ) : (
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest">
                                   <Power className="w-3 h-3" /> BLOQUEADO
                                </span>
                             )}
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button
                               onClick={() => toggleStoreStatus(store.id, store.active)}
                               className={`px-4 py-2 border rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                 store.active 
                                 ? 'border-red-500/30 text-red-500 hover:bg-red-500/10' 
                                 : 'border-[#1dd1a1]/30 text-[#1dd1a1] hover:bg-[#1dd1a1]/10'
                               }`}
                             >
                               {store.active ? 'Bloquear Acesso' : 'Reativar'}
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
              {stores.length === 0 && (
                <div className="p-16 text-center">
                   <Database className="w-12 h-12 text-[#222] mx-auto mb-4" />
                   <h3 className="text-white text-xl font-bold">Nenhum cliente cadastrado</h3>
                   <p className="text-[#555] text-sm mt-2">Comece a cadastrar lojas para formar o seu império SaaS.</p>
                </div>
              )}
           </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SuperAdminDashboard

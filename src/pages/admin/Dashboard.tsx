import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Users, TrendingUp, DollarSign, Plus, ArrowUpRight, Clock, BrainCircuit, Activity } from 'lucide-react'
import { motion } from 'framer-motion'
import api from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'

function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [recentVehicles, setRecentVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { store } = useAuth()

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!store?.id) return;
      
      try {
        const [statsRes, vehiclesRes] = await Promise.all([
          api.get(`/api/stores/${store.id}/dashboard`),
          api.get(`/api/stores/${store.id}/vehicles`),
        ])
        setStats(statsRes.data)
        setRecentVehicles(vehiclesRes.data.slice(0, 5))
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [store])

  const statCards = [
    { label: 'Veículos Ativos', value: stats?.total_vehicles || 0, icon: Car, color: '#1dd1a1', trend: '+4% este mês' },
    { label: 'Leads (Mês)', value: stats?.total_leads || 0, icon: Users, color: '#1dd1a1', trend: '+12% este mês' },
    { label: 'Valor em Estoque', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.total_portfolio_value || 0), icon: DollarSign, color: '#FFFFFF', trend: 'Auditado' },
    { label: 'Ticket Médio', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.average_price || 0), icon: TrendingUp, color: '#1dd1a1', trend: 'Acima da média' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl font-black font-impact text-white tracking-tight uppercase italic leading-none">
            Visão <span className="text-[#1dd1a1]">Geral</span>
          </h1>
          <p className="text-[#576574] text-[10px] mt-4 font-black uppercase tracking-[0.5em] flex items-center gap-3">
             <Activity className="w-3 h-3 text-[#1dd1a1] animate-pulse" />
             Ecossistema Solara Auto Intelligence v4.0
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/admin/second-brain"
            className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 font-black uppercase tracking-widest text-[10px]"
          >
            <BrainCircuit className="w-4 h-4 text-[#1dd1a1]" />
            Brain Explorer
          </Link>
          <Link
            to="/admin/veiculos/novo"
            className="flex items-center gap-2 bg-[#1dd1a1] text-black px-8 py-4 rounded-2xl hover:bg-white hover:scale-105 active:scale-95 transition-all duration-300 font-black uppercase tracking-widest text-[10px] shadow-[0_10px_30px_rgba(29,209,161,0.2)]"
          >
            <Plus className="w-5 h-5" />
            Inserir Máquina
          </Link>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            className="bg-[#111] p-8 rounded-[35px] border border-white/5 shadow-2xl relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1dd1a1]/5 -mr-16 -mt-16 rounded-full blur-3xl group-hover:bg-[#1dd1a1]/15 transition-all duration-500" />
            <div className="flex items-center justify-between mb-8">
              <div className="p-4 bg-black rounded-2xl border border-white/10 group-hover:border-[#1dd1a1]/50 transition-all duration-500">
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-[#1dd1a1] bg-[#1dd1a1]/10 px-3 py-1.5 rounded-full">
                {stat.trend}
              </div>
            </div>
            <span className="block text-[10px] text-[#576574] font-black uppercase tracking-[0.3em] mb-2">{stat.label}</span>
            <span className="block text-xl font-black text-white tracking-tighter">{stat.value}</span>
            <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: '65%' }}
                 transition={{ delay: 1, duration: 1.5 }}
                 className="h-full bg-gradient-to-r from-[#1dd1a1] to-[#10ac84]" 
               />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Mini-List */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-2 bg-[#111] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl"
        >
          <div className="p-10 border-b border-white/5 flex items-center justify-between bg-black/40">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4 font-impact italic">
                 <Clock className="w-6 h-6 text-[#1dd1a1]" /> Últimas Inserções
              </h2>
              <p className="text-[9px] font-black text-[#444] uppercase tracking-[0.4em] mt-2">Update sincronizado em tempo real</p>
            </div>
            <Link to="/admin/veiculos" className="px-5 py-2.5 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest text-[#576574] hover:text-[#1dd1a1] hover:bg-white/10 transition-all">Ver todos</Link>
          </div>
          <div className="p-4 space-y-2">
            {recentVehicles.length === 0 ? (
              <div className="p-20 text-center text-[#333] font-black uppercase tracking-[0.3em] text-[10px]">Aguardando dados do motor...</div>
            ) : (
              recentVehicles.map((vehicle) => (
                <div key={vehicle.id} className="p-6 rounded-[25px] flex items-center justify-between hover:bg-white/[0.03] transition-all group border border-transparent hover:border-white/5">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-black rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center p-1 group-hover:border-[#1dd1a1]/30 transition-all">
                      {vehicle.media?.[0]?.url ? (
                        <img src={vehicle.media[0].url} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Car className="w-8 h-8 text-[#1a1a1a]" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#1dd1a1] transition-colors uppercase tracking-tight font-impact">{vehicle.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] font-black uppercase text-[#576574] tracking-widest">{vehicle.brand}</span>
                        <div className="w-1 h-1 rounded-full bg-[#333]" />
                        <span className="text-[10px] font-black uppercase text-[#576574] tracking-widest">{vehicle.year}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-xl font-black text-white tracking-tighter group-hover:text-[#1dd1a1] transition-colors">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vehicle.price)}
                    </span>
                    <span className="inline-block mt-1 px-3 py-1 rounded-full bg-white/5 text-[9px] font-black uppercase text-[#576574] tracking-widest border border-white/5">
                      {vehicle.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Intelligence Card */}
        <motion.div 
          variants={itemVariants}
          className="space-y-6"
        >
          <div className="bg-[#1dd1a1] rounded-[40px] p-10 flex flex-col justify-between text-black shadow-[0_30px_60px_-15px_rgba(29,209,161,0.3)] relative overflow-hidden h-[400px]">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 blur-3xl rounded-full" />
             <div className="relative z-10">
               <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-10 shadow-xl">
                 <Activity className="w-6 h-6 text-[#1dd1a1]" />
               </div>
               <h2 className="text-xl font-black uppercase tracking-tighter leading-[0.9] mb-6 font-impact italic">POLARS <br />ENGINE <br />ACTIVE</h2>
               <p className="font-bold text-xs leading-relaxed opacity-80 uppercase tracking-tight">O motor de processamento está analisando 452 eventos de tráfego. Conversão projetada em alta.</p>
             </div>
             <button className="relative z-10 w-full py-6 bg-black text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.4em] text-center hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl">
                Relatório Full
             </button>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 group hover:border-[#1dd1a1]/30 transition-all">
             <div className="flex items-center gap-4 mb-6">
                <BrainCircuit className="w-8 h-8 text-[#1dd1a1]" />
                <h3 className="text-lg font-black text-white uppercase tracking-tight font-impact italic italic">Brain Sync</h3>
             </div>
             <p className="text-[#576574] text-xs font-bold leading-relaxed uppercase">Sua base de conhecimento RAG foi atualizada com novos termos de financiamento híbrido.</p>
             <div className="mt-8 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#1dd1a1] animate-ping" />
                <span className="text-[9px] font-black text-[#1dd1a1] uppercase tracking-[0.2em]">Sincronizado</span>
             </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AdminDashboard

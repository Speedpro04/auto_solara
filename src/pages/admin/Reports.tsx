import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { 
  TrendingUp, Users, Eye, Target, Calendar, Download, 
  ChevronDown, Flame 
} from 'lucide-react'

// Mock Data para o Dashboard
const trafficData = [
  { day: '01', visitas: 120, leads: 12, cadastros: 4 },
  { day: '05', visitas: 250, leads: 25, cadastros: 8 },
  { day: '10', visitas: 380, leads: 40, cadastros: 15 },
  { day: '15', visitas: 310, leads: 35, cadastros: 12 },
  { day: '20', visitas: 490, leads: 60, cadastros: 22 },
  { day: '25', visitas: 620, leads: 85, cadastros: 30 },
  { day: '30', visitas: 850, leads: 120, cadastros: 45 },
]

const vehicleTypeData = [
  { name: 'SUV Luxo', leads: 45 },
  { name: 'Esportivos', leads: 30 },
  { name: 'Sedans', leads: 20 },
  { name: 'Motos Alta CC', leads: 15 },
]

const topVehicles = [
  { id: 1, name: 'Porsche 911 GT3 RS', visits: 1245, leads: 42, conversion: '3.3%' },
  { id: 2, name: 'BMW M3 Competition', visits: 980, leads: 35, conversion: '3.5%' },
  { id: 3, name: 'Land Rover Defender', visits: 850, leads: 28, conversion: '3.2%' },
  { id: 4, name: 'Ducati Panigale V4', visits: 620, leads: 15, conversion: '2.4%' },
]

export default function AdminReports() {
  const [timeRange, setTimeRange] = useState('30D')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  // Custom Tooltip para o Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1e20] border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-white font-bold mb-2">Dia {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-semibold flex justify-between gap-4">
              <span className="uppercase tracking-widest text-[10px]">{entry.name}:</span>
              <span>{entry.value}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 pb-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-xl font-black font-impact text-black tracking-tight uppercase italic leading-none">
            Intelligence <span className="text-[#1dd1a1]">Analytics</span>
          </h1>
          <p className="text-[#576574] text-[10px] mt-4 font-black uppercase tracking-[0.5em] flex items-center gap-3">
             <Target className="w-3 h-3 text-[#ff9f43]" />
             Performance do Lojista
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-[#2d3436] rounded-xl p-1 border border-white/5">
            {['7D', '15D', '30D', '90D'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  timeRange === range 
                    ? 'bg-[#1dd1a1] text-black shadow-lg shadow-[#1dd1a1]/20' 
                    : 'text-[#a0a0a0] hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-[#2d3436] text-white px-6 py-3 rounded-xl border border-white/5 hover:bg-[#3d4547] transition-all font-black uppercase tracking-widest text-[10px]">
            <Download className="w-4 h-4 text-[#ff9f43]" />
            Exportar XLS
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Visitas Card */}
        <motion.div variants={itemVariants} className="bg-[#2d3436] p-8 rounded-[30px] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00d2d3]/5 -mr-16 -mt-16 rounded-full blur-2xl transition-all group-hover:bg-[#00d2d3]/20" />
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
              <Eye className="w-5 h-5 text-[#00d2d3]" />
            </div>
            <span className="text-[10px] font-black text-[#00d2d3] bg-[#00d2d3]/10 px-3 py-1 rounded-full uppercase tracking-widest">+24%</span>
          </div>
          <p className="text-[10px] text-[#8395a7] font-black uppercase tracking-[0.2em] mb-1">Total de Visitas</p>
          <h3 className="text-3xl font-black text-white">3,020</h3>
        </motion.div>

        {/* Leads Card */}
        <motion.div variants={itemVariants} className="bg-[#2d3436] p-8 rounded-[30px] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#1dd1a1]/5 -mr-16 -mt-16 rounded-full blur-2xl transition-all group-hover:bg-[#1dd1a1]/20" />
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
              <Flame className="w-5 h-5 text-[#1dd1a1]" />
            </div>
            <span className="text-[10px] font-black text-[#1dd1a1] bg-[#1dd1a1]/10 px-3 py-1 rounded-full uppercase tracking-widest">+12%</span>
          </div>
          <p className="text-[10px] text-[#8395a7] font-black uppercase tracking-[0.2em] mb-1">Leads Gerados (WhatsApp)</p>
          <h3 className="text-3xl font-black text-white">377</h3>
        </motion.div>

        {/* Cadastros Card */}
        <motion.div variants={itemVariants} className="bg-[#2d3436] p-8 rounded-[30px] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff9f43]/5 -mr-16 -mt-16 rounded-full blur-2xl transition-all group-hover:bg-[#ff9f43]/20" />
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
              <Users className="w-5 h-5 text-[#ff9f43]" />
            </div>
            <span className="text-[10px] font-black text-[#ff9f43] bg-[#ff9f43]/10 px-3 py-1 rounded-full uppercase tracking-widest">+5%</span>
          </div>
          <p className="text-[10px] text-[#8395a7] font-black uppercase tracking-[0.2em] mb-1">Novos Cadastros</p>
          <h3 className="text-3xl font-black text-white">136</h3>
        </motion.div>

        {/* Conversão Card */}
        <motion.div variants={itemVariants} className="bg-[#2d3436] p-8 rounded-[30px] border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#5f27cd]/5 -mr-16 -mt-16 rounded-full blur-2xl transition-all group-hover:bg-[#5f27cd]/20" />
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
              <TrendingUp className="w-5 h-5 text-[#5f27cd]" />
            </div>
            <span className="text-[10px] font-black text-[#5f27cd] bg-[#5f27cd]/10 px-3 py-1 rounded-full uppercase tracking-widest">Estável</span>
          </div>
          <p className="text-[10px] text-[#8395a7] font-black uppercase tracking-[0.2em] mb-1">Taxa de Conversão Média</p>
          <h3 className="text-3xl font-black text-white">12.4%</h3>
        </motion.div>
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Traffic Area Chart (Span 2) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-[#2d3436] p-8 rounded-[40px] border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-white font-impact italic">Funil de Tração</h2>
              <p className="text-[10px] text-[#8395a7] font-black uppercase tracking-widest mt-1">Visitas vs Leads vs Cadastros</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#00d2d3] shadow-[0_0_10px_#00d2d3]"></div>
                 <span className="text-[9px] text-[#8395a7] font-black uppercase tracking-widest">Visitas</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#1dd1a1] shadow-[0_0_10px_#1dd1a1]"></div>
                 <span className="text-[9px] text-[#8395a7] font-black uppercase tracking-widest">Leads</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#ff9f43] shadow-[0_0_10px_#ff9f43]"></div>
                 <span className="text-[9px] text-[#8395a7] font-black uppercase tracking-widest">Cadastros</span>
               </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d2d3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d2d3" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1dd1a1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1dd1a1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCadastros" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff9f43" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ff9f43" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#576574" tick={{ fill: '#8395a7', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#576574" tick={{ fill: '#8395a7', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="visitas" stroke="#00d2d3" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitas)" />
                <Area type="monotone" dataKey="leads" stroke="#1dd1a1" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="cadastros" stroke="#ff9f43" strokeWidth={3} fillOpacity={1} fill="url(#colorCadastros)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Lead Distribution Bar Chart */}
        <motion.div variants={itemVariants} className="bg-[#2d3436] p-8 rounded-[40px] border border-white/5 shadow-2xl flex flex-col">
           <div className="mb-8">
              <h2 className="text-xl font-black uppercase tracking-tighter text-white font-impact italic">Leads por Categoria</h2>
              <p className="text-[10px] text-[#8395a7] font-black uppercase tracking-widest mt-1">Interesse do público</p>
            </div>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vehicleTypeData} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={true} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#8395a7" tick={{ fill: '#8395a7', fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} content={<CustomTooltip />} />
                  <Bar dataKey="leads" fill="#5f27cd" radius={[0, 8, 8, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </motion.div>

      </div>

      {/* Top Vehicles Table */}
      <motion.div variants={itemVariants} className="bg-[#2d3436] rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-white font-impact italic flex items-center gap-3">
              <Flame className="w-5 h-5 text-[#ff9f43]" /> Top 4 Mais Acessados
            </h2>
            <p className="text-[10px] text-[#8395a7] font-black uppercase tracking-widest mt-1">Performance individual dos veículos</p>
          </div>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-[10px] font-black text-[#576574] uppercase tracking-widest">Veículo</th>
                  <th className="p-4 text-[10px] font-black text-[#576574] uppercase tracking-widest text-right">Visitas</th>
                  <th className="p-4 text-[10px] font-black text-[#576574] uppercase tracking-widest text-right">Leads (Zap)</th>
                  <th className="p-4 text-[10px] font-black text-[#576574] uppercase tracking-widest text-right">Taxa (Conv.)</th>
                </tr>
              </thead>
              <tbody>
                {topVehicles.map((vehicle, index) => (
                  <tr key={vehicle.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-bold text-white flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md bg-black/40 flex items-center justify-center text-[10px] font-black text-[#8395a7]">
                        {index + 1}
                      </span>
                      {vehicle.name}
                    </td>
                    <td className="p-4 font-black text-[#00d2d3] text-right">{vehicle.visits}</td>
                    <td className="p-4 font-black text-[#1dd1a1] text-right">{vehicle.leads}</td>
                    <td className="p-4 font-black text-[#ff9f43] text-right">{vehicle.conversion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

    </motion.div>
  )
}

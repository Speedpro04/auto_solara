import { useAuth } from '../../hooks/useAuth'
import { Bell, Search, Activity, UserCircle } from 'lucide-react'

function AdminHeader() {
  const { user } = useAuth()

  return (
    <header className="bg-[#d2dae2] border-b-2 border-[#2d3436] px-10 py-5 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="hidden lg:flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1dd1a1] animate-pulse" />
                <span className="text-[11px] font-black text-[#2d3436] uppercase tracking-widest">Polars: Active</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                <span className="text-[11px] font-black text-[#2d3436] uppercase tracking-widest">Brain: Sync</span>
             </div>
          </div>
          <div className="relative hidden md:block group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#333] group-focus-within:text-[#1dd1a1] transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar no sistema..." 
              className="bg-[#2d3436] border border-[#2d3436] rounded-full py-3 pl-12 pr-6 text-sm font-black text-white placeholder:text-[#8395a7] outline-none focus:border-[#1dd1a1]/50 w-72 transition-all shadow-md"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-r border-white/5 pr-6">
             <button className="p-2.5 rounded-xl bg-white/5 text-[#576574] hover:text-[#1dd1a1] hover:bg-white/10 transition-all relative">
                <Bell className="w-5 h-5" />
                <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#1dd1a1] rounded-full ring-2 ring-black" />
             </button>
             <button className="p-2.5 rounded-xl bg-white/5 text-[#576574] hover:text-[#1dd1a1] hover:bg-white/10 transition-all">
                <Activity className="w-5 h-5" />
             </button>
          </div>
          
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="text-right">
              <span className="block text-xs font-black text-black uppercase tracking-widest leading-none">
                {user?.name || 'Administrador'}
              </span>
              <span className="text-[10px] font-black text-[#1dd1a1] uppercase tracking-[0.2em] mt-1.5 block">
                Plano Enterprise
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1dd1a1] to-[#10ac84] flex items-center justify-center text-black border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
              <UserCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader

import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Car, Settings, LogOut, BrainCircuit, ShieldAlert } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: BrainCircuit, label: 'Second Brain', path: '/admin/second-brain' },
  { icon: Car, label: 'Frota Elite', path: '/admin/veiculos' },
  { icon: Settings, label: 'Perfil Store', path: '/admin/loja' },
]

function AdminSidebar() {
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <aside className="w-72 bg-[#050505] border-r border-white/5 min-h-screen flex flex-col sticky top-0 z-50">
      <div className="p-10 border-b border-white/5">
        <Link to="/admin" className="flex flex-col gap-4">
          <div className="relative group">
             <div className="absolute inset-0 bg-[#1dd1a1]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700" />
             <img 
               src="/logo-auto-principal.png" 
               alt="Auto Racer" 
               className="w-20 h-14 object-contain rounded-xl border border-white/10 relative z-10 shadow-2xl"
             />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-widest uppercase font-impact italic">
              SOLARA <span className="text-[#1dd1a1]">AUTO</span>
            </h1>
            <p className="text-[8px] uppercase tracking-[0.5em] text-[#444] font-black mt-1">Intelligence System</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-8 space-y-2">
        <p className="text-[9px] font-black text-[#222] uppercase tracking-[0.3em] mb-6 px-4">Menu Principal</p>
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all duration-300 text-[11px] font-black uppercase tracking-widest border border-transparent ${
                isActive
                  ? 'bg-gradient-to-r from-[#1dd1a1] to-[#10ac84] text-black shadow-[0_10px_20px_-5px_rgba(29,209,161,0.3)]'
                  : 'text-[#444] hover:bg-white/5 hover:text-white hover:border-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-[#444] group-hover:text-[#1dd1a1]'}`} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-8 border-t border-white/5">
        <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/5">
           <div className="flex items-center gap-3 mb-3">
              <ShieldAlert className="w-4 h-4 text-[#1dd1a1]" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Proteção Ativa</span>
           </div>
           <div className="w-full h-1 bg-white/5 rounded-full">
              <div className="w-full h-full bg-[#1dd1a1] rounded-full animate-pulse" />
           </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-4 px-5 py-4 w-full rounded-[20px] text-[#444] hover:bg-[#ff6b6b]/10 hover:text-[#ff6b6b] transition-all duration-300 text-[11px] font-black uppercase tracking-widest border border-transparent hover:border-[#ff6b6b]/20"
        >
          <LogOut className="w-5 h-5" />
          <span>Encerrar Sessão</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar

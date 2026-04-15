import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Car, Settings, LogOut, BrainCircuit } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: BrainCircuit, label: 'Second Brain', path: '/admin/second-brain' },
  { icon: Car, label: 'Veículos', path: '/admin/veiculos' },
  { icon: Settings, label: 'Perfil da Loja', path: '/admin/loja' },
]

function AdminSidebar() {
  const location = useLocation()
  const { logout } = useAuth()

  return (
    <aside className="w-64 bg-[#0A0A0A] border-r border-[#262626] min-h-screen flex flex-col sticky top-0">
      <div className="p-8 border-b border-[#262626]">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-[8px] bg-[#D4AF3720] border border-[#D4AF3740] flex items-center justify-center">
            <Car className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            Solara Auto
          </h1>
        </div>
        <p className="text-[10px] uppercase tracking-[0.15em] text-[#737373] font-bold">Painel de Gestão</p>
      </div>

      <nav className="flex-1 p-6 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all duration-200 text-sm font-medium ${
                isActive
                  ? 'bg-[#D4AF37] text-[#0A0A0A] shadow-lg shadow-[#D4AF3720]'
                  : 'text-[#A3A3A3] hover:bg-[#141414] hover:text-white'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-[#262626]">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-[8px] text-[#A3A3A3] hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 text-sm font-medium"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Sair da conta</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar

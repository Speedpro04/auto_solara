import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Plus, Pencil, Trash2, Search, ExternalLink } from 'lucide-react'
import api from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'

function AdminVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const { store } = useAuth()

  useEffect(() => {
    if (store?.id) fetchVehicles()
  }, [store])

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get('/admin/vehicles')
      setVehicles(data)
    } catch (error) {
      console.error('Erro ao carregar veículos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este veículo de elite?')) return

    try {
      await api.delete(`/admin/vehicles/${id}`)
      fetchVehicles()
    } catch (error) {
      console.error('Erro ao excluir veículo:', error)
    }
  }

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black font-impact text-white tracking-tight uppercase">Estoque Ativo</h1>
          <p className="text-[#576574] text-[10px] mt-2 font-black uppercase tracking-[0.4em]">Gestão de Portfólio</p>
        </div>
        <Link
          to="/admin/veiculos/novo"
          className="flex items-center gap-2 bg-[#1dd1a1] text-[#0A0A0A] px-5 py-2.5 rounded-[12px] hover:bg-white transition font-black uppercase tracking-tighter text-sm"
        >
          <Plus className="w-5 h-5" />
          Novo Veículo
        </Link>
      </div>

      {/* Modern Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555]" />
        <input
          type="text"
          placeholder="Buscar no inventário..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#14181C] text-white pl-14 pr-6 py-4 rounded-[12px] border border-[#262626] focus:border-[#1dd1a1] outline-none transition font-medium"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#14181C] rounded-[15px] p-6 animate-pulse border border-[#262626]">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-black rounded-[12px]"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-black rounded w-1/4"></div>
                  <div className="h-4 bg-black rounded w-1/8"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-[#14181C] rounded-[15px] p-16 text-center border border-[#1dd1a1]/30 shadow-2xl">
          <div className="w-20 h-20 bg-black border border-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Car className="w-10 h-10 text-[#222]" />
          </div>
          <p className="text-[#A3A3A3] font-medium mb-8">Nenhum veículo encontrado no seu inventário atual.</p>
          <Link
            to="/admin/veiculos/novo"
            className="inline-flex items-center gap-2 bg-[#1dd1a1] text-[#0A0A0A] px-10 py-4 rounded-[12px] hover:bg-white transition font-black uppercase tracking-widest text-[11px]"
          >
            <Plus className="w-4 h-4" />
            Cadastrar Veículo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-[#14181C] rounded-[15px] p-6 border border-[#1dd1a1]/30 hover:border-[#1dd1a1] transition-all duration-300 group shadow-lg"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="w-24 h-24 bg-black rounded-[12px] border border-white/5 overflow-hidden flex items-center justify-center flex-shrink-0 group-hover:border-[#1dd1a1]/30 transition-colors">
                    {vehicle.media?.[0]?.url ? (
                      <img
                        src={vehicle.media[0].url}
                        alt={vehicle.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <Car className="w-10 h-10 text-[#222]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white mb-1 truncate group-hover:text-[#1dd1a1] transition-colors">
                      {vehicle.title}
                    </h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#555] mb-2">
                       {vehicle.brand} • {vehicle.year} • {vehicle.km.toLocaleString('pt-BR')} km
                    </p>
                    <p className="text-2xl font-black text-[#1dd1a1] tracking-tighter">
                      {formatPrice(vehicle.price)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                  <span
                    className={`px-3 py-1.5 rounded-[8px] text-[10px] font-black uppercase tracking-widest ${
                      vehicle.status === 'available'
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                        : vehicle.status === 'sold'
                        ? 'bg-[#1dd1a1]/10 text-[#1dd1a1] border border-[#1dd1a1]/20'
                        : 'bg-[#576574]/10 text-[#576574] hover:bg-[#576574]/10 border border-[#576574]/20'
                    }`}
                  >
                    {vehicle.status === 'available'
                      ? 'Disponível'
                      : vehicle.status === 'sold'
                      ? 'Vendido'
                      : 'Pausado'}
                  </span>
                  
                  <div className="flex items-center gap-2 flex-1 md:flex-none justify-end">
                    <Link
                      to={`/veiculo/${vehicle.slug || vehicle.id}`}
                      target="_blank"
                      className="p-3 text-[#555] hover:text-white hover:bg-white/5 rounded-[10px] transition"
                      title="Ver Vitrine"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                    <Link
                      to={`/admin/veiculos/${vehicle.id}/editar`}
                      className="p-3 text-[#555] hover:text-[#1dd1a1] hover:bg-[#1dd1a1]/10 rounded-[10px] transition"
                      title="Editar"
                    >
                      <Pencil className="w-5 h-5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(vehicle.id)}
                      className="p-3 text-[#555] hover:text-[#ff6b6b] hover:bg-[#ff6b6b]/10 rounded-[10px] transition"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminVehicles

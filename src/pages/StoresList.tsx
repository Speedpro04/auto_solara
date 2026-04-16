import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, MapPin } from 'lucide-react'
import api from '../lib/api'
import { Store } from '../types'

function StoresList() {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const { data } = await api.get('/stores')
        setStores(data)
      } catch (error) {
        console.error('Erro ao carregar lojas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStores()
  }, [])

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-xl font-['Bebas_Neue'] text-white mb-8">
        Todas as <span className="text-[#E84118]">Lojas</span>
      </h1>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar por nome ou cidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#E84118] transition"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-[#1A1A1F] rounded-xl p-6 animate-pulse">
              <div className="h-12 bg-[#2A2A30] rounded mb-4"></div>
              <div className="h-4 bg-[#2A2A30] rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : filteredStores.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-[#A0A0B0] text-lg">Nenhuma loja encontrada</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <Link
              key={store.id}
              to={`/${store.slug}`}
              className="bg-[#1A1A1F] rounded-xl p-6 border border-[#2A2A30] hover:border-[#E84118] transition group"
            >
              {store.logo_url ? (
                <img
                  src={store.logo_url}
                  alt={store.name}
                  className="h-16 mb-4 object-contain"
                />
              ) : (
                <Car className="w-16 h-16 text-[#E84118] mb-4" />
              )}
              <h3 className="text-2xl font-['Bebas_Neue'] text-white group-hover:text-[#E84118] transition mb-2">
                {store.name}
              </h3>
              {store.city && (
                <div className="flex items-center gap-2 text-[#A0A0B0]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{store.city}</span>
                </div>
              )}
              <div className="mt-4 text-sm text-[#6B6B7B]">
                Plano: <span className="text-[#E84118] uppercase">{store.plan}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default StoresList

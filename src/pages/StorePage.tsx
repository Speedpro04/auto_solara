import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Car, MapPin, Phone, Filter, ArrowRight, Gauge, Zap, Star, Bike, ShieldCheck } from 'lucide-react'
import api from '../lib/api'
import { Store, VehicleWithMedia } from '../types'

function StorePage() {
  const { slug } = useParams<{ slug: string }>()
  const [store, setStore] = useState<Store | null>(null)
  const [vehicles, setVehicles] = useState<VehicleWithMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeRes, vehiclesRes] = await Promise.all([
          api.get('/store'),
          api.get('/vehicles', { params: filters }),
        ])
        const storeData = storeRes.data
        setStore(storeData)
        setVehicles(vehiclesRes.data)

        // SEO Dinâmico
        if (storeData) {
          document.title = `${storeData.name} | Veículos Premium em ${storeData.city || 'Sua Região'} - Auto Racer`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', `Confira o estoque exclusivo da ${storeData.name} em ${storeData.city || 'nossa unidade'}. Carros seminovos e motos com garantia, perícia e as melhores taxas de financiamento.`);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug, filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="bg-[#0B0E14] min-h-screen pt-40 px-6">
        <div className="max-w-[1140px] mx-auto animate-pulse">
          <div className="h-64 bg-white/5 rounded-[40px] mb-12"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[450px] bg-white/5 rounded-[32px]"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="bg-[#0B0E14] min-h-screen flex items-center justify-center pt-20">
        <div className="text-center p-12 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-3xl">
          <Car className="w-20 h-20 text-[#222] mx-auto mb-6" />
          <h1 className="text-xl font-black mb-4 uppercase tracking-tighter text-white">CONCESSIONÁRIA NÃO ENCONTRADA</h1>
          <Link to="/" className="text-[#1dd1a1] font-black uppercase tracking-widest text-sm hover:underline">
            ← Voltar para o Estoque Elite
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#0B0E14] min-h-screen text-white pb-32">
      {/* Store Banner */}
      {store.banner_url && (
        <div className="w-full h-[400px] relative">
          <img src={store.banner_url} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] to-transparent"></div>
        </div>
      )}

      <div className="max-w-[1140px] mx-auto px-6 relative z-10 -mt-20">
        {/* Store Profile Card */}
        <div className="bg-[#14181C] rounded-[40px] p-10 border border-white/5 shadow-2xl flex flex-col md:flex-row gap-10 items-center md:items-start mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1dd1a1]/5 blur-[100px] rounded-full" />
          
          <div className="w-40 h-40 rounded-3xl bg-[#000000] border border-white/10 p-4 flex-shrink-0 flex items-center justify-center shadow-2xl relative z-10 hover:border-[#1dd1a1]/50 transition-colors">
            {store.logo_url ? (
              <img src={store.logo_url} alt={store.name} className="w-full h-full object-contain" />
            ) : (
              <Car className="w-16 h-16 text-[#333]" />
            )}
          </div>
          
           <div className="flex-1 text-center md:text-left relative z-10">
            <h1 className="text-xl md:text-xl font-black font-impact tracking-tighter uppercase mb-4">{store.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-[10px] font-black uppercase tracking-widest text-[#576574] mb-6">
               <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#1dd1a1]" /> {store.city || 'Matriz Premium'}</span>
               <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#1dd1a1]" /> Certificada Auto Racer</span>
            </div>
            
            <p className="text-[#8395a7] font-medium leading-relaxed max-w-2xl mb-8">
              {store.about_text || `Bem-vindo à ${store.name}. Nossa unidade em ${store.city || 'sua região'} é especializada em veículos de altíssima performance, todos revisados e com garantia Auto Racer.`}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <a
                href={`https://wa.me/${store.whatsapp || store.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#1dd1a1] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(29,209,161,0.2)]"
              >
                <Phone className="w-5 h-5" /> Contatar Consultor
              </a>
              {store.instagram && (
                <a
                  href={`https://instagram.com/${store.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                >
                  Seguir no Instagram
                </a>
              )}
            </div>

            {/* Schema.org AutoDealer for Store */}
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "AutoDealer",
                "name": store.name,
                "url": window.location.href,
                "logo": store.logo_url,
                "telephone": store.phone,
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": store.city || "São Paulo",
                  "addressCountry": "BR"
                }
              })}
            </script>
          </div>
        </div>

        {/* Premium Filters Area */}
        <div className="bg-[#14181C] rounded-[32px] p-8 border border-white/5 shadow-xl mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-[#1dd1a1]/10 rounded-lg"><Filter className="w-5 h-5 text-[#1dd1a1]" /></div>
            <h2 className="text-xl font-black uppercase tracking-tighter font-impact">Filtrar Automóveis</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="bg-[#0B0E14] text-white px-6 py-4 rounded-xl border border-white/5 focus:border-[#1dd1a1]/50 outline-none transition font-bold appearance-none cursor-pointer text-sm"
            >
              <option value="">Todos os Tipos</option>
              <option value="carro">Carros Superiores</option>
              <option value="moto">Super Motos</option>
            </select>
            <input
              type="text"
              placeholder="Marca ou Modelo..."
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className="bg-[#0B0E14] text-white px-6 py-4 rounded-xl border border-white/5 focus:border-[#1dd1a1]/50 outline-none transition font-bold placeholder:text-[#576574] text-sm"
            />
            <input
              type="number"
              placeholder="Investimento Mínimo"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="bg-[#0B0E14] text-white px-6 py-4 rounded-xl border border-white/5 focus:border-[#1dd1a1]/50 outline-none transition font-bold placeholder:text-[#576574] text-sm"
            />
            <input
              type="number"
              placeholder="Investimento Máximo"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="bg-[#0B0E14] text-white px-6 py-4 rounded-xl border border-white/5 focus:border-[#1dd1a1]/50 outline-none transition font-bold placeholder:text-[#576574] text-sm"
            />
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="mb-8">
           <h2 className="text-xl font-black tracking-tighter font-impact uppercase mb-4">Veja Nosso Estoque de Seminovos em {store.city || 'Unidade Auto Racer'}</h2>
           <div className="w-16 h-1 bg-[#1dd1a1] mb-10" />
        </div>

        {vehicles.length === 0 ? (
          <div className="bg-[#14181C] rounded-[40px] p-20 text-center border border-white/5 shadow-2xl">
            <Car className="w-20 h-20 text-[#222] mx-auto mb-6" />
            <p className="text-[#8395a7] text-lg font-medium mb-8">O estoque filtrado não retornou resultados.</p>
            <button 
              onClick={() => setFilters({ type: '', brand: '', minPrice: '', maxPrice: '' })}
              className="px-8 py-3 bg-white/5 border border-white/10 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/10 transition"
            >
              Limpar Filtros Rápidos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} store={store} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function VehicleCard({ vehicle, store }: { vehicle: VehicleWithMedia, store?: Store | null }) {
  const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  const coverImage = vehicle.media?.find((m) => m.order === 0)?.url;

  return (
    <Link
      to={`/veiculo/${vehicle.slug || vehicle.id}`}
      className="group relative bg-[#14181C] rounded-[40px] border border-white/5 hover:border-[#1dd1a1]/50 overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_-20px_rgba(29,209,161,0.2)]"
    >
      <div className="relative h-[280px] overflow-hidden">
        {coverImage ? (
          <img src={coverImage} alt={`${vehicle.title} ${vehicle.brand} seminovo à venda — Auto Racer`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        ) : (
          <div className="w-full h-full bg-[#000000] flex items-center justify-center"><Car className="w-20 h-20 text-[#111]" /></div>
        )}
        
        {/* Logo Watermark */}
        {store?.logo_url && (
          <div className="absolute bottom-28 right-6 z-20 pointer-events-none opacity-50 transition-opacity group-hover:opacity-100">
            <img src={store.logo_url} alt="" className="w-16 h-16 object-contain drop-shadow-2xl" />
          </div>
        )}
        
        {/* Status Badges */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <span className="px-3 py-1.5 bg-[#0B0E14]/60 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 text-white flex items-center gap-2">
            {vehicle.type === 'moto' ? <Bike className="w-3 h-3 text-[#1dd1a1]" /> : <Car className="w-3 h-3 text-[#1dd1a1]" />}
            {vehicle.type === 'moto' ? 'Super Bike' : 'Luxury Car'}
          </span>
          <span className="px-3 py-1.5 bg-[#1dd1a1]/90 text-black rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
            <Star className="w-3 h-3" /> Destaque
          </span>
        </div>

        {vehicle.status === 'sold' && (
          <div className="absolute inset-0 bg-[#0B0E14]/80 flex items-center justify-center z-20">
            <span className="text-white text-xl font-black px-10 py-4 bg-[#576574] text-white uppercase tracking-[0.4em] rounded-2xl -rotate-12 shadow-2xl">Vendido</span>
          </div>
        )}

        {/* Price Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
           <div className="bg-[#0B0E14]/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center justify-between transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#576574]">Investimento</span>
              <span className="text-xl font-black text-[#1dd1a1] tracking-tighter">{formatPrice(vehicle.price)}</span>
           </div>
        </div>
      </div>
      
      <div className="p-10 space-y-6">
        <div>
          <h3 className="text-2xl font-black mb-2 truncate group-hover:text-[#1dd1a1] transition-colors uppercase tracking-tighter font-impact">{vehicle.title}</h3>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase text-[#576574] tracking-widest">{vehicle.brand}</span>
            <div className="w-1 h-1 rounded-full bg-[#576574]" />
            <span className="text-[10px] font-black uppercase text-[#576574] tracking-widest">{vehicle.year}</span>
          </div>
        </div>

        <p className="text-[#8395a7] text-sm line-clamp-2 font-medium leading-relaxed opacity-60">
           {vehicle.description || 'Veículo de altíssima performance com acabamento premium e tecnologia de última geração.'}
        </p>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg"><Gauge className="w-4 h-4 text-[#1dd1a1]" /></div>
              <span className="font-bold text-xs tracking-tight">{vehicle.km.toLocaleString('pt-BR')} km</span>
           </div>
           <div className="flex items-center gap-3 justify-end">
              <div className="p-2 bg-white/5 rounded-lg"><Zap className="w-4 h-4 text-[#1dd1a1]" /></div>
              <span className="font-bold text-xs tracking-tight">C. Reserva</span>
           </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to={`/veiculo/${vehicle.slug || vehicle.id}`}
            className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 group/btn"
          >
            DETALHES
          </Link>
          <a 
            href={`https://wa.me/${store?.phone || '5511999999999'}?text=Olá! Vi o ${vehicle.title} na sua loja através da Auto Racer e gostaria de negociar.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-5 bg-[#1dd1a1] border border-[#1dd1a1] rounded-2xl text-[10px] font-black uppercase tracking-widest text-black hover:bg-white transition-all flex items-center justify-center gap-2 group/btn shadow-[0_0_20px_rgba(29,209,161,0.2)] hover:-translate-y-1"
          >
            NEGOCIAR <Phone size={14} />
          </a>
        </div>
      </div>
    </Link>
  )
}

export default StorePage

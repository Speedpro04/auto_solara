import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Search, ArrowRight, ShieldCheck, Zap, Star, LayoutGrid, List, Bike } from 'lucide-react'
import api from '../lib/api'
import { VehicleWithMedia, Store } from '../types'

function Home() {
  const [recentVehicles, setRecentVehicles] = useState<VehicleWithMedia[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, storesRes] = await Promise.all([
          api.get('/vehicles?limit=12'),
          api.get('/stores'),
        ])
        setRecentVehicles(vehiclesRes.data)
        setStores(storesRes.data)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="bg-[#0B0E14] min-h-screen text-white font-sans selection:bg-[#1dd1a1] selection:text-black">
      
      {/* Dynamic Hero Section with Luxury Flare */}
      <section className="relative pt-52 pb-32 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1140px] h-[600px] bg-[#1dd1a1]/5 blur-[120px] rounded-full" />
        <div className="absolute -top-48 -right-48 w-96 h-96 bg-[#1dd1a1]/10 blur-[100px] rounded-full" />
        {/* Logo Destaque como herói visual */}
        <img 
          src="/logo-auto-destaque.png" 
          alt="" 
          className="absolute bottom-0 right-0 w-[700px] opacity-[0.06] pointer-events-none select-none" 
        />
        
        <div className="max-w-[1140px] mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-[#1dd1a1] mb-10 animate-pulse">
            <Star className="w-3 h-3 fill-[#1dd1a1]" />
            Coleção Ultra-Exclusiva 2026
          </div>
          
          <h1 className="text-3xl md:text-7xl font-black font-impact tracking-tighter mb-4 leading-[0.85] animate-float-slow text-white uppercase">
            MAIS QUE POTÊNCIA,<br />
            <span className="text-dynamic-gradient drop-shadow-[0_0_15px_rgba(29,209,161,0.4)]">ESTADO DE ARTE</span>
          </h1>

          <div className="font-handwritten text-[#1dd1a1] text-2xl md:text-4xl -rotate-2 mb-12 opacity-80">
            Arquithectys Dougers
          </div>
          
          <p className="text-[#8395a7] text-lg md:text-2xl max-w-2xl mx-auto mb-16 font-medium tracking-tight">
            Curadoria absoluta dos veículos mais extraordinários do país. Design vanguardista, performance visceral e tecnologia disruptiva.
          </p>

          {/* Premium Search Bar */}
          <div className="max-w-4xl mx-auto p-2 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col md:flex-row items-center gap-2">
              <div className="flex-1 w-full relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#555] group-focus-within:text-[#1dd1a1] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Marca, modelo ou concessionária..." 
                  className="w-full bg-[#0A0D10] border border-white/5 py-5 pl-14 pr-6 rounded-[18px] text-white placeholder:text-[#444] outline-none focus:border-[#1dd1a1]/50 transition-all font-medium"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <select className="bg-[#0A0D10] border border-white/5 py-5 px-6 rounded-[18px] text-white outline-none focus:border-[#1dd1a1]/50 transition-all font-medium appearance-none cursor-pointer">
                  <option>Todos</option>
                  <option>Carros</option>
                  <option>Motos</option>
                </select>
                <button className="flex-1 md:flex-none px-10 py-5 bg-[#1dd1a1] text-black font-black uppercase tracking-wider rounded-[18px] hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_0_30px_rgba(29,209,161,0.3)]">
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-[1140px] mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-y border-white/5">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-[#1dd1a1]" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Garantia Solara</h4>
              <p className="text-sm text-[#576574]">Veículos verificados e certificados.</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Zap className="w-7 h-7 text-[#1dd1a1]" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Aprovação Rápida</h4>
              <p className="text-sm text-[#576574]">Crédito facilitado em minutos.</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Star className="w-7 h-7 text-[#1dd1a1]" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Atendimento VIP</h4>
              <p className="text-sm text-[#576574]">Consultores especializados prontos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Inventories */}
      <section className="max-w-[1140px] mx-auto px-6 mb-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 font-impact">MÁQUINAS EM DESTAQUE</h2>
            <div className="w-20 h-1 bg-[#1dd1a1]" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1,2,3].map(i => <div key={i} className="h-[450px] bg-white/5 rounded-[32px] animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {recentVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* Premium Stores Showcase */}
      <section className="bg-white/[0.02] border-y border-white/5 py-32 px-6">
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 font-impact">CONCESSIONÁRIAS ELITE</h2>
            <p className="text-[#576574] font-medium">As melhores parcerias para garantir sua segurança</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stores.map((store) => (
              <Link 
                key={store.id} 
                to={`/${store.slug}`} 
                className="group p-8 rounded-[32px] bg-[#0A0D10] border border-white/5 hover:border-[#1dd1a1]/30 hover:bg-[#14181C] transition-all duration-500 text-center"
              >
                <div className="w-20 h-20 mx-auto rounded-2xl bg-[#0B0E14] border border-white/5 flex items-center justify-center mb-6 overflow-hidden group-hover:scale-110 transition-transform duration-500">
                  {store.logo_url ? <img src={store.logo_url} className="w-full h-full object-contain p-2" /> : <Car className="w-10 h-10 text-[#222]" />}
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-[#1dd1a1] transition-colors">{store.name}</h3>
                <span className="text-[10px] uppercase font-black tracking-widest text-[#444]">{store.city || 'Brazil'}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Luxury Footer */}
      <footer className="pt-32 pb-12 px-6 text-center bg-[#0B0E14]">
        <div className="max-w-[1140px] mx-auto border-t border-white/5 pt-12">
          <div className="flex items-center justify-center gap-3 mb-8">
            <img src="/logo-auto-principal.png" alt="Solara Auto" className="w-14 h-10 object-cover rounded-xl" />
            <span className="text-2xl font-black tracking-[0.2em] font-impact uppercase">SOLARA <span className="text-[#1dd1a1]">AUTO</span></span>
          </div>
          <p className="text-[#576574] text-sm max-w-lg mx-auto mb-10 font-medium">A plataforma definitiva para quem exige o melhor em mobilidade e tecnologia disruptiva.</p>
          <div className="flex justify-center gap-8 mb-12">
            {['Instagram', 'WhatsApp', 'LinkedIn', 'YouTube'].map(social => (
              <a key={social} href="#" className="text-[#576574] hover:text-[#1dd1a1] text-xs font-bold uppercase tracking-widest transition-colors">{social}</a>
            ))}
          </div>
          <p className="text-[#333] text-[10px] uppercase font-bold tracking-widest">© 2026 AXOSHUB TECHNOLOGY — TODOS OS DIREITOS RESERVADOS.</p>
        </div>
      </footer>
    </div>
  )
}

function VehicleCard({ vehicle }: { vehicle: VehicleWithMedia }) {
  const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  const coverImage = vehicle.media?.find((m) => m.order === 0)?.url;

  return (
    <Link
      to={`/veiculo/${vehicle.id}`}
      className="group relative bg-[#14181C] rounded-[40px] border border-white/5 hover:border-[#1dd1a1]/50 overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_-20px_rgba(29,209,161,0.2)]"
    >
      <div className="relative h-[280px] overflow-hidden">
        {coverImage ? (
          <img src={coverImage} alt={vehicle.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        ) : (
          <div className="w-full h-full bg-[#0B0E14] flex items-center justify-center"><Car className="w-20 h-20 text-[#111]" /></div>
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
              <span className="font-bold text-xs tracking-tight">Manual / Chave Reserva</span>
           </div>
        </div>
        
        <button className="w-full py-5 bg-[#000000] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] group-hover:bg-[#1dd1a1] group-hover:text-black group-hover:border-transparent transition-all duration-500 flex items-center justify-center gap-3">
           EXPERIÊNCIA COMPLETA <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Link>
  )
}

export default Home

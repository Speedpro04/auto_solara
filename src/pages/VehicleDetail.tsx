import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Car, ChevronLeft, MessageSquare, MapPin, Calendar, Gauge, Info, ShieldCheck, Zap } from 'lucide-react'
import api from '../lib/api'
import { VehicleWithMedia } from '../types'

function VehicleDetail() {
  const { slug } = useParams()
  const [vehicle, setVehicle] = useState<VehicleWithMedia | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await api.get(`/vehicles/${slug}`)
        setVehicle(data)

        if (data) {
          document.title = `${data.brand} ${data.title} ${data.year} | ${data.km.toLocaleString('pt-BR')}km - Auto Racer`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', `Compre ${data.brand} ${data.title} ${data.year} na Auto Racer. ${data.km.toLocaleString('pt-BR')}km, periciado com 120 pontos de inspeção, garantia estendida e financiamento facilitado. ${data.city || 'Entrega para todo Brasil.'}`);
          }
          
          const canonical = document.querySelector('link[rel="canonical"]');
          if (canonical) {
            canonical.setAttribute('href', `https://auto.axoshub.com/veiculo/${slug}`);
          }

          let existingJsonLd = document.querySelector('script[data-type="vehicle-jsonld"]');
          if (existingJsonLd) existingJsonLd.remove();

          const jsonLd = document.createElement('script');
          jsonLd.type = 'application/ld+json';
          jsonLd.setAttribute('data-type', 'vehicle-jsonld');
          jsonLd.textContent = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Car",
            "name": `${data.brand} ${data.title}`,
            "description": data.description || `Veículo ${data.brand} ${data.title} ${data.year} seminovo com ${data.km.toLocaleString('pt-BR')}km`,
            "image": data.media?.[0]?.url,
            "brand": { "@type": "Brand", "name": data.brand },
            "vehicleModel": data.title,
            "modelDate": data.year,
            "mileageFromOdometer": {
              "@type": "QuantitativeValue",
              "value": data.km,
              "unitCode": "KM"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "BRL",
              "price": data.price,
              "priceValidUntil": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "availability": "https://schema.org/InStock",
              "seller": { "@type": "AutoDealer", "name": data.store?.name || "Auto Racer" }
            },
            "itemCondition": "https://schema.org/UsedCondition",
            "location": {
              "@type": "Place",
              "name": data.city || "Brasil"
            }
          });
          document.head.appendChild(jsonLd);
        }
      } catch (error) {
        console.error('Erro ao carregar veículo:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicle()
  }, [slug])

  if (loading) {
    return (
      <div className="bg-[#0B0E14] min-h-screen pt-24">
        <div className="max-w-[1140px] mx-auto px-6">
          <div className="animate-pulse space-y-10">
            <div className="h-[600px] bg-white/5 rounded-[40px]" />
          </div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="bg-[#0B0E14] min-h-screen flex items-center justify-center text-white">
        <div className="text-center p-12 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-3xl">
          <Car className="w-20 h-20 text-[#111] mx-auto mb-6" />
          <h1 className="text-xl font-black mb-4 uppercase tracking-tighter">VEÍCULO INDISPONÍVEL</h1>
          <Link to="/" className="text-[#1dd1a1] font-black uppercase tracking-widest text-sm hover:underline">
            ← Voltar para o Estoque Elite
          </Link>
        </div>
      </div>
    )
  }

  const images = vehicle.media?.filter((m) => m.type === 'image') || []
  const hasImages = images.length > 0
  const formatPrice = (price: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);

  return (
    <div className="bg-[#0B0E14] min-h-screen text-white pb-32">
      
      {/* Dynamic Background Light */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-[#1dd1a1]/5 to-transparent pointer-events-none z-0" />

      <div className="max-w-[1140px] mx-auto px-6 pt-32 relative z-10">
        
        {/* Navigation */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[#576574] hover:text-[#1dd1a1] transition-colors mb-12 group font-black uppercase tracking-widest text-xs"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Voltar para Galeria
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-12">
             <div className="space-y-4">
               <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#1dd1a1] bg-[#1dd1a1]/5 border border-[#1dd1a1]/20 px-4 py-2 rounded-full">
                 100% Periciado — Pronto para Entrega
               </span>
               <h1 className="text-xl md:text-xl font-black tracking-tighter uppercase font-impact">{vehicle.brand} {vehicle.title}</h1>
               <p className="font-['Architects_Daughter'] text-2xl text-[#1dd1a1] opacity-80 italic">
                 "A máquina que você merecia estava esperando aqui."
               </p>
               <div className="flex flex-wrap items-center gap-6 pt-2">
                  <span className="flex items-center gap-2 text-[#576574] font-bold text-sm uppercase tracking-widest"><Calendar className="w-4 h-4 text-[#1dd1a1]" /> {vehicle.year}</span>
                  <span className="flex items-center gap-2 text-[#576574] font-bold text-sm uppercase tracking-widest"><Gauge className="w-4 h-4 text-[#1dd1a1]" /> {vehicle.km.toLocaleString('pt-BR')} KM</span>
                  <span className="flex items-center gap-2 text-[#576574] font-bold text-sm uppercase tracking-widest"><MapPin className="w-4 h-4 text-[#1dd1a1]" /> {vehicle.city || 'Disponibilidade Imediata'}</span>
               </div>
             </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
            {/* Gallery Main */}
            <div className="relative aspect-video bg-[#0B0E14] rounded-[40px] border border-white/5 overflow-hidden group shadow-2xl">
              {hasImages ? (
                <img 
                  src={images[activeImage].url} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                  alt={vehicle.title} 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#000]"><Car className="w-32 h-32 text-white/5" /></div>
              )}
            </div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-6 gap-4">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-2xl border transition-all overflow-hidden ${activeImage === idx ? 'border-[#1dd1a1] scale-105 shadow-[0_0_20px_rgba(29,209,161,0.2)]' : 'border-white/5 hover:border-white/20'}`}
                >
                  <img src={img.url} className="w-full h-full object-cover" alt={`Thumb ${idx}`} />
                </button>
              ))}
            </div>

            {/* Description */}
            <div className="bg-[#14181C] border border-[#1dd1a1]/10 rounded-[40px] p-12 space-y-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 font-impact">
                <Info className="text-[#1dd1a1]" /> Descrição Técnica
              </h2>
              <div className="text-[#8395a7] leading-relaxed text-lg whitespace-pre-wrap font-medium">
                {vehicle.description || 'Nenhuma descrição detalhada disponível.'}
              </div>
              <div className="border-t border-white/5 pt-8">
                <p className="font-['Architects_Daughter'] text-xl md:text-2xl text-white opacity-50">
                  "Este veículo passou por 120 pontos de inspeção antes de chegar até você."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Contact */}
          <div className="lg:col-span-4 h-fit sticky top-32 space-y-8">
             <div className="bg-[#14181C] border border-[#1dd1a1]/30 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#1dd1a1]/5 blur-3xl rounded-full" />
                
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#576574] mb-4 block">Oferta de Investimento</span>
                <div className="text-xl font-black text-[#1dd1a1] tracking-tighter mb-10 drop-shadow-[0_0_10px_rgba(29,209,161,0.2)]">
                  {formatPrice(vehicle.price)}
                </div>

                <div className="space-y-4">
                   <a 
                    href={`https://wa.me/${vehicle.store?.phone || '5511999999999'}?text=Olá! Tenho interesse no ${vehicle.title} — ${vehicle.year} — ${vehicle.km.toLocaleString('pt-BR')}km. Podemos conversar?`}
                    target="_blank"
                    className="flex items-center justify-center gap-4 w-full bg-[#1dd1a1] text-black py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-white hover:scale-105 hover:shadow-[0_0_30px_rgba(29,209,161,0.4)] transition-all duration-500 group"
                   >
                     <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                     Quero Este Carro
                   </a>
                   
                   <p className="text-center font-['Architects_Daughter'] text-base text-[#1dd1a1] opacity-70">
                     "Resposta em até 5 minutos pelo WhatsApp."
                   </p>
                </div>

                <div className="mt-12 pt-12 border-t border-white/5 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#1dd1a1]/10 rounded-xl"><ShieldCheck className="w-5 h-5 text-[#1dd1a1]" /></div>
                      <div>
                        <span className="block text-white font-bold text-sm tracking-tight">Procedência Garantida</span>
                        <span className="text-[10px] text-[#576574] uppercase font-bold tracking-widest">CHECK-LIST AUTOMOTIVO 2026</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#1dd1a1]/10 rounded-xl"><Zap className="w-5 h-5 text-[#1dd1a1]" /></div>
                      <div>
                        <span className="block text-white font-bold text-sm tracking-tight">Entrega Imediata</span>
                        <span className="text-[10px] text-[#576574] uppercase font-bold tracking-widest">LOGÍSTICA VIP BRASIL</span>
                      </div>
                   </div>
                </div>
             </div>

             {/* Store Card Short */}
             <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 flex items-center gap-6">
                <div className="w-16 h-16 bg-[#0B0E14] rounded-xl border border-white/5 flex items-center justify-center flex-shrink-0">
                  <Car className="text-[#333]" />
                </div>
                <div>
                   <span className="block text-[9px] font-black uppercase tracking-widest text-[#576574] mb-1">Anunciado por</span>
                   <span className="block text-white font-black uppercase tracking-widest">{vehicle.store?.name || 'Unidade Auto Racer'}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetail

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Search, Gauge, Shield, ArrowRight, X, Info, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../lib/api'

// 50 Veículos Mock de Alta Conversão
const MOCK_VEHICLES = [
  ...Array.from({ length: 50 }).map((_, i) => {
    const brands = ['Porsche', 'Ferrari', 'Lamborghini', 'Mercedes-AMG', 'BMW', 'Audi', 'Land Rover', 'Aston Martin'];
    const models = ['911 Turbo S', 'F8 Tributo', 'Huracán EVO', 'G63', 'M5 Competition', 'RS6 Avant', 'Range Rover', 'Vantage'];
    const brand = brands[i % brands.length];
    const title = `${brand} ${models[i % models.length]}`;
    return {
      id: `mock-${i}`,
      slug: `veiculo-mock-${i}`,
      brand,
      title,
      year: 2023 - (i % 3),
      km: (i + 1) * 1200,
      price: 1500000 + (i * 50000),
      description: `Este ${title} é uma verdadeira obra de arte da engenharia automotiva. Veículo 100% periciado com Laudo Cautelar Aprovado. Manutenções rigorosamente em dia em concessionária oficial. 

Você não está comprando apenas um carro, mas sim acesso a uma performance inigualável e um status de exclusividade. Motor ajustado milimetricamente para entregar potência brutal sem perder o conforto para o dia a dia. 

Acabamento interno em couro premium e fibra de carbono. Entregamos para todo o Brasil com logística VIP.`,
      media: [{ url: `https://images.unsplash.com/photo-${['1614162692292-7ac56d7f7f1e', '1544829099-b9a0c07fad1a', '1618843479313-40f8afb4b4d8', '1606152421802-db97b9c7a11b', '1555215695-3004980ad54e', '1563720223185-11003d5169a6'][i % 6]}?auto=format&fit=crop&w=1000&q=80` }]
    };
  })
];

function Catalog() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDescVehicle, setSelectedDescVehicle] = useState<any | null>(null) // Para o Modal

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await api.get('/vehicles')
        setVehicles(data.length > 0 ? data : MOCK_VEHICLES)
      } catch (error) {
        setVehicles(MOCK_VEHICLES)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
    document.title = "Catálogo de Veículos Premium | Seminovos e Importados - Auto Racer";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Explore o catálogo completo da Auto Racer com carros seminovos, importados e de luxo. Porsche, Ferrari, Lamborghini, Mercedes-AMG e mais. Garantia, laudo cautelar e financiamento facilitado.');
    }
  }, [])

  const filteredVehicles = vehicles.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.brand.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="bg-[#0B0E14] min-h-screen pt-40 flex items-center justify-center">
        <div className="animate-spin text-[#1dd1a1]"><Car size={48} /></div>
      </div>
    )
  }

  return (
    <div className="bg-[#0B0E14] min-h-screen text-white pt-40 pb-20">
      <div className="max-w-[1140px] mx-auto px-6">
        
        <header className="mb-16 text-center relative">
          <h1 className="text-xl md:text-xl font-black font-impact tracking-tighter uppercase mb-6 italic">
            CATÁLOGO <span className="text-[#1dd1a1]">PREMIUM</span>
          </h1>
          <p className="text-[#8395a7] text-xl font-medium max-w-2xl mx-auto mb-6">
            Explore nossa curadoria completa com as máquinas mais exclusivas do país. Cada veículo é garantia de performance e procedência.
          </p>
          <div className="absolute right-10 md:right-[20%] top-full text-[#1dd1a1] font-['Architects_Daughter'] text-xl md:text-2xl opacity-70 rotate-[-4deg]">
             "Sua próxima conquista está aqui."
          </div>
        </header>

        {/* Barra de Busca Exclusiva */}
        <section className="mb-20 max-w-[800px] mx-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-[#555] group-focus-within:text-[#1dd1a1] transition-colors" />
            <input 
              type="text" 
              placeholder="Encontre sua máquina: Porsche, BMW, Ferrari..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#14181C] border border-white/5 rounded-[25px] py-6 pl-16 pr-6 text-white text-lg focus:border-[#1dd1a1]/50 outline-none transition-all shadow-2xl"
            />
          </div>
        </section>

        {/* Grid de Cards Grandes de Conversão (Layout Mobile-First e Full Width Desktop) */}
        <div className="flex flex-col gap-14">
          {filteredVehicles.map((vehicle, index) => (
            <>
              {/* Mid-scroll SPIN Banner de Objeção */}
              {index === 3 && (
                <div className="bg-gradient-to-br from-[#0d1117] to-[#14181C] border border-[#1dd1a1]/20 rounded-[40px] p-10 md:p-14 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
                  <div className="absolute top-0 left-0 w-[400px] h-[300px] bg-[#1dd1a1]/5 blur-[120px] rounded-full" />
                  <div className="flex-1 relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#1dd1a1] block mb-4">Transparência Total</span>
                    <h2 className="text-xl md:text-xl font-black font-impact tracking-tighter uppercase italic mb-4">
                      Cansado de Surpresas <span className="text-[#1dd1a1]">Mecânicas</span> Depois da Compra?
                    </h2>
                    <p className="text-[#8395a7] font-medium text-lg leading-relaxed mb-6">
                      Na Auto Racer, cada veículo passa por <strong className="text-white">120 pontos de inspeção</strong>. Laudo cautelar completo, histórico e garantia. Zero risco para o seu patrimônio.
                    </p>
                    <p className="font-['Architects_Daughter'] text-xl text-[#1dd1a1] opacity-80 rotate-[-2deg]">
                      "Sua paz de espírito não tem preço. O nosso laudo, sim."
                    </p>
                  </div>
                </div>
              )}

              {/* CARD GIGANTE - MOBILE FRIENDLY */}
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-[#14181C] rounded-[40px] border border-white/5 hover:border-[#1dd1a1]/50 overflow-hidden transition-all duration-700 hover:-translate-y-2 flex flex-col lg:flex-row shadow-2xl w-full"
              >
                {/* Imagem do carro (Ocupa a largura no celular, e metade no desktop) */}
                <Link to={`/veiculo/${vehicle.slug}`} className="relative h-[300px] lg:h-[450px] lg:w-1/2 overflow-hidden flex-shrink-0 cursor-pointer block">
                  <img 
                    src={vehicle.media?.[0]?.url || "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e"} 
                    alt={`${vehicle.title} Auto Racer`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute top-6 left-6 flex gap-2 flex-col">
                    <span className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-[10px] font-black tracking-widest uppercase border border-white/10">
                      {vehicle.brand}
                    </span>
                    <span className="px-4 py-2 bg-[#1dd1a1] text-black rounded-xl text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(29,209,161,0.5)]">
                      100% Periciado
                    </span>
                  </div>

                  {/* Logo Watermark */}
                  {(vehicle.stores?.logo_url || vehicle.store?.logo_url) && (
                    <div className="absolute bottom-6 right-6 z-20 pointer-events-none opacity-50 transition-opacity group-hover:opacity-100">
                      <img src={vehicle.stores?.logo_url || vehicle.store?.logo_url} alt="" className="w-20 h-20 object-contain drop-shadow-2xl" />
                    </div>
                  )}
                </Link>
                
                {/* Informações ao lado (ou abaixo no celular) */}
                <div className="p-8 lg:p-14 flex flex-col justify-center flex-1 space-y-6">
                  <div>
                    <h3 className="text-xl md:text-xl font-black font-impact tracking-tighter uppercase italic">{vehicle.title}</h3>
                    <p className="font-['Architects_Daughter'] text-lg text-[#1dd1a1] opacity-80 mt-2">
                      "Sem burocracia. Sem surpresa."
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-[#8395a7] font-bold text-sm uppercase tracking-widest bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="flex items-center gap-2"><Gauge size={16} className="text-[#1dd1a1]" /> {vehicle.km.toLocaleString('pt-BR')} KM</span>
                    <span className="flex items-center gap-2"><Shield size={16} className="text-[#1dd1a1]" /> Garantia Elite</span>
                  </div>

                  <div className="text-xl md:text-xl font-black text-[#1dd1a1] tracking-tighter drop-shadow-md">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(vehicle.price)}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {/* Botão para ler a descrição (Abre o Pop-Up super amigável no celular) */}
                    <button 
                      onClick={() => setSelectedDescVehicle(vehicle)}
                      className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-white"
                    >
                      <Info size={16} /> Ler Descrição
                    </button>

                    {/* Botão Principal de Conversão */}
                    <Link 
                      to={`/veiculo/${vehicle.slug}`}
                      className="flex-1 py-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      Ver Detalhes <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    {/* Botão Direto para o Lojista */}
                    <a 
                      href={`https://wa.me/${vehicle.stores?.phone || vehicle.store?.phone || '5511999999999'}?text=Olá! Vi o ${vehicle.title} no catálogo da Auto Racer e gostaria de negociar.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-5 bg-[#1dd1a1] border border-[#1dd1a1] rounded-2xl text-[11px] font-black uppercase tracking-widest text-black hover:bg-white transition-all flex items-center justify-center gap-2 group/btn shadow-[0_0_20px_rgba(29,209,161,0.2)] hover:-translate-y-1"
                    >
                      Negociar Agora <Phone size={16} />
                    </a>
                  </div>
                </div>
              </motion.div>
            </>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-40 border border-white/5 rounded-[40px] bg-white/5 relative mt-10">
            <Car size={64} className="mx-auto text-[#222] mb-6" />
            <h2 className="text-2xl font-black uppercase text-[#576574] mb-4">Nenhum veículo encontrado</h2>
            <p className="font-['Architects_Daughter'] text-xl text-[#1dd1a1] opacity-60">"Logo teremos exatamente o que você procura."</p>
          </div>
        )}

        {/* CTA Fundo de Página (SPIN) */}
        {filteredVehicles.length > 0 && (
          <div className="mt-20 relative rounded-[45px] overflow-hidden bg-gradient-to-br from-[#0d1117] to-[#0B0E14] border border-[#1dd1a1]/20 p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-[#1dd1a1]/3 blur-[200px]" />
            <div className="relative z-10">
              <p className="font-['Architects_Daughter'] text-2xl md:text-xl text-[#1dd1a1] opacity-80 mb-6 rotate-[-1deg]">
                "Não negocie a sua tranquilidade."
              </p>
              <h2 className="text-xl md:text-xl font-black font-impact tracking-tighter uppercase italic mb-6">
                Quer vender seus veículos aqui?<br />
                <span className="text-[#1dd1a1]">Seja um Parceiro Elite Auto Racer.</span>
              </h2>
              <Link
                to="/parceiro"
                className="inline-flex items-center gap-4 px-10 py-6 bg-[#1dd1a1] text-black font-black uppercase tracking-widest rounded-[25px] hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_20px_40px_-10px_rgba(29,209,161,0.4)]"
              >
                Conhecer Planos de Parceiro <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE DESCRIÇÃO (POP-UP MOBILE FRIENDLY) */}
      <AnimatePresence>
        {selectedDescVehicle && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 perspective-1000">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedDescVehicle(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full sm:max-w-2xl bg-[#0B0E14] border border-[#1dd1a1]/30 rounded-t-[40px] sm:rounded-[40px] p-8 sm:p-12 shadow-[0_0_50px_rgba(29,209,161,0.15)] flex flex-col max-h-[90vh] overflow-hidden"
            >
              {/* Header do PopUp */}
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/10 shrink-0">
                <div>
                   <h3 className="text-2xl md:text-xl font-black font-impact tracking-tighter uppercase italic">{selectedDescVehicle.title}</h3>
                   <span className="text-[10px] text-[#1dd1a1] font-black uppercase tracking-[0.2em]">Inspeção Aprovada Auto Racer</span>
                </div>
                <button 
                  onClick={() => setSelectedDescVehicle(null)}
                  className="w-12 h-12 bg-white/5 hover:bg-[#1dd1a1] hover:text-black rounded-full flex items-center justify-center transition-all text-[#8395a7]"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Corpo da Descrição (Scrollavel) */}
              <div className="overflow-y-auto pr-2 custom-scrollbar space-y-6 text-[#A0AEC0] font-medium leading-relaxed text-lg pb-6">
                <p className="whitespace-pre-line">{selectedDescVehicle.description}</p>
                <div className="bg-[#14181C] p-6 rounded-2xl border border-white/5">
                   <p className="font-['Architects_Daughter'] text-xl text-[#1dd1a1] opacity-90 rotate-[-1deg]">
                      "A exclusividade não aceita garantias medianas. Este modelo passou pelo nosso crivo mais severo."
                   </p>
                </div>
              </div>

              {/* Footer do PopUp (CTA fixo na base) */}
              <div className="pt-6 shrink-0 mt-auto border-t border-white/10">
                <Link 
                  to={`/veiculo/${selectedDescVehicle.slug}`}
                  className="w-full py-5 bg-[#1dd1a1] text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-white hover:-translate-y-1 transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(29,209,161,0.3)]"
                >
                  Continuar Negociação <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default Catalog

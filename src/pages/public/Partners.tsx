import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Star, Shield, Zap, Sparkles } from 'lucide-react'

function Partners() {
  return (
    <div className="text-white font-sans w-full overflow-hidden relative min-h-screen bg-[#050505]">
      {/* Decoração Global */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1140px] h-[800px] bg-[#1dd1a1]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-[#1dd1a1]/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Modern Slim Search Section Just Below Menu - keeping consistent spacing */}
      <div className="pt-[135px]" />

      <section className="relative px-4 pb-20 z-10 max-w-[1140px] mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-[#1dd1a1] mb-8 shadow-[0_0_20px_rgba(29,209,161,0.1)]">
            <Sparkles className="w-3" />
            Venda Mais com Auto Racer
          </div>
          
          <h1 className="text-[30px] md:text-[55px] font-black font-impact tracking-tighter uppercase italic leading-[0.9] text-white drop-shadow-2xl mb-6">
            Escale suas vendas com a <br />
            <span className="text-[#1dd1a1] drop-shadow-[0_0_40px_rgba(29,209,161,0.4)]">Auto Racer</span>
          </h1>
          
          <p className="text-[#8395a7] text-base md:text-lg max-w-2xl mx-auto font-medium tracking-tight leading-relaxed">
            Faça parte da vitrine automotiva premium que mais cresce no Brasil. Transforme seu estoque em uma máquina de vendas com tecnologia de ponta.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[950px] mx-auto">
          
          {/* Plano Parceiro Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative bg-[#0A0D10] rounded-[40px] overflow-hidden border border-white/10 hover:border-[#1dd1a1]/50 transition-all duration-500 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_60px_-15px_rgba(29,209,161,0.15)] p-10 flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#1dd1a1]/5 blur-[80px] rounded-full group-hover:bg-[#1dd1a1]/10 transition-colors pointer-events-none" />
            
            <div className="relative z-10 flex-1">
              <h3 className="text-2xl font-black font-impact italic uppercase tracking-widest text-white mb-2">Plano Parceiro</h3>
              <p className="text-[#576574] text-xs font-bold uppercase tracking-[0.2em] mb-8">Vitrine Premium Compartilhada</p>
              
              <div className="mb-10 flex items-end gap-2">
                <span className="text-4xl font-black font-impact text-[#1dd1a1]">R$ 69,90</span>
                <span className="text-[#576574] text-sm font-bold uppercase tracking-widest pb-1">/mês</span>
              </div>

              <ul className="space-y-4 mb-10">
                {[
                  "Painel Administrativo Completo",
                  "Cadastro Ilimitado de Veículos",
                  "Upload de Imagens em Alta Resolução",
                  "Contato Direto Via WhatsApp",
                  "Integração com IA (Second Brain)",
                  "Estatísticas de Visitas"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#8395a7] font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#1dd1a1] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link 
              to="/cadastro"
              className="relative z-10 w-full flex items-center justify-center gap-3 bg-[#1dd1a1] text-black px-6 py-5 rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-black uppercase text-xs tracking-[0.2em] shadow-[0_20px_40px_rgba(29,209,161,0.3)]"
            >
              Começar Agora <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* App Exclusivo Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative bg-gradient-to-br from-[#0f1418] to-[#0a0d10] rounded-[40px] overflow-hidden border border-[#1dd1a1]/30 hover:border-[#1dd1a1] transition-all duration-500 shadow-[0_30px_60px_-15px_rgba(29,209,161,0.1)] hover:shadow-[0_30px_60px_-15px_rgba(29,209,161,0.3)] p-10 flex flex-col h-full"
          >
            <div className="absolute top-4 right-4 bg-[#1dd1a1]/20 border border-[#1dd1a1]/30 px-3 py-1 rounded-full flex items-center gap-2">
              <Star className="w-3 h-3 text-[#1dd1a1] fill-[#1dd1a1]" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#1dd1a1]">Premium</span>
            </div>

            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#1dd1a1]/10 blur-[100px] rounded-full group-hover:bg-[#1dd1a1]/20 transition-colors pointer-events-none" />
            
            <div className="relative z-10 flex-1">
              <h3 className="text-2xl font-black font-impact italic uppercase tracking-widest text-white mb-2">App Exclusivo</h3>
              <p className="text-[#1dd1a1] text-xs font-bold uppercase tracking-[0.2em] mb-8">White Label / Plataforma Própria</p>
              
              <div className="mb-10">
                 <p className="font-['Architects_Daughter'] text-2xl text-[#1dd1a1] mb-2">Desenvolvimento Sob Medida</p>
                 <span className="text-[#576574] text-xs font-bold uppercase tracking-widest">A partir de R$ 4.000,00</span>
              </div>

              <ul className="space-y-4 mb-10">
                {[
                  "Sua Própria Marca (White Label)",
                  "Domínio Exclusivo (ex: sua-loja.com.br)",
                  "Design Customizado",
                  "Aplicativo PWA Otimizado",
                  "Servidor Dedicado de Alta Performance",
                  "Suporte Técnico VIP Prioritário"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-[#8395a7] font-medium">
                    <Shield className="w-5 h-5 text-[#1dd1a1] shrink-0" />
                    <span className="text-white font-semibold">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a 
              href="https://wa.me/5512978138934?text=Olá! Tenho interesse em desenvolver um App Exclusivo (White Label) para minha concessionária com a Auto Racer."
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 w-full flex items-center justify-center gap-3 bg-transparent border-2 border-[#1dd1a1] text-[#1dd1a1] px-6 py-5 rounded-2xl hover:bg-[#1dd1a1] hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-black uppercase text-xs tracking-[0.2em]"
            >
              Falar com Especialista <Zap className="w-4 h-4" />
            </a>
          </motion.div>

        </div>
      </section>

    </div>
  )
}

export default Partners

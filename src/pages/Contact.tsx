import { useEffect } from 'react'
import { MapPin, Phone, Mail, Clock, ArrowRight, ShieldCheck } from 'lucide-react'

function Contact() {
  useEffect(() => {
    document.title = "Consultoria Elite | Auto Racer"
  }, [])

  return (
    <div className="bg-[#0B0E14] min-h-screen text-white pt-40 pb-20 relative overflow-hidden">
      
      {/* Elementos de fundo e Turbina */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#1dd1a1]/5 blur-[200px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-[#1dd1a1]/5 blur-[250px] rounded-full pointer-events-none z-0" />
      
      {/* Turbina Gigante na Base */}
      <div className="absolute bottom-[320px] left-0 w-full flex justify-center pointer-events-none select-none z-0 opacity-40">
         <img src="/turbina.png" className="w-[1480px] max-w-none object-contain -rotate-[35deg]" alt="Turbina Solara" />
      </div>

      <div className="max-w-[1140px] mx-auto px-6 relative z-10">
        
        {/* Cabeçalho */}
        <header className="mb-20 text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1dd1a1]/10 text-[#1dd1a1] text-[10px] font-black uppercase tracking-widest border border-[#1dd1a1]/20 mb-6 relative">
            <ShieldCheck className="w-3" />
            Atendimento Nível AAA
          </span>
          <h1 className="text-xl md:text-xl font-black font-impact tracking-tighter uppercase mb-6 italic">
            Não Temos Atendentes. <br />
            <span className="text-[#1dd1a1]">Temos Especialistas.</span>
          </h1>
          <p className="font-['Architects_Daughter'] text-2xl text-[#1dd1a1] opacity-80 mb-6">
            "Para adquirir um ativo de alto valor, você precisa de um conselheiro, não de um vendedor."
          </p>
          <p className="text-[#8395a7] text-lg font-medium leading-relaxed">
            Seja para encontrar um modelo específico que não está no catálogo, avaliar o seu veículo atual ou estruturar a melhor linha de crédito, nosso time está pronto para agir nos bastidores por você.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
          
          {/* Coluna da Esquerda: Canais de Contato Direto */}
          <div className="space-y-8">
            <div className="bg-[#14181C] p-10 rounded-[40px] border border-white/5 hover:border-[#1dd1a1]/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1dd1a1]/5 blur-3xl transition-colors group-hover:bg-[#1dd1a1]/20" />
              <Phone className="w-8 h-8 text-[#1dd1a1] mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Linha Direta Elite</h3>
              <p className="text-[#8395a7] text-sm font-medium mb-6">Atendimento imediato para negociações em andamento e propostas comerciais.</p>
              <a href="tel:+5511999999999" className="text-xl font-black text-white hover:text-[#1dd1a1] transition-colors">
                (11) 99999-9999
              </a>
            </div>

            <div className="bg-[#14181C] p-10 rounded-[40px] border border-white/5 hover:border-[#1dd1a1]/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1dd1a1]/5 blur-3xl transition-colors group-hover:bg-[#1dd1a1]/20" />
              <Mail className="w-8 h-8 text-[#1dd1a1] mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 italic">Assessoria Documental</h3>
              <p className="text-[#8395a7] text-sm font-medium mb-6">Envio de laudos, propostas de financiamento e vistorias prévias.</p>
              <a href="mailto:assessoria@autoracer.com.br" className="text-xl font-bold text-white hover:text-[#1dd1a1] transition-colors break-all">
assessoria@autoracer.com.br
              </a>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 p-8 rounded-[30px] border border-white/10 text-center">
                <Clock className="w-6 h-6 text-[#1dd1a1] mx-auto mb-4" />
                <h4 className="text-[10px] uppercase font-black tracking-widest text-[#576574] mb-2">Funcionamento</h4>
                <p className="text-white font-bold">Seg a Sex<br/>09h às 19h</p>
              </div>
              <div className="bg-white/5 p-8 rounded-[30px] border border-white/10 text-center">
                <MapPin className="w-6 h-6 text-[#1dd1a1] mx-auto mb-4" />
                <h4 className="text-[10px] uppercase font-black tracking-widest text-[#576574] mb-2">Showroom VIP</h4>
                <p className="text-white font-bold">Avenida Europa<br/>São Paulo, BR</p>
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Card de Chamada Whatsapp de Conversão Rápida */}
          <div className="bg-gradient-to-br from-[#0d1117] to-[#14181C] border border-[#1dd1a1]/30 rounded-[50px] p-12 relative shadow-[0_30px_60px_-15px_rgba(29,209,161,0.15)] h-full flex flex-col justify-center">
            
            <h2 className="text-xl lg:text-xl font-black font-impact tracking-tighter uppercase italic mb-6">
              O Seu Tempo <br />Não Pode Esperar.
            </h2>
            <p className="font-['Architects_Daughter'] text-xl text-[#1dd1a1] opacity-90 mb-8 rotate-[-2deg]">
              "Resolveremos o seu problema em até 5 minutos."
            </p>
            
            <p className="text-[#8395a7] text-lg font-medium leading-relaxed mb-10">
              Para maior agilidade e confidencialidade documental, todo nosso fluxo de propostas opera via WhatsApp seguro. Mande a marca e o modelo do seu sonho, ou a placa do ativo que quer dar na troca.
            </p>

            <a 
              href="https://wa.me/5511999999999?text=Olá! Preciso da consultoria de um especialista Solara."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-4 py-8 bg-[#1dd1a1] text-black font-black uppercase tracking-widest text-sm rounded-[30px] hover:bg-white hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(29,209,161,0.3)] transition-all duration-300"
            >
              Iniciar Chat Confidencial <ArrowRight size={20} />
            </a>
            
            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#1dd1a1]" />
                </div>
                <span className="text-xs font-bold text-[#8395a7] uppercase tracking-wider">Criptografia End-to-End</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#1dd1a1]" />
                </div>
                <span className="text-xs font-bold text-[#8395a7] uppercase tracking-wider">Sigilo Total de Dados Fiscais</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Contact

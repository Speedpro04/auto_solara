import { Car } from 'lucide-react'

function Footer() {
  return (
    <footer className="pt-24 pb-12 px-6 text-center bg-[#0B0E14] relative z-20 border-t border-white/5">
      <div className="max-w-[1140px] mx-auto border-t border-white/10 pt-16 flex flex-col md:flex-row items-center justify-between gap-10 text-left">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-4 mb-4">
            <img src="/logo-auto-principal.png" alt="Solara Auto" className="w-[120px] object-contain drop-shadow-[0_0_15px_rgba(29,209,161,0.2)]" />
            <span className="text-3xl md:text-4xl font-black tracking-[0.2em] font-['Architects_Daughter'] uppercase">SOLARA <span className="text-[#1dd1a1]">AUTO</span></span>
          </div>
          <p className="text-[#576574] text-sm max-w-sm mb-6 font-medium leading-relaxed italic">
             A vanguarda da mobilidade premium. Tecnologia e design em perfeita simbiose.
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <img src="/bandeira.png" alt="Bandeira de Corrida" className="w-[145px] object-contain mb-[30px] opacity-80 drop-shadow-[0_0_10px_rgba(29,209,161,0.2)]" />
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">
            {['Instagram', 'WhatsApp', 'Facebook'].map(social => (
              <a key={social} href="#" className="text-[#555] hover:text-[#1dd1a1] hover:-translate-y-1 transition-all">{social}</a>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-[1140px] mx-auto mt-12 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
         <p className="text-[#333] text-[9px] font-black uppercase tracking-[0.5em]">© 2026 Solara Auto — Intelligence System</p>
         <div className="text-[#333] text-[9px] font-black uppercase tracking-[0.3em] flex gap-4">
            <a href="#" className="hover:text-[#1dd1a1]">Privacidade</a>
            <a href="#" className="hover:text-[#1dd1a1]">Termos</a>
         </div>
      </div>
    </footer>
  )
}

export default Footer

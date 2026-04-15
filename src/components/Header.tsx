import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Car, Menu, X, Phone, User } from 'lucide-react'
import { useStore } from '../hooks/useStore'

function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { store } = useStore()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const primaryColor = '#1dd1a1'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] border-b transition-all duration-700 ${
        scrolled 
        ? 'bg-[#0B0E14]/90 backdrop-blur-3xl py-3 border-white/5' 
        : 'bg-transparent py-6 border-transparent'
      }`}
    >
      <div className="max-w-[1140px] mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between">

          {/* Luxury Logo Branding */}
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95">
            <img 
              src="/logo-auto-principal.png" 
              alt="Solara Auto" 
              className="w-14 h-10 object-cover rounded-xl shadow-[0_0_20px_rgba(29,209,161,0.2)]" 
            />
            <span className="text-xl md:text-2xl font-black text-white tracking-[0.2em] font-impact uppercase">
              SOLARA <span className="text-[#1dd1a1]">AUTO</span>
            </span>
          </Link>

          {/* Modern Navigation Menu */}
          <nav className="hidden md:flex items-center gap-10">
            {[
              { label: 'Estoque', path: '/' },
              { label: 'Sobre Nós', path: '#' },
              { label: 'Contato', path: '#' }
            ].map((item) => (
              <Link 
                key={item.label}
                to={item.path} 
                className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8395a7] hover:text-[#1dd1a1] transition-all relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#1dd1a1] transition-all group-hover:w-full opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
            <Link
              to="/login"
              className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white hover:bg-[#1dd1a1] hover:text-black hover:border-transparent transition-all duration-300"
            >
              Portal do Concessionário
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-3 text-white hover:bg-white/5 rounded-xl transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[100%] left-0 right-0 bg-[#0A0D10] border-b border-white/5 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="p-8 flex flex-col gap-6">
             <Link to="/" className="text-lg font-bold text-white uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Estoque Premium</Link>
             <Link to="/login" className="px-6 py-4 bg-[#1dd1a1] text-black text-center rounded-2xl font-black uppercase tracking-widest" onClick={() => setMobileMenuOpen(false)}>Portal Adm</Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

import { useState, useEffect } from 'react'
import { Car, Upload, Save, Building2, MapPin, Phone } from 'lucide-react'
import api from '../../lib/api'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../hooks/useAuth'

function AdminStoreProfile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [currentLogo, setCurrentLogo] = useState<string>('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const { data } = await api.get('/admin/store')
        setFormData({
          name: data.name,
          phone: data.phone,
          city: data.city || '',
        })
        setCurrentLogo(data.logo_url || '')
      } catch (error) {
        console.error('Erro ao carregar dados da loja:', error)
      } finally {
        setFetching(false)
      }
    }

    fetchStore()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLogoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      let logoUrl = currentLogo

      if (logoFile && user?.store_id) {
        const fileExt = logoFile.name.split('.').pop()
        const fileName = `${user.store_id}/logo.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('solara_media')
          .upload(fileName, logoFile, { upsert: true })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('solara_media')
          .getPublicUrl(fileName)

        logoUrl = urlData.publicUrl
      }

      await api.put('/admin/store', {
        ...formData,
        logo_url: logoUrl,
      })

      setSuccess('Dados da concessionária atualizados com sucesso!')
      if (logoUrl) setCurrentLogo(logoUrl)
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar dados')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[#1dd1a1]/20 border-t-[#1dd1a1] rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Perfil da Unidade</h1>
        <p className="text-[#737373] text-sm font-medium mt-1 uppercase tracking-widest">Identidade Visual e Contato</p>
      </div>

      {error && (
        <div className="text-[#576574] hover:bg-[#576574]/10 border border-[#576574]/20 bg-[#576574]/10 px-6 py-4 rounded-[12px] font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-6 py-4 rounded-[12px] font-medium">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Branding Section */}
        <section className="bg-[#14181C] rounded-[15px] border border-[#1dd1a1]/30 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#1dd1a1]/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#1dd1a1]" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Identidade da Marca</h3>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative group">
              <div className="w-40 h-40 bg-[#050505] rounded-[24px] border border-[#262626] group-hover:border-[#1dd1a1]/50 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-inner">
                {logoPreview || currentLogo ? (
                  <img
                    src={logoPreview || currentLogo}
                    alt="Logo Preview"
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Car className="w-16 h-16 text-[#1A1A1A]" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoSelect}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#1dd1a1] text-black rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:bg-white hover:scale-110 transition active:scale-95"
              >
                <Upload className="w-5 h-5" />
              </label>
            </div>
            
            <div className="flex-1 space-y-4 text-center md:text-left">
              <h4 className="text-white font-bold text-lg">Logo Oficial</h4>
              <p className="text-[#737373] text-sm font-medium leading-relaxed">
                Sua logo será exibida em todos os anúncios e na vitrine da sua unidade. Recomendamos o uso de fundos transparentes (PNG).
              </p>
              <p className="text-[10px] font-black uppercase text-[#1dd1a1] tracking-widest pt-2">PNG • SVG • JPG (MÁX 2MB)</p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-[#14181C] rounded-[15px] border border-[#1dd1a1]/30 p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#737373] mb-3">
                <Building2 className="w-3 h-3" /> Nome da Concessionária *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-[#050505] text-white px-5 py-4 rounded-[12px] border border-white/5 focus:border-[#1dd1a1] outline-none transition font-semibold"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#737373] mb-3">
                <Phone className="w-3 h-3" /> WhatsApp Business *
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-[#050505] text-white px-5 py-4 rounded-[12px] border border-white/5 focus:border-[#1dd1a1] outline-none transition font-semibold"
                placeholder="5511999999999"
                required
              />
              <p className="text-[9px] text-[#444] mt-2 italic">Ex: 5511988887777 (apenas números)</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#737373] mb-3">
                <MapPin className="w-3 h-3" /> Localização / Cidade
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full bg-[#050505] text-white px-5 py-4 rounded-[12px] border border-white/5 focus:border-[#1dd1a1] outline-none transition font-semibold"
                placeholder="Ex: São Paulo, SP"
              />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#1dd1a1] text-[#0A0A0A] px-12 py-5 rounded-[12px] hover:bg-white transition font-black uppercase tracking-tighter text-sm shadow-xl shadow-[#D4AF3710] disabled:opacity-50"
          >
            {loading ? 'Salvando...' : (
              <>
                <Save className="w-5 h-5" />
                EFETIVAR ALTERAÇÕES ELITE
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminStoreProfile

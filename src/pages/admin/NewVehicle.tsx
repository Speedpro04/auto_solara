import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, X, Save, Info, Camera } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import api from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'

function AdminNewVehicle() {
  const navigate = useNavigate()
  const { store } = useAuth()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<Array<{ file: File; preview: string }>>([])
  
  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    year: '',
    km: '',
    price: '',
    description: '',
    type: 'carro',
    status: 'available'
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setImages((prev) => [...prev, ...newImages])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  })

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev]
      URL.revokeObjectURL(newImages[index].preview)
      newImages.splice(index, 1)
      return newImages
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (images.length === 0) {
      alert('Selecione pelo menos uma imagem premium.')
      return
    }

    setLoading(true)
    try {
      // 1. Cria o veículo vinculado a loja atual
      const { data: vehicle } = await api.post('/admin/vehicles', {
        ...formData,
        store_id: store?.id,
        year: parseInt(formData.year) || 2024,
        km: parseInt(formData.km) || 0,
        price: parseFloat(formData.price) || 0,
      })

      // 2. Faz o upload das imagens pelo FastAPI (Protegido e Seguro)
      const uploadPromises = images.map(async (img) => {
        const uploadData = new FormData()
        uploadData.append('file', img.file)

        // Upload no backend (vai pro bucket solara_media e retorna a URL)
        const { data } = await api.post('/admin/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        const url = data.url

        // 3. Vincula a URL pública ao veículo recém criado
        return api.post(`/admin/vehicles/${vehicle.id}/media`, {
          url: url,
          type: 'image',
          size_bytes: img.file.size
        })
      })

      await Promise.all(uploadPromises)
      navigate('/admin/veiculos')
    } catch (error) {
      console.error('Erro ao cadastrar:', error)
      alert('Erro ao realizar o cadastro. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black font-impact text-white tracking-tight uppercase">Novo Patrimônio</h1>
          <p className="text-[#576574] text-[10px] mt-2 font-black uppercase tracking-[0.4em]">Curadoria e Cadastro de Elite</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        
        {/* Step 1: Media Upload System */}
        <section className="bg-[#14181C] rounded-[40px] border border-[#1dd1a1]/20 p-10 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1dd1a1]/5 blur-[100px] rounded-full" />
          
          <div className="flex items-center gap-4 mb-10">
             <div className="p-3 bg-[#1dd1a1] text-black rounded-2xl"><Camera className="w-6 h-6" /></div>
             <h2 className="text-2xl font-black uppercase tracking-tighter font-impact text-white">Galeria de Alta Fidelidade</h2>
          </div>

          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-[32px] p-16 text-center transition-all duration-500 cursor-pointer group ${
              isDragActive ? 'border-[#1dd1a1] bg-[#1dd1a1]/5' : 'border-[#576574]/30 hover:border-[#1dd1a1]/50 bg-black/20'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-black rounded-3xl border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl">
                 <Upload className={`w-8 h-8 ${isDragActive ? 'text-[#1dd1a1] animate-bounce' : 'text-[#333]'}`} />
              </div>
              <p className="text-white font-black uppercase tracking-widest text-xs mb-2">Arraste as imagens aqui</p>
              <p className="text-[#576574] text-xs font-bold uppercase tracking-widest opacity-60">FOTOS EM 4K • 16:9 RECOMENDADO</p>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-10">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/10 hover:border-[#1dd1a1]/50 transition-colors shadow-lg">
                  <img src={img.preview} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-3 bg-[#576574] text-white rounded-xl hover:scale-110 transition"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {idx === 0 && <span className="absolute top-3 left-3 px-2 py-1 bg-[#1dd1a1] text-black text-[8px] font-black uppercase tracking-widest rounded-md">Principal</span>}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Step 2: Details */}
        <section className="bg-[#14181C] rounded-[40px] border border-white/5 p-10 shadow-2xl space-y-12">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-[#1dd1a1]"><Info className="w-6 h-6" /></div>
             <h2 className="text-2xl font-black uppercase tracking-tighter font-impact text-white">Especificações Técnicas</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#576574] mb-3 group-focus-within:text-[#1dd1a1] transition-colors">Título do Anúncio</label>
                <input 
                  type="text" name="title" value={formData.title} onChange={handleInputChange} required
                  className="w-full bg-black/60 border border-white/5 py-5 px-6 rounded-2xl text-white outline-none focus:border-[#1dd1a1]/50 transition-all font-bold placeholder:text-[#222]"
                  placeholder="Ex: PORSCHE 911 GT3 RS"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#576574] mb-3">Marca</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required className="w-full bg-black/60 border border-white/5 py-5 px-6 rounded-2xl text-white outline-none focus:border-[#1dd1a1]/50 transition-all font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#576574] mb-3">Ano</label>
                  <input type="text" name="year" value={formData.year} onChange={handleInputChange} required className="w-full bg-black/60 border border-white/5 py-5 px-6 rounded-2xl text-white outline-none focus:border-[#1dd1a1]/50 transition-all font-bold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#576574] mb-3">Quilometragem</label>
                  <input type="number" name="km" value={formData.km} onChange={handleInputChange} required className="w-full bg-black/60 border border-white/5 py-5 px-6 rounded-2xl text-white outline-none focus:border-[#1dd1a1]/50 transition-all font-bold" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#576574] mb-3 group-focus-within:text-[#1dd1a1]">Preço de Venda</label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-[#1dd1a1]">R$</span>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full bg-black/60 border border-white/5 py-5 pl-12 pr-6 rounded-2xl text-white outline-none focus:border-[#1dd1a1]/50 transition-all font-black text-xl tracking-tight" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#576574] mb-3">Tipo</label>
                <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-black/60 border border-white/5 py-5 px-6 rounded-2xl text-white outline-none focus:border-[#1dd1a1]/50 transition-all font-bold appearance-none">
                  <option value="carro">Luxury Car</option>
                  <option value="moto">Super Bike</option>
                </select>
              </div>
           </div>

           <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#576574] mb-3">Narrativa de Venda / Descrição</label>
              <textarea 
                name="description" value={formData.description} onChange={handleInputChange} rows={6}
                className="w-full bg-black/60 border border-white/5 py-6 px-8 rounded-[32px] text-white outline-none focus:border-[#1dd1a1]/50 transition-all font-medium leading-relaxed"
                placeholder="Descreva a história e os diferenciais deste veículo..."
              />
           </div>
        </section>

        {/* Global Save */}
        <div className="fixed bottom-10 right-10 z-50">
           <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-4 bg-[#1dd1a1] text-black px-12 py-6 rounded-full font-black uppercase tracking-[0.2em] shadow-[0_20px_60px_rgba(29,209,161,0.4)] hover:scale-105 active:scale-95 transition-all duration-500 disabled:opacity-50"
           >
            {loading ? 'PUBLICANDO...' : (
              <>
                <Save className="w-6 h-6 border-black" />
                EFETIVAR ANÚNCIO
              </>
            )}
           </button>
        </div>
      </form>
    </div>
  )
}

export default AdminNewVehicle

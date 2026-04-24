import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, X, Car } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

function AdminEditVehicle() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    type: 'carro',
    brand: '',
    year: new Date().getFullYear(),
    km: 0,
    price: 0,
    description: '',
    status: 'available',
  })
  const [existingMedia, setExistingMedia] = useState<any[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await api.get(`/admin/vehicles/${id}`)
        setFormData({
          title: data.title,
          type: data.type,
          brand: data.brand,
          year: data.year,
          km: data.km,
          price: data.price,
          description: data.description || '',
          status: data.status,
        })
        setExistingMedia(data.media || [])
      } catch (error) {
        console.error('Erro ao carregar veículo:', error)
        setError('Veículo não encontrado')
      } finally {
        setFetching(false)
      }
    }

    fetchVehicle()
  }, [id])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'km' || name === 'price' ? Number(value) : value,
    }))
  }

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Excluir esta mídia?')) return

    try {
      await api.delete(`/admin/media/${mediaId}`)
      setExistingMedia((prev) => prev.filter((m) => m.id !== mediaId))
    } catch (error) {
      console.error('Erro ao excluir mídia:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.put(`/admin/vehicles/${id}`, formData)
      navigate('/admin/veiculos')
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar veículo')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="text-center py-12 text-[#A0A0B0]">Carregando...</div>
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/veiculos" className="text-[#444] hover:text-black transition">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-impact text-black uppercase tracking-tight">Editar Veículo</h1>
      </div>

      {error && (
        <div className="bg-[#576574]/10 border border-[#576574]/20 text-[#576574] px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm text-[#A0A0B0] mb-2 font-black uppercase tracking-widest text-[10px]">Título do Anúncio *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full bg-[#2d3436] text-white px-6 py-4 rounded-2xl border border-white/5 focus:border-[#1dd1a1] transition font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">Tipo *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#1dd1a1] transition"
              required
            >
              <option value="carro">Carro</option>
              <option value="moto">Moto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">Marca *</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#1dd1a1] transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">Ano *</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#1dd1a1] transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">Quilometragem *</label>
            <input
              type="number"
              name="km"
              value={formData.km}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#1dd1a1] transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">Preço (R$) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#1dd1a1] transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#1dd1a1] transition"
            >
              <option value="available">Disponível</option>
              <option value="paused">Pausado</option>
              <option value="sold">Vendido</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-[#A0A0B0] mb-2">Descrição</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={6}
              className="w-full bg-[#1A1A1F] text-white px-4 py-3 rounded-lg border border-[#2A2A30] focus:border-[#1dd1a1] transition resize-none"
            />
          </div>
        </div>

        {/* Existing Media */}
        {existingMedia.length > 0 && (
          <div>
            <label className="block text-sm text-[#A0A0B0] mb-2">Mídias Existentes</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {existingMedia.map((media) => (
                <div key={media.id} className="relative group">
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt="Media"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-[#2A2A30] rounded-lg flex items-center justify-center">
                      <Car className="w-8 h-8 text-[#6B6B7B]" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteMedia(media.id)}
                    className="absolute top-2 right-2 bg-[#576574] text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-[#1dd1a1] text-[#0A0A0A] font-black uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-white transition disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <Link
            to="/admin/veiculos"
            className="px-6 py-3 bg-[#1A1A1F] text-white rounded-lg hover:bg-[#2A2A30] transition border border-[#2A2A30]"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}

export default AdminEditVehicle

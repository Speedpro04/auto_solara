import { Routes, Route } from 'react-router-dom'

// Páginas Públicos
import Home from './pages/Home'
import StorePage from './pages/StorePage'
import VehicleDetail from './pages/VehicleDetail'
import StoresList from './pages/StoresList'
import Catalog from './pages/Catalog'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import Partners from './pages/public/Partners'

// Páginas Admin
import AdminLogin from './pages/admin/Login'
import AdminRegister from './pages/admin/Register'
import RegisterSuccess from './pages/admin/RegisterSuccess'
import AdminDashboard from './pages/admin/Dashboard'
import AdminVehicles from './pages/admin/Vehicles'
import AdminNewVehicle from './pages/admin/NewVehicle'
import AdminEditVehicle from './pages/admin/EditVehicle'
import AdminStoreProfile from './pages/admin/StoreProfile'
import AdminReports from './pages/admin/Reports'
import SecondBrainAuto from './pages/admin/SecondBrain'
import SuperAdminDashboard from './pages/superadmin/Dashboard'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/stores" element={<StoresList />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/sobre-nos" element={<AboutUs />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/:slug" element={<StorePage />} />
        <Route path="/veiculo/:slug" element={<VehicleDetail />} />
        <Route path="/parceiro" element={<Partners />} />
      </Route>

      {/* Rotas Admin */}
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/cadastro" element={<AdminRegister />} />
      <Route path="/cadastro-sucesso" element={<RegisterSuccess />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/veiculos" element={<AdminVehicles />} />
        <Route path="/admin/veiculos/novo" element={<AdminNewVehicle />} />
        <Route path="/admin/veiculos/:id/editar" element={<AdminEditVehicle />} />
        <Route path="/admin/loja" element={<AdminStoreProfile />} />
        <Route path="/admin/second-brain" element={<SecondBrainAuto />} />
        <Route path="/admin/relatorios" element={<AdminReports />} />
      </Route>
      {/* Rota do Dono do SaaS (Você) */}
      <Route path="/super-admin" element={<SuperAdminDashboard />} />
    </Routes>
  )
}

export default AppRoutes

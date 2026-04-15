import { Routes, Route } from 'react-router-dom'

// Páginas Públicos
import Home from './pages/Home'
import StorePage from './pages/StorePage'
import VehicleDetail from './pages/VehicleDetail'
import StoresList from './pages/StoresList'

// Páginas Admin
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminVehicles from './pages/admin/Vehicles'
import AdminNewVehicle from './pages/admin/NewVehicle'
import AdminEditVehicle from './pages/admin/EditVehicle'
import AdminStoreProfile from './pages/admin/StoreProfile'
import SecondBrainAuto from './pages/admin/SecondBrain'

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
        <Route path="/:slug" element={<StorePage />} />
        <Route path="/veiculo/:id" element={<VehicleDetail />} />
      </Route>

      {/* Rotas Admin */}
      <Route path="/login" element={<AdminLogin />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/veiculos" element={<AdminVehicles />} />
        <Route path="/admin/veiculos/novo" element={<AdminNewVehicle />} />
        <Route path="/admin/veiculos/:id/editar" element={<AdminEditVehicle />} />
        <Route path="/admin/loja" element={<AdminStoreProfile />} />
        <Route path="/admin/second-brain" element={<SecondBrainAuto />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes

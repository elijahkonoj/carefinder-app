import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Dashboard from "../pages/Dashboard"
import HospitalDetail from "../pages/HospitalDetail"
import AdminRoute from "../components/AdminRoute"
import AdminDashboard from "../pages/AdminDashboard"
import CreateHospitals from "../pages/CreateHospitals"
import HospitalManagement from "../pages/HospitalManagement"
import EditHospital from "../pages/EditHospital"
import Favourites from "../pages/Favourites"
import Navbar from "../components/Navbar"
import Profile from "../pages/Profile"

export default function AppRouter() {
 return (
   <BrowserRouter>
   <Navbar />
     <Routes>

       <Route path="/" element={<Home />} />

       <Route
         path="/hospital/:id"
         element={<HospitalDetail />}
       />

       <Route
         path="/login"
         element={<Login />}
       />

       <Route
         path="/register"
         element={<Register />}
       />

       <Route
         path="/admin"
         element={
          <AdminRoute>
              <AdminDashboard />
         </AdminRoute>
  }
/>
      <Route
         path="/admin/create"
         element={
           <AdminRoute>
             <CreateHospitals />
           </AdminRoute>
  }
/>
<Route
  path="/admin/hospitals"
  element={
    <AdminRoute>
      <HospitalManagement />
    </AdminRoute>
  }
/>
       <Route
         path="/dashboard"
         element={<Dashboard />}
       />
       <Route
         path="/admin/hospitals/:id/edit"
         element={
             <AdminRoute>
                <EditHospital />
             </AdminRoute>
  }
/>

<Route
  path="/favourites"
  element={<Favourites />}
/>

<Route
  path="/profile"
  element={<Profile />}
/>
     </Routes>
   </BrowserRouter>
 )
}
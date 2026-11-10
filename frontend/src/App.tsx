import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Citizen pages
import CitizenHome from './pages/citizen/CitizenHome'
import ChatPage from './pages/citizen/ChatPage'
import GrievancePage from './pages/citizen/GrievancePage'
import SchemesPage from './pages/citizen/SchemesPage'
import TrackGrievancePage from './pages/citizen/TrackGrievancePage'

// Admin pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './components/layout/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminGrievanceList from './pages/admin/AdminGrievanceList'
import AdminHeatmap from './pages/admin/AdminHeatmap'
import AdminReports from './pages/admin/AdminReports'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            fontFamily: "'Noto Sans Odia', sans-serif",
            fontSize: '15px',
          },
          success: {
            iconTheme: { primary: '#4CAF50', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#f44336', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        {/* Citizen routes */}
        <Route path="/" element={<CitizenHome />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/grievance" element={<GrievancePage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route path="/track" element={<TrackGrievancePage />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="grievances" element={<AdminGrievanceList />} />
          <Route path="map" element={<AdminHeatmap />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

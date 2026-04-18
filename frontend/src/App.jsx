import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './Components/Header';
import Footer from './Components/Footer';
import EventsPage from './Pages/EventsPage';
import ContactUsPage from './Pages/ContactUsPage';
import LostFoundMainPage from './Components/Lost&Found/lost&foundMainpage';
import FoundItemsPage from './Components/Lost&Found/FoundItemsPage';
import ClaimItemPage from './Components/Lost&Found/claimItmes';
import AdminLostFoundPage from './Components/Lost&Found/AdminLostFoundPage';
import AdminLoginPage from './Pages/AdminLoginPage';
import AdminRouteGuard from './Components/Navigations/AdminRouteGuard';
import SocietiesPage from './Pages/SocietiesPage';
import SocietyDetailPage from './Pages/SocietyDetailPage';
import CreateSocietyPage from './Pages/CreateSocietyPage';
import EditSocietyPage from './Pages/EditSocietyPage';
import MemberManagementPage from './Pages/MemberManagementPage';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname.startsWith('/admin/') || location.pathname === '/admin-lost-found';
  const isSocietyLeaderRoute =
    location.pathname === '/societies/create' ||
    (location.pathname.startsWith('/societies/') &&
      (location.pathname.endsWith('/edit') || location.pathname.endsWith('/members')));

  return (
    <div className="flex flex-col min-h-screen bg-light">
      {!isAdminRoute && !isSocietyLeaderRoute && <Header />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/lost-found" element={<LostFoundMainPage />} />
          <Route path="/found-items" element={<FoundItemsPage />} />
          <Route path="/claim/:itemId" element={<ClaimItemPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/lost-found"
            element={
              <AdminRouteGuard>
                <AdminLostFoundPage />
              </AdminRouteGuard>
            }
          />
          <Route
            path="/admin-lost-found"
            element={
              <AdminRouteGuard>
                <AdminLostFoundPage />
              </AdminRouteGuard>
            }
          />
          <Route path="/societies" element={<SocietiesPage />} />
          <Route path="/societies/:slug" element={<SocietyDetailPage />} />
          <Route path="/societies/create" element={<CreateSocietyPage />} />
          <Route path="/societies/:slug/edit" element={<EditSocietyPage />} />
          <Route path="/societies/:slug/members" element={<MemberManagementPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminRoute && !isSocietyLeaderRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #dbeafe',
          },
          success: {
            iconTheme: {
              primary: '#2563eb',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;

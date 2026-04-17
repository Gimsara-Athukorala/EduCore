import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import EventsPage from './pages/EventsPage';
import ContactUsPage from './pages/ContactUsPage';
import LostFoundMainPage from './Components/Lost&Found/lost&foundMainpage';
import FoundItemsPage from './Components/Lost&Found/FoundItemsPage';
import ClaimItemPage from './Components/Lost&Found/claimItmes';
import AdminLostFoundPage from './Components/Lost&Found/AdminLostFoundPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRouteGuard from './Components/Navigations/AdminRouteGuard';
import SocietiesPage from './pages/SocietiesPage';
import SocietyDetailPage from './pages/SocietyDetailPage';
import CreateSocietyPage from './pages/CreateSocietyPage';
import EditSocietyPage from './pages/EditSocietyPage';
import MemberManagementPage from './pages/MemberManagementPage';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname.startsWith('/admin/') || location.pathname === '/admin-lost-found';

  return (
    <div className="flex flex-col min-h-screen bg-light">
      {!isAdminRoute && <Header />}

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
          <Route path="/societies/:id" element={<SocietyDetailPage />} />
          <Route path="/societies/create" element={<CreateSocietyPage />} />
          <Route path="/societies/:id/edit" element={<EditSocietyPage />} />
          <Route path="/societies/:id/members" element={<MemberManagementPage />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;

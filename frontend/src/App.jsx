import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';
import EventsPage from './Pages/EventsPage';
import ContactUsPage from './Pages/ContactUsPage';
import LostFoundMainPage from './Components/Lost&Found/lost&foundMainpage';
import FoundItemsPage from './Components/Lost&Found/FoundItemsPage';
import ClaimItemPage from './Components/Lost&Found/claimItmes';
import AdminLostFoundPage from './Components/Lost&Found/AdminLostFoundPage';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-light">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<EventsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/lost-found" element={<LostFoundMainPage />} />
            <Route path="/found-items" element={<FoundItemsPage />} />
            <Route path="/claim/:itemId" element={<ClaimItemPage />} />
            <Route path="/admin/lost-found" element={<AdminLostFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

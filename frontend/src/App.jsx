import React, { useState } from 'react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import EventsPage from './Pages/EventsPage';
import ContactUsPage from './Pages/ContactUsPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="flex flex-col min-h-screen bg-light">
      <Header setCurrentPage={setCurrentPage} />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <EventsPage />
        )}
        {currentPage === 'events' && (
          <EventsPage />
        )}
        {currentPage === 'contact' && (
          <ContactUsPage />
        )}
      </main>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;

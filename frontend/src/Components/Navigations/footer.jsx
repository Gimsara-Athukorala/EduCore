import React from 'react';

function Footer({ setCurrentPage }) {
  const currentYear = new Date().getFullYear();

  const handleContactClick = () => {
    setCurrentPage('contact');
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-[#1E3A8A] text-light mt-auto border-t border-white/10">
      <div className="max-w-7xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* EduCore Section */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 tracking-wide">EduCore</h3>
            <p className="text-sm leading-relaxed text-gray-300 mb-6">A comprehensive learning event management system designed to streamline educational activities and enhance student engagement.</p>
            <div className="flex gap-4">
              <a href="#facebook" className="flex items-center justify-center w-9 h-9 bg-white/15 text-white rounded-lg hover:bg-[#3B82F6] transition-colors" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                  <path d="M17 1H1C0.4 1 0 1.4 0 2V16C0 16.6 0.4 17 1 17H10V11H8V9H10V7.5C10 5.3 11.3 4 13.1 4H15V6H14C13.2 6 13 6.4 13 7.2V9H15L14.7 11H13V17H17C17.6 17 18 16.6 18 16V2C18 1.4 17.6 1 17 1Z"/>
                </svg>
              </a>
              <a href="#twitter" className="flex items-center justify-center w-9 h-9 bg-white/15 text-white rounded-lg hover:bg-[#3B82F6] transition-colors" title="Twitter">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                  <path d="M17 2C16.4 2.3 15.7 2.5 15 2.7C15.7 2.2 16.2 1.5 16.5 0.7C15.8 1.1 15 1.4 14.1 1.6C13.5 1 12.6 0.5 11.6 0.5C9.6 0.5 8 2.1 8 4C8 4.3 8 4.6 8.1 4.8C5.3 4.7 2.8 3.2 1.3 1C0.9 1.7 0.7 2.5 0.7 3.3C0.7 4.9 1.6 6.2 2.9 6.9C2.3 6.9 1.9 6.7 1.5 6.5V6.6C1.5 8.3 2.8 9.6 4.5 10C4.1 10.1 3.7 10.2 3.3 10.2C3 10.2 2.7 10.1 2.5 10.1C3 11.4 4.4 12.4 6.1 12.4C4.8 13.3 3.2 13.9 1.5 13.9C1.2 13.9 0.8 13.9 0.5 13.8C2.2 14.8 4.3 15.4 6.6 15.4C11.6 15.4 15.2 10.7 15.2 5.2L15.1 4.6C15.8 4.1 16.4 3.5 17 2.8Z"/>
                </svg>
              </a>
              <a href="#linkedin" className="flex items-center justify-center w-9 h-9 bg-white/15 text-white rounded-lg hover:bg-[#3B82F6] transition-colors" title="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                  <path d="M1.5 2.3C0.7 2.3 0 3 0 3.8S0.7 5.3 1.5 5.3C2.3 5.3 3 4.6 3 3.8C3 3 2.3 2.3 1.5 2.3ZM0.3 6.3H2.7V17H0.3V6.3ZM4.6 6.3H7V7.5C7.4 6.8 8.4 6 10.1 6C13.4 6 14.3 7.9 14.3 11.2V17H11.9V11.7C11.9 10.3 11.5 9.4 10.3 9.4C8.7 9.4 8 10.4 8 12V17H5.6L4.6 6.3Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3">
              <li><button onClick={() => { setCurrentPage('events'); window.scrollTo(0, 0); }} className="text-gray-300 text-sm hover:text-[#3B82F6] transition-colors duration-200">Events</button></li>
              <li><a href="#calendar" className="text-gray-300 text-sm hover:text-[#3B82F6] transition-colors duration-200">Calendar</a></li>
              <li><a href="#resources" className="text-gray-300 text-sm hover:text-[#3B82F6] transition-colors duration-200">Resources</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Support</h4>
            <ul className="space-y-3">
              <li><a href="#faq" className="text-gray-300 text-sm hover:text-[#3B82F6] transition-colors duration-200">FAQ</a></li>
              <li><button onClick={handleContactClick} className="text-gray-300 text-sm hover:text-[#3B82F6] transition-colors duration-200">Contact Us</button></li>
              <li><a href="#docs" className="text-gray-300 text-sm hover:text-[#3B82F6] transition-colors duration-200">Documentation</a></li>
              <li><a href="#feedback" className="text-gray-300 text-sm hover:text-[#3B82F6] transition-colors duration-200">Feedback</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#privacy" className="text-gray-300 text-sm hover:text-[#3B82F6] transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#terms" className="text-gray-300 text-sm hover:text-[#3B82F6] transition-colors duration-200">Terms of Service</a></li>
              <li><a href="#cookies" className="text-gray-300 text-sm hover:text-[#3B82F6] transition-colors duration-200">Cookies</a></li>
              <li><a href="#compliance" className="text-gray-300 text-sm hover:text-[#3B82F6] transition-colors duration-200">Compliance</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-xs text-gray-400">&copy; {currentYear} EduCore. All rights reserved.</p>
          <p className="text-xs italic font-medium mt-2" style={{ color: '#3B82F6' }}>Empowering Education Through Better Event Management</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
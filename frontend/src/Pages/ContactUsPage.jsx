import React, { useState } from 'react';

function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-gradient-to-r from-primary-600 to-secondary px-5 py-12 text-white">
        <h1 className="text-4xl font-bold mb-3">Get In Touch</h1>
        <p className="text-lg text-gray-100">We're here to help. Send us a message and we'll respond as soon as possible.</p>
      </div>

      <div className="flex-grow max-w-7xl mx-auto w-full px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M3 8L10.89 13.26C11.54 13.68 12.46 13.68 13.11 13.26L21 8M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary-600">Email Us</h3>
              </div>
              <p className="text-gray-700"><a href="mailto:support@educore.com" className="text-secondary hover:underline font-medium">support@educore.com</a></p>
            </div>

            <div className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92V19.92C22.0006 20.1986 21.9467 20.4742 21.8382 20.7272C21.7297 20.9802 21.5691 21.2057 21.3622 21.3882C21.1553 21.5707 20.9064 21.7064 20.6348 21.7884C20.3632 21.8704 20.0764 21.8963 19.79 21.865C16.6halls 21.4798 13.6574 20.3418 11.09 18.55C8.68 16.8929 6.81 14.6896 5.54 12.1899C4.23 9.62857 3.53765 6.77139 3.54 3.79C3.54 3.504 3.56588 3.21721 3.64788 2.94565C3.72989 2.67409 3.86658 2.42524 4.04908 2.21829C4.23158 2.01134 4.457 1.85065 4.71003 1.74215C4.96306 1.63365 5.23863 1.57979 5.52 1.58H8.52C9.0623 1.57467 9.59251 1.75914 10.0151 2.10028C10.4377 2.44142 10.7326 2.91501 10.86 3.45L12.26 9.23C12.3769 9.71715 12.3154 10.2281 12.0845 10.6781C11.8537 11.1281 11.4682 11.4799 11 11.68L9.27 12.88C10.4914 14.9563 12.0437 16.5087 14.12 17.73L15.32 16C15.5201 15.5318 15.8719 15.1463 16.3219 14.9155C16.7719 14.6846 17.2829 14.6231 17.77 14.74L23.55 16.14C24.085 16.2674 24.5586 16.5623 24.8997 16.9849C25.2409 17.4075 25.4254 17.9377 25.42 18.48V21.48C25.42 21.7663 25.3661 22.0519 25.2582 22.3245C25.1503 22.5971 24.9904 22.8428 24.7843 23.0453C24.5782 23.2478 24.3306 23.4033 24.0597 23.5041C23.7888 23.6049 23.5019 23.6485 23.215 23.63C19.8834 23.3284 16.7097 22.1714 14.02 20.29C11.5152 18.5735 9.54141 16.1852 8.27 13.415C6.3 9.5 6.3 4.5 8.27 0.64C9.54141 -2.13 11.5152 -4.5135 14.02 -6.23C16.7097 -8.1114 19.8834 -9.2684 23.215 -9.57C23.5019 -9.5885 23.7888 -9.5449 24.0597 -9.4441C24.3306 -9.3433 24.5782 -9.1878 24.7843 -8.9853C24.9904 -8.7828 25.1503 -8.5371 25.2582 -8.2645C25.3661 -7.9919 25.42 -7.7063 25.42 -7.42V-4.42C25.4254 -3.8777 25.2409 -3.3475 24.8997 -2.9249C24.5586 -2.5023 24.085 -2.2074 23.55 -2.08L17.77 -0.68C17.2829 -0.5569 16.7719 -0.6184 16.3219 -0.8492C15.8719 -1.08 15.5201 -1.4318 15.32 -1.9L14.12 -3.73Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary-600">Call Us</h3>
              </div>
              <p className="text-gray-700"><a href="tel:+1234567890" className="text-secondary hover:underline font-medium">+1 (234) 567-890</a></p>
            </div>

            <div className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 21 12 22 12 22S22 21 22 12C22 6.48 17.52 2 12 2M12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary-600">Visit Us</h3>
              </div>
              <p className="text-gray-700">123 Education Lane<br/>Learning City, LC 12345</p>
            </div>

            <div className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2M12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20M12.5 7H11V13L16.2 16.4L17 15.3L12.5 12.3V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-primary-600">Business Hours</h3>
              </div>
              <p className="text-gray-700">Mon - Fri: 9:00 AM - 6:00 PM<br/>Sat: 10:00 AM - 4:00 PM<br/>Sun: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-primary-600 mb-2">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-primary-600 mb-2">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-primary-600 mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-primary-600 mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                rows="6"
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-secondary text-white font-semibold py-3 rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
            >
              Send Message
            </button>

            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Thank you! Your message has been sent successfully.</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactUsPage;

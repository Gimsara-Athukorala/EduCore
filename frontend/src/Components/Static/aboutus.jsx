// AboutUsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Users, 
  Award, 
  BookOpen, 
  Globe, 
  Coffee,
  Heart,
  Target,
  Lightbulb,
  ChevronRight,
  Clock,
  School,
  Library,
  Utensils,
  Bus,
  Wifi,
  Shield,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

function AboutUsPage() {
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // University campus images for slideshow
  const campusImages = [
    {
      url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920&h=800&fit=crop",
      title: "Main Campus Building",
      caption: "State-of-the-art academic facilities"
    },
    {
      url: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920&h=800&fit=crop",
      title: "University Library",
      caption: "Extensive collection of resources"
    },
    {
      url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&h=800&fit=crop",
      title: "Student Life",
      caption: "Vibrant campus community"
    },
    {
      url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&h=800&fit=crop",
      title: "Modern Classrooms",
      caption: "Innovative learning spaces"
    },
    {
      url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1920&h=800&fit=crop",
      title: "Campus Grounds",
      caption: "Beautiful green spaces"
    }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % campusImages.length);
  }, [campusImages.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + campusImages.length) % campusImages.length);
  }, [campusImages.length]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Hero Section with Slideshow Background */}
      <div className="relative h-[90vh] min-h-[600px] overflow-hidden">
        {/* Slideshow Images */}
        {campusImages.map((image, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlideIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${image.url})` }}
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}

        {/* Slideshow Navigation Buttons */}
        <button 
          onClick={() => { setIsAutoPlaying(false); prevSlide(); setTimeout(() => setIsAutoPlaying(true), 10000); }} 
          className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-white/20 text-white rounded-full p-3 transition z-20 backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => { setIsAutoPlaying(false); nextSlide(); setTimeout(() => setIsAutoPlaying(true), 10000); }}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-white/20 text-white rounded-full p-3 transition z-20 backdrop-blur-sm"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>

        {/* Slideshow Dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
          {campusImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setIsAutoPlaying(false); setCurrentSlideIndex(idx); setTimeout(() => setIsAutoPlaying(true), 10000); }}
              className={`transition-all ${
                idx === currentSlideIndex 
                  ? "bg-white w-8 h-2 rounded-full" 
                  : "bg-white/50 w-2 h-2 rounded-full hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Slideshow Caption */}
        <div className="absolute bottom-20 left-0 right-0 text-center z-20">
          <div className="inline-block bg-black/50 backdrop-blur-md rounded-full px-6 py-2">
            <p className="text-white text-sm font-medium">
              {campusImages[currentSlideIndex].caption}
            </p>
          </div>
        </div>

       

        {/* Hero Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center text-center z-10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Heart className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Est. 2025</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">About EduCore University</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Shaping the future through innovative education, research, and community engagement
            </p>
          </div>
        </div>
      </div>

      <main>
        {/* Mission & Vision Section */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#1E3A8A]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-[#1E3A8A]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">Our Mission</h2>
              <p className="text-[#4B5563] leading-relaxed">
                To provide transformative education that empowers students to become innovative leaders, 
                critical thinkers, and responsible global citizens who contribute meaningfully to society.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#3B82F6]/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-[#3B82F6]" />
              </div>
              <h2 className="text-2xl font-bold text-[#1F2937] mb-4">Our Vision</h2>
              <p className="text-[#4B5563] leading-relaxed">
                To be a globally recognized institution of higher education, renowned for academic excellence, 
                groundbreaking research, and fostering a culture of innovation and inclusivity.
              </p>
            </div>
          </div>
        </div>

        {/* University Overview */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1F2937] mb-4">Welcome to EduCore University</h2>
              <p className="text-[#4B5563] max-w-3xl mx-auto">
                EduCore University is a premier institution dedicated to nurturing talent, fostering innovation, 
                and creating opportunities for students to excel in their chosen fields.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6">
                <div className="bg-[#1E3A8A]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-[#1E3A8A]" />
                </div>
                <h3 className="text-3xl font-bold text-[#1F2937] mb-2">10,000+</h3>
                <p className="text-[#4B5563]">Active Students</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-[#3B82F6]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-10 h-10 text-[#3B82F6]" />
                </div>
                <h3 className="text-3xl font-bold text-[#1F2937] mb-2">500+</h3>
                <p className="text-[#4B5563]">Expert Faculty</p>
              </div>
              <div className="text-center p-6">
                <div className="bg-[#1E3A8A]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-[#1E3A8A]" />
                </div>
                <h3 className="text-3xl font-bold text-[#1F2937] mb-2">50+</h3>
                <p className="text-[#4B5563]">Academic Programs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Campus Location & Map */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[#1F2937] mb-6">Our Campus</h2>
              <p className="text-[#4B5563] mb-6 leading-relaxed">
                Located in the heart of the city, EduCore University's campus spans 50 acres of lush greenery, 
                featuring state-of-the-art facilities, modern classrooms, and vibrant student spaces designed 
                to inspire learning and creativity.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#3B82F6] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#1F2937]">Address</h4>
                    <p className="text-[#4B5563]">123 Education Avenue, Colombo 07, Sri Lanka</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#3B82F6] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#1F2937]">Contact</h4>
                    <p className="text-[#4B5563]">+94 11 234 5678 | +94 11 234 5679</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#3B82F6] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#1F2937]">Email</h4>
                    <p className="text-[#4B5563]">info@educore.edu.lk | admissions@educore.edu.lk</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#3B82F6] mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[#1F2937]">Office Hours</h4>
                    <p className="text-[#4B5563]">Monday - Friday: 8:30 AM - 5:00 PM | Saturday: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Simple Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-6 py-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Campus Location
                </h3>
              </div>
              <div className="p-4">
                <div className="bg-gray-100 rounded-xl overflow-hidden aspect-video relative">
                  {/* Embedded Map - OpenStreetMap (free alternative) */}
                  <iframe
                    title="EduCore University Campus Location"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=79.846%2C6.907%2C79.886%2C6.927&layer=mapnik&marker=6.917%2C79.866"
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 text-center">
                  <a 
                    href="https://www.openstreetmap.org/?mlat=6.917&mlon=79.866#map=15/6.917/79.866"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#3B82F6] hover:text-[#1E3A8A] transition-colors text-sm"
                  >
                    <Globe className="w-4 h-4" />
                    View Larger Map
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Campus Facilities */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-[#1F2937] text-center mb-12">Campus Facilities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { icon: Library, name: "Modern Library", desc: "50,000+ books & digital resources" },
                { icon: School, name: "Smart Classrooms", desc: "Tech-enabled learning spaces" },
                { icon: Utensils, name: "Student Cafeteria", desc: "Healthy & affordable meals" },
                { icon: Bus, name: "Transport Service", desc: "Convenient campus shuttles" },
                { icon: Wifi, name: "High-Speed WiFi", desc: "Campus-wide connectivity" },
                { icon: Users, name: "Student Lounges", desc: "Collaborative spaces" },
                { icon: Coffee, name: "Coffee Shops", desc: "Study-friendly cafes" },
                { icon: Shield, name: "24/7 Security", desc: "Safe campus environment" }
              ].map((facility, index) => (
                <div key={index} className="text-center p-4 hover:shadow-lg rounded-xl transition-shadow">
                  <div className="bg-[#1E3A8A]/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                    <facility.icon className="w-7 h-7 text-[#1E3A8A]" />
                  </div>
                  <h4 className="font-semibold text-[#1F2937] mb-1">{facility.name}</h4>
                  <p className="text-xs text-[#4B5563]">{facility.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-[#1F2937] text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="bg-[#1E3A8A]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#1E3A8A]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3">Academic Excellence</h3>
              <p className="text-[#4B5563]">Maintaining the highest standards in education and research</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="bg-[#3B82F6]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-[#3B82F6]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3">Inclusivity</h3>
              <p className="text-[#4B5563]">Creating a diverse and welcoming environment for all</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="bg-[#1E3A8A]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-[#1E3A8A]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-3">Innovation</h3>
              <p className="text-[#4B5563]">Encouraging creative thinking and entrepreneurial spirit</p>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-white/90 mb-8">
              Have questions about EduCore University? We'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-[#1E3A8A] px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Send a Message
              </button>
              <button className="bg-white/20 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Call Us
              </button>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}

export default AboutUsPage;
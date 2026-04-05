// LostItemsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Package, 
  Upload, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Flag,
  Clock,
  Users,
  Target,
  BookOpen,
  Smartphone,
  Wallet,
  Coffee,
  Camera,
  CheckCircle,
  AlertCircle,
  Loader,
  Phone,
  Filter
} from 'lucide-react';

function LostItemsPage() {
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showAllItems, setShowAllItems] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [lostItems, setLostItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDateTab, setActiveDateTab] = useState('thisweek');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    contactNumber: "",
    itemName: "",
    category: "",
    location: "",
    date: "",
    description: "",
    image: null,
  });

  const [errors, setErrors] = useState({});

  // Fetch lost items from backend
  useEffect(() => {
    fetchLostItems();
  }, []);

  const fetchLostItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/lost-items');
      const data = await response.json();
      if (data.success) {
        setLostItems(data.data);
      } else {
        console.error('Failed to fetch items:', data.message);
      }
    } catch (error) {
      console.error('Error fetching lost items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter items by date
  const filterItemsByDate = (items) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);
    
    const endOfLastWeek = new Date(startOfWeek);
    endOfLastWeek.setDate(startOfWeek.getDate() - 1);
    endOfLastWeek.setHours(23, 59, 59, 999);
    
    return items.filter(item => {
      const itemDate = new Date(item.date);
      
      if (activeDateTab === 'thisweek') {
        return itemDate >= startOfWeek;
      } else if (activeDateTab === 'lastweek') {
        return itemDate >= startOfLastWeek && itemDate <= endOfLastWeek;
      } else {
        return itemDate < startOfLastWeek;
      }
    });
  };

  // Filter by search and category
  const filterItemsBySearch = (items) => {
    return items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };

  // Get filtered items
  const getFilteredItems = () => {
    const dateFiltered = filterItemsByDate(lostItems);
    const searchFiltered = filterItemsBySearch(dateFiltered);
    return searchFiltered;
  };

  const filteredItems = getFilteredItems();
  const displayedItems = showAllItems ? filteredItems : filteredItems.slice(0, 6);

  // Featured items for slideshow (latest 5 items)
  const featuredItems = [...lostItems].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  const nextSlide = useCallback(() => {
    if (featuredItems.length === 0) return;
    setCurrentSlideIndex((prev) => (prev + 1) % featuredItems.length);
  }, [featuredItems.length]);

  const prevSlide = useCallback(() => {
    if (featuredItems.length === 0) return;
    setCurrentSlideIndex((prev) => (prev - 1 + featuredItems.length) % featuredItems.length);
  }, [featuredItems.length]);

  useEffect(() => {
    if (!isAutoPlaying || featuredItems.length === 0) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, featuredItems.length]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Full name can only contain letters and spaces";
    }
    
    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    } else {
      const studentIdPattern = /^STU\d{10}$/i;
      if (!studentIdPattern.test(formData.studentId.trim())) {
        newErrors.studentId = "Student ID must begin with 'STU' followed by exactly 10 digits (e.g., STU2024123456)";
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email required";
    }
    
    if (formData.contactNumber && formData.contactNumber.trim()) {
      const contactPattern = /^(\+94|94|0)?[0-9]{9,10}$/;
      if (!contactPattern.test(formData.contactNumber.trim().replace(/\s/g, ''))) {
        newErrors.contactNumber = "Valid contact number required (e.g., 0712345678, +94712345678, or 94712345678)";
      }
    }
    
    if (!formData.itemName.trim()) {
      newErrors.itemName = "Item name is required";
    }
    
    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    if (!formData.date) {
      newErrors.date = "Date found is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        newErrors.date = "Future dates are not allowed";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const formDataToSend = new FormData();
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('studentId', formData.studentId);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('contactNumber', formData.contactNumber);
    formDataToSend.append('itemName', formData.itemName);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('date', formData.date);
    formDataToSend.append('description', formData.description);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/lost-items', {
        method: 'POST',
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowReportModal(false);
          setFormData({ 
            fullName: "", 
            studentId: "",
            email: "", 
            contactNumber: "",
            itemName: "", 
            category: "", 
            location: "", 
            date: "", 
            description: "", 
            image: null 
          });
          setImagePreview(null);
          setSubmitSuccess(false);
          setIsSubmitting(false);
          fetchLostItems();
        }, 2000);
      } else {
        alert(data.message || 'Error submitting report');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting report. Please check your connection and try again.');
      setIsSubmitting(false);
    }
  };

  const handleFoundThis = () => {
    navigate('/found-items', { state: { openFoundModal: true } });
  };

  const categories = ["All", "Electronics", "Books", "Personal Belongings", "Accessories", "Documents", "Clothing", "Other"];

  // Get count for each date tab
  const getThisWeekCount = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return lostItems.filter(item => new Date(item.date) >= startOfWeek).length;
  };

  const getLastWeekCount = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfWeek);
    endOfLastWeek.setDate(startOfWeek.getDate() - 1);
    endOfLastWeek.setHours(23, 59, 59, 999);
    return lostItems.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startOfLastWeek && itemDate <= endOfLastWeek;
    }).length;
  };

  const getOlderCount = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);
    return lostItems.filter(item => new Date(item.date) < startOfLastWeek).length;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-[#1E3A8A] mx-auto mb-4" />
          <p className="text-gray-600">Loading lost items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-[#FFFFFF] p-2.5 rounded-xl shadow-lg">
                <Search className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">CampusLost & Found</h1>
                <p className="text-white/70 text-xs">Reuniting students with their belongings</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowReportModal(true)}
                className="bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full text-white text-sm font-medium hover:bg-white/20 transition flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Report Lost
              </button>
              <button 
                onClick={() => navigate('/found-items')}
                className="bg-[#FFFFFF] px-5 py-2 rounded-full text-[#1E3A8A] text-sm font-semibold hover:bg-white/90 transition flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                View Found Items
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#3B82F6]/10 rounded-full px-4 py-1.5 mb-4">
            <Flag className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-[#3B82F6] text-sm font-medium">{lostItems.length} items reported</span>
          </div>
          <h2 className="text-5xl font-bold text-[#1F2937] mb-4">
            Lost Something?{' '}
            <span className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] bg-clip-text text-transparent">
              We're Here to Help
            </span>
          </h2>
          <p className="text-[#4B5563] max-w-2xl mx-auto text-lg">
            Browse recently lost items or report your missing belongings. Our community works together to reunite you with what matters most.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4B5563] w-5 h-5" />
            <input
              type="text"
              placeholder="Search by item name, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent bg-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#1E3A8A] text-white shadow-md'
                    : 'bg-white text-[#4B5563] hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100 inline-flex">
            <button
              onClick={() => setActiveDateTab('thisweek')}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeDateTab === 'thisweek'
                  ? 'bg-[#1E3A8A] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#1E3A8A]'
              }`}
            >
              <Clock className="w-4 h-4" />
              This Week
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeDateTab === 'thisweek' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {getThisWeekCount()}
              </span>
            </button>
            <button
              onClick={() => setActiveDateTab('lastweek')}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeDateTab === 'lastweek'
                  ? 'bg-[#1E3A8A] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#1E3A8A]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Last Week
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeDateTab === 'lastweek' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {getLastWeekCount()}
              </span>
            </button>
            <button
              onClick={() => setActiveDateTab('older')}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeDateTab === 'older'
                  ? 'bg-[#1E3A8A] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#1E3A8A]'
              }`}
            >
              <Package className="w-4 h-4" />
              Older
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeDateTab === 'older' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {getOlderCount()}
              </span>
            </button>
          </div>
        </div>

        {/* Featured Slideshow */}
        {featuredItems.length > 0 && (
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-6 py-4">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Featured Lost Items
                </h2>
              </div>
              <div className="relative">
                <div className="overflow-hidden relative h-[500px] bg-gray-900">
                  {featuredItems.map((item, idx) => (
                    <div
                      key={item._id}
                      className={`absolute inset-0 transition-all duration-700 ${
                        idx === currentSlideIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                    >
                      <img 
                        src={item.imageUrl ? `http://localhost:5000/${item.imageUrl}` : 'https://via.placeholder.com/800x500?text=No+Image'} 
                        alt={item.itemName} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                          <h3 className="text-3xl font-bold mb-2">{item.itemName}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-[#FFFFFF]/90 text-[#1E3A8A] px-3 py-1 rounded-full text-sm font-semibold">
                              {item.category}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {item.location}</p>
                            <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                          </div>
                          <button 
                            onClick={handleFoundThis}
                            className="mt-4 px-6 py-2.5 bg-[#FFFFFF] text-[#1E3A8A] font-semibold rounded-xl hover:bg-white/90 transition flex items-center gap-2"
                          >
                            <Target className="w-4 h-4" />
                            I Found This Item
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {featuredItems.length > 1 && (
                  <>
                    <button onClick={() => { setIsAutoPlaying(false); prevSlide(); setTimeout(() => setIsAutoPlaying(true), 10000); }} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-[#FFFFFF] hover:text-[#1E3A8A] text-white rounded-full p-3 transition">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button onClick={() => { setIsAutoPlaying(false); nextSlide(); setTimeout(() => setIsAutoPlaying(true), 10000); }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-[#FFFFFF] hover:text-[#1E3A8A] text-white rounded-full p-3 transition">
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2">
                      {featuredItems.map((_, idx) => (
                        <button key={idx} onClick={() => { setIsAutoPlaying(false); setCurrentSlideIndex(idx); setTimeout(() => setIsAutoPlaying(true), 10000); }}
                          className={`transition-all ${idx === currentSlideIndex ? "bg-[#FFFFFF] w-8 h-2 rounded-full" : "bg-white/60 w-2 h-2 rounded-full"}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lost Items Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
              <Package className="w-6 h-6 text-[#3B82F6]" />
              Lost Items
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredItems.length} items)
              </span>
            </h2>
            {filteredItems.length > 6 && (
              <button onClick={() => setShowAllItems(!showAllItems)} 
                className="px-5 py-2 bg-[#3B82F6]/10 text-[#3B82F6] font-semibold rounded-xl hover:bg-[#3B82F6]/20 transition">
                {showAllItems ? 'Show Less' : `View All (${filteredItems.length})`}
              </button>
            )}
          </div>
          
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No items found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedItems.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={item.imageUrl ? `http://localhost:5000/${item.imageUrl}` : 'https://via.placeholder.com/400x300?text=No+Image'} 
                      alt={item.itemName} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-[#FFFFFF] px-3 py-1 rounded-lg text-xs font-bold text-[#1E3A8A] shadow-md">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[#1E3A8A] text-lg mb-2">{item.itemName}</h3>
                    <p className="text-sm text-[#4B5563] mb-3 line-clamp-2">{item.description || 'No description provided'}</p>
                    <div className="space-y-1 mb-3">
                      <p className="flex items-center gap-2 text-xs text-[#4B5563]"><MapPin className="w-3 h-3" /> {item.location}</p>
                      <p className="flex items-center gap-2 text-xs text-[#4B5563]"><Calendar className="w-3 h-3" /> {new Date(item.date).toLocaleDateString()}</p>
                    </div>
                    <button 
                      onClick={handleFoundThis}
                      className="w-full py-2.5 bg-[#3B82F6]/10 text-[#3B82F6] font-semibold rounded-xl hover:bg-[#3B82F6] hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Target className="w-4 h-4" />
                      I Found This
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] rounded-3xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">{Math.round((lostItems.filter(i => new Date(i.date) >= new Date(new Date().setDate(new Date().getDate() - 7))).length / Math.max(lostItems.length, 1)) * 100)}%</div>
              <div className="text-white/90">This Week</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{lostItems.length}</div>
              <div className="text-white/90">Total Items</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{getThisWeekCount()}</div>
              <div className="text-white/90">New This Week</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24hrs</div>
              <div className="text-white/90">Avg Response Time</div>
            </div>
          </div>
        </div>
      </main>

      {/* Report Lost Item Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-6 py-4 flex justify-between items-center">
              <h2 className="text-white text-xl font-bold flex items-center gap-2"><Package className="w-5 h-5" /> Report Lost Item</h2>
              <button onClick={() => setShowReportModal(false)} className="text-white hover:bg-white/20 rounded-full p-2"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                      setFormData({...formData, fullName: value});
                    }}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" 
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Student ID *</label>
                  <input 
                    type="text" 
                    name="studentId" 
                    value={formData.studentId} 
                    onChange={(e) => {
                      let value = e.target.value.toUpperCase();
                      if (value.length <= 3) {
                        value = value.replace(/[^STU]/gi, '');
                      } else {
                        const prefix = value.slice(0, 3);
                        const numbers = value.slice(3).replace(/[^0-9]/g, '');
                        value = prefix + numbers.slice(0, 10);
                      }
                      setFormData({...formData, studentId: value});
                    }}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" 
                    placeholder="STU2024123456"
                  />
                  {errors.studentId && <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Email *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" 
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Contact Number</label>
                  <input 
                    type="tel" 
                    name="contactNumber" 
                    value={formData.contactNumber} 
                    onChange={(e) => {
                      let value = e.target.value;
                      value = value.replace(/[^\d+\s]/g, '');
                      setFormData({...formData, contactNumber: value});
                    }}
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" 
                    placeholder="e.g., 0712345678 or +94712345678"
                  />
                  <p className="text-gray-400 text-xs mt-1">Optional - Format: 07XXXXXXXX, +947XXXXXXXX, or 947XXXXXXXX</p>
                  {errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Item Name *</label>
                  <input 
                    type="text" 
                    name="itemName" 
                    value={formData.itemName} 
                    onChange={(e) => setFormData({...formData, itemName: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" 
                  />
                  {errors.itemName && <p className="text-red-500 text-xs mt-1">{errors.itemName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Category *</label>
                  <select 
                    name="category" 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
                  >
                    <option value="">Select Category</option>
                    {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Location *</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={(e) => setFormData({...formData, location: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" 
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Date Lost *</label>
                <input 
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={(e) => setFormData({...formData, date: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" 
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Upload Image</label>
                <div className="border-2 border-dashed rounded-xl p-4 text-center">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="img" />
                  <label htmlFor="img" className="cursor-pointer flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-[#3B82F6]">Click to upload</span>
                  </label>
                  {imagePreview && <img src={imagePreview} className="mt-2 max-h-32 mx-auto rounded" alt="Preview" />}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea 
                  rows="3" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" 
                  placeholder="Color, brand, distinctive marks..."
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Loader className="w-5 h-5 animate-spin" /> Submitting...</> : <><Package className="w-5 h-5" /> Submit Lost Item Report</>}
              </button>
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Report submitted successfully! It will be reviewed by admin.
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <footer className="bg-white border-t mt-12 py-6 text-center text-sm text-gray-500">
        <p>© 2025 Student Support & Engagement Platform | Calm & Trust Initiative</p>
      </footer>
    </div>
  );
}

export default LostItemsPage;
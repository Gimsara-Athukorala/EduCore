// FoundItemsPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
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
  Building,
  Award,
  Filter,
  User,
  CreditCard,
  Image as ImageIcon,
  Info,
  ExternalLink,
  Shield
} from 'lucide-react';

import { useLocation, useNavigate } from 'react-router-dom';

function FoundItemsPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showAllItems, setShowAllItems] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('student');
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    email: "",
    itemName: "",
    category: "",
    location: "",
    date: "",
    description: "",
    image: null,
    foundBy: "student",
    contactNumber: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch found items from backend
  useEffect(() => {
    fetchFoundItems();
  }, [activeTab, searchTerm, selectedCategory]);

  const fetchFoundItems = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/found-items?foundBy=${activeTab}`;
      if (selectedCategory !== 'All') {
        url += `&category=${selectedCategory}`;
      }
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setFoundItems(data.data);
      } else {
        console.error('Failed to fetch items:', data.message);
      }
    } catch (error) {
      console.error('Error fetching found items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search and category (backend already does filtering)
  const filteredItems = foundItems;
  const displayedItems = showAllItems ? filteredItems : filteredItems.slice(0, 6);

  // Featured items for slideshow (management found items with available status)
  const featuredItems = foundItems.filter(item => 
    item.foundBy === 'management' && item.status === 'approved'
  ).slice(0, 5);

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
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email required";
    }
    
    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    } else {
      const studentIdPattern = /^STU\d{10}$/i;
      if (!studentIdPattern.test(formData.studentId.trim())) {
        newErrors.studentId = "Student ID must begin with 'STU' followed by exactly 10 digits (e.g., STU2024123456)";
      }
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
    formDataToSend.append('foundBy', formData.foundBy);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/found-items', {
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
            itemName: "", 
            category: "", 
            location: "", 
            date: "", 
            description: "", 
            image: null,
            foundBy: "student",
            contactNumber: "",
          });
          setImagePreview(null);
          setSubmitSuccess(false);
          setIsSubmitting(false);
          fetchFoundItems(); // Refresh the list
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

  const handleClaimItem = (item) => {
    navigate(`/claim-item/${item._id}`, { state: { item } });
  };

  const categories = ["All", "Electronics", "Books", "Personal", "Accessories", "Documents", "Clothing", "Other"];

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-green-100 text-green-700",
      claimed: "bg-yellow-100 text-yellow-700",
      returned: "bg-blue-100 text-blue-700",
      pending: "bg-gray-100 text-gray-700",
      rejected: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-[#1E3A8A] mx-auto mb-4" />
          <p className="text-gray-600">Loading found items...</p>
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
                <Package className="w-6 h-6 text-[#1E3A8A]" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">Found Items Center</h1>
                <p className="text-white/70 text-xs">Helping lost items find their way home</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowReportModal(true)}
                className="bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full text-white text-sm font-medium hover:bg-white/20 transition flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Report Found Item
              </button>
              <a href="/lost-items" className="bg-[#FFFFFF] px-5 py-2 rounded-full text-[#1E3A8A] text-sm font-semibold hover:bg-white/90 transition flex items-center gap-2">
                <Search className="w-4 h-4" />
                View Lost Items
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#3B82F6]/10 rounded-full px-4 py-1.5 mb-4">
            <CheckCircle className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-[#3B82F6] text-sm font-medium">Items found and waiting to be reunited</span>
          </div>
          <h2 className="text-5xl font-bold text-[#1F2937] mb-4">
            Found Something?{' '}
            <span className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] bg-clip-text text-transparent">
              Help Reunite It
            </span>
          </h2>
          <p className="text-[#4B5563] max-w-2xl mx-auto text-lg">
            Browse found items reported by students and university management. 
            If you've lost something, check here first or report a found item to help others.
          </p>
        </div>

        {/* Tabs - Student Found vs Management Found */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-md flex">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                activeTab === 'student' 
                  ? 'bg-[#1E3A8A] text-white shadow-md' 
                  : 'text-[#4B5563] hover:text-[#1E3A8A]'
              }`}
            >
              <Users className="w-4 h-4" />
              Found by Students
            </button>
            <button
              onClick={() => setActiveTab('management')}
              className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                activeTab === 'management' 
                  ? 'bg-[#FFFFFF] text-[#1E3A8A] shadow-md border border-[#1E3A8A]/20' 
                  : 'text-[#4B5563] hover:text-[#1E3A8A]'
              }`}
            >
              <Building className="w-4 h-4" />
              Found by University Management
            </button>
          </div>
        </div>

        {/* Special Management Section */}
        {activeTab === 'management' && (
          <div className="mb-12 bg-gradient-to-r from-[#3B82F6]/10 to-[#3B82F6]/5 rounded-2xl p-6 border border-[#3B82F6]/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#FFFFFF] p-2 rounded-xl shadow-md">
                <Shield className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1F2937]">University Management Found Items</h3>
                <p className="text-sm text-[#4B5563]">Officially collected and stored items - ready for claim at designated offices</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-3">
                <Clock className="w-4 h-4 text-[#3B82F6]" />
                <span>Items held for <strong>30 days</strong> before donation</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-3">
                <MapPin className="w-4 h-4 text-[#3B82F6]" />
                <span>Claim at: <strong>Campus Security Office</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-3">
                <CreditCard className="w-4 h-4 text-[#3B82F6]" />
                <span>Bring <strong>Student ID</strong> for verification</span>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4B5563] w-5 h-5" />
            <input
              type="text"
              placeholder="Search by item name, description, or student ID..."
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

        {/* Featured Slideshow */}
        {activeTab === 'management' && featuredItems.length > 0 && (
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-6 py-4">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Featured Found Items (Management)
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
                      <img src={`http://localhost:5000/${item.imageUrl}`} alt={item.itemName} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                          <h3 className="text-3xl font-bold mb-2">{item.itemName}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-[#FFFFFF]/90 text-[#1E3A8A] px-3 py-1 rounded-full text-sm font-semibold">
                              {item.category}
                            </span>
                            <span className={`${getStatusBadge(item.status)} px-3 py-1 rounded-full text-sm font-semibold`}>
                              {item.status}
                            </span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {item.location}</p>
                            <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Found: {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            {item.claimDeadline && (
                              <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> Claim by: {new Date(item.claimDeadline).toLocaleDateString()}</p>
                            )}
                          </div>
                          <button 
                            onClick={() => handleClaimItem(item)}
                            className="mt-4 px-6 py-2.5 bg-[#FFFFFF] text-[#1E3A8A] font-semibold rounded-xl hover:bg-white/90 transition flex items-center gap-2"
                          >
                            <Target className="w-4 h-4" />
                            Claim This Item
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

        {/* Found Items Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#1F2937] flex items-center gap-2">
              {activeTab === 'student' ? (
                <Users className="w-6 h-6 text-[#3B82F6]" />
              ) : (
                <Building className="w-6 h-6 text-[#3B82F6]" />
              )}
              {activeTab === 'student' ? 'Found by Students' : 'Found by University Management'}
              <span className="text-sm font-normal text-[#4B5563] ml-2">({filteredItems.length} items)</span>
            </h2>
            <button onClick={() => setShowAllItems(!showAllItems)} 
              className="px-5 py-2 bg-[#3B82F6]/10 text-[#3B82F6] font-semibold rounded-xl hover:bg-[#3B82F6]/20 transition">
              {showAllItems ? 'Show Less' : `View All (${filteredItems.length})`}
            </button>
          </div>
          
          {displayedItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#1F2937] mb-2">No items found</h3>
              <p className="text-[#4B5563]">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedItems.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group">
                  <div className="relative h-56 overflow-hidden">
                    <img src={`http://localhost:5000/${item.imageUrl}`} alt={item.itemName} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className="bg-[#FFFFFF] px-3 py-1 rounded-lg text-xs font-bold text-[#1E3A8A] shadow-md">
                        {item.category}
                      </span>
                      <span className={`${getStatusBadge(item.status)} px-3 py-1 rounded-lg text-xs font-bold`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      {item.foundBy === 'management' ? (
                        <span className="bg-[#1E3A8A]/80 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                          <Building className="w-3 h-3" /> Management
                        </span>
                      ) : (
                        <span className="bg-[#3B82F6]/80 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                          <Users className="w-3 h-3" /> Student
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-[#1E3A8A] text-lg mb-2">{item.itemName}</h3>
                    <p className="text-sm text-[#4B5563] mb-3 line-clamp-2">{item.description}</p>
                    <div className="space-y-1 mb-3">
                      <p className="flex items-center gap-2 text-xs text-[#4B5563]"><MapPin className="w-3 h-3" /> {item.location}</p>
                      <p className="flex items-center gap-2 text-xs text-[#4B5563]"><Calendar className="w-3 h-3" /> Found: {new Date(item.date).toLocaleDateString()}</p>
                      {item.studentId && (
                        <p className="flex items-center gap-2 text-xs text-[#4B5563]"><User className="w-3 h-3" /> Student ID: {item.studentId}</p>
                      )}
                    </div>
                    <button 
                      onClick={() => handleClaimItem(item)}
                      disabled={item.status !== 'approved'}
                      className={`w-full py-2.5 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                        item.status === 'approved'
                          ? 'bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {item.status === 'claimed' ? 'Claim Pending' : 
                       item.status === 'returned' ? 'Already Returned' : 
                       item.status === 'approved' ? 'Claim This Item' : 'Not Available'}
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
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-white/90">Return Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{foundItems.length}</div>
              <div className="text-white/90">Active Items</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {foundItems.filter(i => i.status === 'claimed').length}
              </div>
              <div className="text-white/90">Pending Claims</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15</div>
              <div className="text-white/90">Avg Days to Return</div>
            </div>
          </div>
        </div>
      </main>

      {/* Report Found Item Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] px-6 py-4 flex justify-between items-center">
              <h2 className="text-white text-xl font-bold flex items-center gap-2">
                <Upload className="w-5 h-5" /> Report Found Item
              </h2>
              <button onClick={() => setShowReportModal(false)} className="text-white hover:bg-white/20 rounded-full p-2">
                <X className="w-5 h-5" />
              </button>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Location Found *</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={(e) => setFormData({...formData, location: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" 
                    placeholder="Building, room, area"
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Date Found *</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={(e) => setFormData({...formData, date: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B82F6]" 
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Found By *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="foundBy"
                      value="student"
                      checked={formData.foundBy === 'student'}
                      onChange={(e) => setFormData({...formData, foundBy: e.target.value})}
                      className="w-4 h-4 text-[#1E3A8A]"
                    />
                    <span>Student</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="foundBy"
                      value="management"
                      checked={formData.foundBy === 'management'}
                      onChange={(e) => setFormData({...formData, foundBy: e.target.value})}
                      className="w-4 h-4 text-[#1E3A8A]"
                    />
                    <span>University Management</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Upload Image</label>
                <div className="border-2 border-dashed rounded-xl p-4 text-center">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="foundImg" />
                  <label htmlFor="foundImg" className="cursor-pointer flex flex-col items-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-[#3B82F6]">Click to upload image of found item</span>
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
                  placeholder="Color, brand, distinctive marks, where exactly found..."
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <><Loader className="w-5 h-5 animate-spin" /> Submitting...</> : <><Upload className="w-5 h-5" /> Submit Found Item Report</>}
              </button>
              {submitSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Thank you for helping! Your report has been submitted and will be reviewed by admin.
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      <footer className="bg-white border-t mt-12 py-6 text-center text-sm text-gray-500">
        <p>© 2025 Student Support & Engagement Platform | Calm & Trust Initiative | Found Items Center</p>
      </footer>
    </div>
  );
}

export default FoundItemsPage;
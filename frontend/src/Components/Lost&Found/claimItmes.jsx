import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Package,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader,
  User,
  CreditCard,
  Mail,
  Phone,
  Clock,
  FileText,
  Fingerprint,
  ClipboardList,
  Building,
  Info
} from 'lucide-react';

function ClaimItemPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [claimErrors, setClaimErrors] = useState({});

  const [claimFormData, setClaimFormData] = useState({
    claimantFullName: "",
    claimantStudentId: "",
    claimantEmail: "",
    claimantContactNumber: "",
    idProofType: "",
    idProofNumber: "",
    additionalNotes: "",
    agreedToTerms: false
  });

  // Fetch item from backend
  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/found-items/${itemId}`);
      const data = await response.json();
      
      if (data.success) {
        setItem(data.data);
      } else {
        setError(data.message || 'Item not found');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      setError('Failed to load item details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateClaimForm = () => {
    const newErrors = {};
    
    if (!claimFormData.claimantFullName.trim()) {
      newErrors.claimantFullName = "Full name is required";
    } else if (!/^[A-Za-z\s]+$/.test(claimFormData.claimantFullName.trim())) {
      newErrors.claimantFullName = "Name can only contain letters and spaces";
    }
    
    if (!claimFormData.claimantStudentId.trim()) {
      newErrors.claimantStudentId = "Student ID is required";
    } else {
      const studentIdPattern = /^STU\d{10}$/i;
      if (!studentIdPattern.test(claimFormData.claimantStudentId.trim())) {
        newErrors.claimantStudentId = "Student ID must begin with 'STU' followed by exactly 10 digits (e.g., STU2024123456)";
      }
    }
    
    if (!claimFormData.claimantEmail.trim()) {
      newErrors.claimantEmail = "Email is required";
    } else if (!/^[^\s@]+@([^\s@]+\.)+[^\s@]+$/.test(claimFormData.claimantEmail)) {
      newErrors.claimantEmail = "Valid email required";
    }
    
    if (claimFormData.claimantContactNumber && claimFormData.claimantContactNumber.trim()) {
      const contactPattern = /^(\+94|94|0)?[0-9]{9,10}$/;
      if (!contactPattern.test(claimFormData.claimantContactNumber.trim().replace(/\s/g, ''))) {
        newErrors.claimantContactNumber = "Valid contact number required (e.g., 0712345678, +94712345678)";
      }
    }
    
    if (!claimFormData.idProofType) {
      newErrors.idProofType = "Please select ID proof type";
    }
    
    if (!claimFormData.idProofNumber.trim()) {
      newErrors.idProofNumber = "ID proof number is required";
    }
    
    if (!claimFormData.agreedToTerms) {
      newErrors.agreedToTerms = "You must agree to the terms and conditions";
    }
    
    setClaimErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    if (!validateClaimForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: itemId,
          claimantFullName: claimFormData.claimantFullName,
          claimantStudentId: claimFormData.claimantStudentId,
          claimantEmail: claimFormData.claimantEmail,
          claimantContactNumber: claimFormData.claimantContactNumber,
          idProofType: claimFormData.idProofType,
          idProofNumber: claimFormData.idProofNumber,
          additionalNotes: claimFormData.additionalNotes
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/found-items');
        }, 3000);
      } else {
        alert(data.message || 'Error submitting claim');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Error submitting claim. Please try again.');
      setIsSubmitting(false);
    }
  };

  const idProofTypes = ["Student ID Card", "National ID Card", "Driver's License", "Passport", "Other"];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FBFD] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#1A4D8C] mx-auto mb-4" />
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#F9FBFD] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">Item Not Found</h2>
          <p className="text-[#5A7D9A] mb-6">
            {error || "The item you're trying to claim doesn't exist, has been claimed already, or has been removed."}
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/found-items')}
              className="w-full px-6 py-3 bg-[#1A4D8C] text-white rounded-xl hover:bg-[#4A90E2] transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Found Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isDeadlinePassed = item.claimDeadline && new Date(item.claimDeadline) < new Date();
  const daysRemaining = item.claimDeadline ? Math.ceil((new Date(item.claimDeadline) - new Date()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="min-h-screen bg-[#F9FBFD]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1A4D8C] to-[#4A90E2] shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-[#F5A623] p-2.5 rounded-xl shadow-lg">
                <Package className="w-6 h-6 text-[#1A4D8C]" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">Claim Your Item</h1>
                <p className="text-white/70 text-xs">Complete the form to claim your lost item</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/found-items')}
              className="bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full text-white text-sm font-medium hover:bg-white/20 transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Found Items
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Check if item is still available */}
        {item.status !== 'approved' ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center mb-8">
            <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-yellow-800 mb-2">Item Not Available</h3>
            <p className="text-yellow-700 mb-4">
              This item has already been {item.status === 'claimed' ? 'claimed' : item.status === 'returned' ? 'returned' : 'processed'} and is no longer available for claim.
            </p>
            <button 
              onClick={() => navigate('/found-items')}
              className="px-6 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition"
            >
              Browse Other Items
            </button>
          </div>
        ) : isDeadlinePassed ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center mb-8">
            <Clock className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">Claim Deadline Passed</h3>
            <p className="text-red-700 mb-4">
              The claim deadline for this item has passed. Please contact the university management for assistance.
            </p>
            <button 
              onClick={() => navigate('/found-items')}
              className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
            >
              Browse Other Items
            </button>
          </div>
        ) : (
          <>
            {/* Item Details Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
              <div className="md:flex">
                <div className="md:w-1/3 h-64 md:h-auto">
                  <img 
                    src={`http://localhost:5000/${item.imageUrl}`} 
                    alt={item.itemName} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h2 className="text-2xl font-bold text-[#1A4D8C] mb-2">{item.itemName}</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-[#F5A623] px-3 py-1 rounded-full text-xs font-bold text-[#1A4D8C]">
                      {item.category}
                    </span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      Available for Claim
                    </span>
                  </div>
                  <p className="text-[#5A7D9A] mb-4">{item.description}</p>
                  <div className="space-y-2 text-sm">
                    <p className="flex items-center gap-2 text-[#5A7D9A]">
                      <MapPin className="w-4 h-4" /> Found at: {item.location}
                    </p>
                    <p className="flex items-center gap-2 text-[#5A7D9A]">
                      <Calendar className="w-4 h-4" /> Found on: {new Date(item.date).toLocaleDateString()}
                    </p>
                    {item.claimDeadline && daysRemaining > 0 && (
                      <p className="flex items-center gap-2 text-orange-600 font-semibold">
                        <Clock className="w-4 h-4" /> Claim before: {new Date(item.claimDeadline).toLocaleDateString()} ({daysRemaining} days remaining)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 rounded-full p-2">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-blue-800 text-lg mb-3">Important Instructions for Claiming</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p className="flex items-start gap-2 text-blue-700">
                        <Building className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>Claim Location:</strong> {item.foundBy === 'management' ? 'Campus Security Office' : item.location}</span>
                      </p>
                      <p className="flex items-start gap-2 text-blue-700">
                        <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>Working Hours:</strong> Monday-Friday: 8:00 AM - 5:00 PM</span>
                      </p>
                      <p className="flex items-start gap-2 text-blue-700">
                        <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>Contact:</strong> +94 112 345 678</span>
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="flex items-start gap-2 text-blue-700">
                        <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>Required Documents:</strong> Student ID Card, Proof of Ownership (receipt, photos, etc.)</span>
                      </p>
                      <p className="flex items-start gap-2 text-blue-700">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span><strong>Verification Required:</strong> You must prove ownership by providing accurate details about the item</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Claim Form Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-[#2C3E50] mb-6 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-[#F5A623]" />
                Claim Request Form
              </h3>

              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-6">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Claim Request Submitted Successfully!</h3>
                    <p className="mb-4">Thank you for submitting your claim request. Please visit the claim location with your documents for verification within the next 3 business days.</p>
                    <button 
                      onClick={() => navigate('/found-items')}
                      className="px-6 py-2 bg-[#1A4D8C] text-white rounded-xl hover:bg-[#4A90E2] transition"
                    >
                      Back to Found Items
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleClaimSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
                        <User className="w-4 h-4 inline mr-1" /> Full Name *
                      </label>
                      <input 
                        type="text" 
                        value={claimFormData.claimantFullName}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^A-Za-z\s]/g, '');
                          setClaimFormData({...claimFormData, claimantFullName: value});
                        }}
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623]" 
                        placeholder="Enter your full name"
                      />
                      {claimErrors.claimantFullName && <p className="text-red-500 text-xs mt-1">{claimErrors.claimantFullName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
                        <CreditCard className="w-4 h-4 inline mr-1" /> Student ID *
                      </label>
                      <input 
                        type="text" 
                        value={claimFormData.claimantStudentId}
                        onChange={(e) => {
                          let value = e.target.value.toUpperCase();
                          if (value.length <= 3) {
                            value = value.replace(/[^STU]/gi, '');
                          } else {
                            const prefix = value.slice(0, 3);
                            const numbers = value.slice(3).replace(/[^0-9]/g, '');
                            value = prefix + numbers.slice(0, 10);
                          }
                          setClaimFormData({...claimFormData, claimantStudentId: value});
                        }}
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623]" 
                        placeholder="STU2024123456"
                      />
                      {claimErrors.claimantStudentId && <p className="text-red-500 text-xs mt-1">{claimErrors.claimantStudentId}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
                        <Mail className="w-4 h-4 inline mr-1" /> Email Address *
                      </label>
                      <input 
                        type="email" 
                        value={claimFormData.claimantEmail}
                        onChange={(e) => setClaimFormData({...claimFormData, claimantEmail: e.target.value})}
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623]" 
                        placeholder="your.email@university.edu"
                      />
                      {claimErrors.claimantEmail && <p className="text-red-500 text-xs mt-1">{claimErrors.claimantEmail}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
                        <Phone className="w-4 h-4 inline mr-1" /> Contact Number
                      </label>
                      <input 
                        type="tel" 
                        value={claimFormData.claimantContactNumber}
                        onChange={(e) => {
                          let value = e.target.value;
                          value = value.replace(/[^\d+\s]/g, '');
                          setClaimFormData({...claimFormData, claimantContactNumber: value});
                        }}
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623]" 
                        placeholder="0712345678"
                      />
                      <p className="text-gray-400 text-xs mt-1">Optional - For verification purposes</p>
                      {claimErrors.claimantContactNumber && <p className="text-red-500 text-xs mt-1">{claimErrors.claimantContactNumber}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
                        <Fingerprint className="w-4 h-4 inline mr-1" /> ID Proof Type *
                      </label>
                      <select 
                        value={claimFormData.idProofType}
                        onChange={(e) => setClaimFormData({...claimFormData, idProofType: e.target.value})}
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623]"
                      >
                        <option value="">Select ID Proof Type</option>
                        {idProofTypes.map(type => <option key={type}>{type}</option>)}
                      </select>
                      {claimErrors.idProofType && <p className="text-red-500 text-xs mt-1">{claimErrors.idProofType}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
                        <CreditCard className="w-4 h-4 inline mr-1" /> ID Proof Number *
                      </label>
                      <input 
                        type="text" 
                        value={claimFormData.idProofNumber}
                        onChange={(e) => setClaimFormData({...claimFormData, idProofNumber: e.target.value})}
                        className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623]" 
                        placeholder="Enter your ID number"
                      />
                      {claimErrors.idProofNumber && <p className="text-red-500 text-xs mt-1">{claimErrors.idProofNumber}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-[#2C3E50]">
                      <ClipboardList className="w-4 h-4 inline mr-1" /> Additional Notes / Item Description
                    </label>
                    <textarea 
                      rows="4" 
                      value={claimFormData.additionalNotes}
                      onChange={(e) => setClaimFormData({...claimFormData, additionalNotes: e.target.value})}
                      className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A623]" 
                      placeholder="Provide any additional details that can help verify ownership (color, brand, distinctive marks, serial number, where you lost it, etc.)"
                    />
                    <p className="text-gray-400 text-xs mt-1">This information will help us verify that you are the rightful owner</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={claimFormData.agreedToTerms}
                        onChange={(e) => setClaimFormData({...claimFormData, agreedToTerms: e.target.checked})}
                        className="mt-1 w-4 h-4 text-[#F5A623] rounded focus:ring-[#F5A623]"
                      />
                      <span className="text-sm text-gray-700">
                        I confirm that the information provided is accurate. I understand that I must visit the claim location with my Student ID and required documents. I agree to provide proof of ownership before receiving the item. I acknowledge that false claims may result in disciplinary action.
                      </span>
                    </label>
                    {claimErrors.agreedToTerms && <p className="text-red-500 text-xs mt-2">{claimErrors.agreedToTerms}</p>}
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-gradient-to-r from-[#F5A623] to-[#F5A623]/80 text-[#1A4D8C] font-bold py-3 rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <><Loader className="w-5 h-5 animate-spin" /> Submitting Claim Request...</> : <><CheckCircle className="w-5 h-5" /> Submit Claim Request</>}
                  </button>
                </form>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="bg-white border-t mt-12 py-6 text-center text-sm text-gray-500">
        <p>© 2025 Student Support & Engagement Platform | Calm & Trust Initiative | Claim Your Item</p>
      </footer>
    </div>
  );
}

export default ClaimItemPage;
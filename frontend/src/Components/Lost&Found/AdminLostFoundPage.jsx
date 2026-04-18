import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminToken, logoutAdmin } from '../../utils/adminAuth';
import {
  Package,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Image as ImageIcon,
  AlertCircle,
  Loader,
  Check,
  X,
  RefreshCw,
  Users,
  Building,
  Shield,
  ExternalLink,
  MessageSquare,
  Send,
  TrendingUp,
  Award,
  TrendingDown,
  BarChart3,
  MoreVertical,
  ChevronDown,
  Zap,
  Activity,
  Layers,
  Star,
  Sparkles,
  CreditCard,
  Gift,
  Heart,
  Trash2,
  Edit,
  Plus,
  Upload,
  FileText,
  Fingerprint
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AdminLostFoundPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending-lost');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState(null);
  const [reviewComment, setReviewComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showClaimDetailsModal, setShowClaimDetailsModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  
  const [stats, setStats] = useState({
    pending: { lost: 0, found: 0, claims: 0 },
    approved: { lost: 0, found: 0, claims: 0 },
    returned: 0,
    total: 0,
    acceptanceRate: 0
  });

  const [pendingItems, setPendingItems] = useState({
    lost: [],
    found: [],
    claims: []
  });

  const [acceptedItems, setAcceptedItems] = useState({
    lost: [],
    found: [],
    claims: []
  });

  // Fetch data on load and tab change
  useEffect(() => {
    fetchStats();
    if (activeTab.includes('pending')) {
      fetchPendingItems();
    } else if (activeTab.includes('accepted') || activeTab === 'approved-claims') {
      fetchAcceptedItems();
    }
  }, [activeTab]);

  const adminFetch = async (url, options = {}) => {
    const token = getAdminToken();

    if (!token) {
      logoutAdmin();
      navigate('/admin/login');
      throw new Error('Missing admin token');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      logoutAdmin();
      navigate('/admin/login');
      throw new Error('Session expired. Please login again.');
    }

    return response;
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const getClaimApprovalAlertMessage = (responseData) => {
    const info = responseData?.emailNotification;
    if (!info) {
      return 'Claim approved successfully';
    }

    if (info.sent) {
      return `Claim approved and email sent to ${info.recipient}`;
    }

    if (info.skipped) {
      return `Claim approved, but email was skipped (${info.reason || 'unknown reason'})`;
    }

    if (info.attempted && !info.sent) {
      return `Claim approved, but email failed (${info.reason || 'unknown error'})`;
    }

    if (info.reason) {
      return `Claim approved (${info.reason})`;
    }

    return 'Claim approved successfully';
  };

  const fetchStats = async () => {
    try {
      const response = await adminFetch(`${API_BASE_URL}/api/admin/lost-found/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPendingItems = async () => {
    try {
      const response = await adminFetch(`${API_BASE_URL}/api/admin/lost-found/pending`);
      const data = await response.json();
      if (data.success) {
        setPendingItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching pending items:', error);
    }
  };

  const fetchAcceptedItems = async () => {
    try {
      const response = await adminFetch(`${API_BASE_URL}/api/admin/lost-found/accepted`);
      const data = await response.json();
      if (data.success) {
        setAcceptedItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching accepted items:', error);
    }
  };

  const handleReview = (item, action, type) => {
    setSelectedItem({ ...item, type });
    setReviewAction(action);
    setReviewComment('');
    setShowReviewModal(true);
  };

  const processReview = async () => {
    setIsProcessing(true);
    
    try {
      let endpoint = '';
      let body = {
        status: reviewAction === 'accept' ? 'approved' : 'rejected',
        adminNotes: reviewComment
      };

      if (selectedItem.type === 'lost') {
        endpoint = `${API_BASE_URL}/api/admin/lost-found/lost/${selectedItem._id}`;
      } else if (selectedItem.type === 'found') {
        endpoint = `${API_BASE_URL}/api/admin/lost-found/found/${selectedItem._id}`;
      } else if (selectedItem.type === 'claim') {
        endpoint = `${API_BASE_URL}/api/admin/lost-found/claim/${selectedItem._id}`;
        body.status = reviewAction === 'accept' ? 'approved' : 'rejected';
        if (reviewAction === 'reject') {
          body.rejectionReason = reviewComment;
        }
      }

      const response = await adminFetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchPendingItems();
        await fetchAcceptedItems();
        await fetchStats();
        if (selectedItem.type === 'claim' && reviewAction === 'accept') {
          alert(getClaimApprovalAlertMessage(data));
        } else {
          alert(reviewAction === 'accept' ? 'Item approved successfully' : 'Item rejected successfully');
        }
      } else {
        alert(data.message || 'Error processing review');
      }
    } catch (error) {
      console.error('Error processing review:', error);
      alert('Error processing review');
    }
    
    setIsProcessing(false);
    setShowReviewModal(false);
  };

  const handleDelete = async (item, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    setIsProcessing(true);
    
    try {
      let endpoint = '';
      if (type === 'lost') {
        endpoint = `${API_BASE_URL}/api/admin/lost-found/lost/${item._id}`;
      } else if (type === 'found') {
        endpoint = `${API_BASE_URL}/api/admin/lost-found/found/${item._id}`;
      } else if (type === 'claim') {
        endpoint = `${API_BASE_URL}/api/admin/lost-found/claim/${item._id}`;
      }

      const response = await adminFetch(endpoint, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchPendingItems();
        await fetchAcceptedItems();
        await fetchStats();
        alert('Item deleted successfully');
      } else {
        alert(data.message || 'Error deleting item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item');
    }
    
    setIsProcessing(false);
  };

  const handleMarkReturned = async (item) => {
    setIsProcessing(true);
    
    try {
      const response = await adminFetch(`${API_BASE_URL}/api/admin/lost-found/found/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'returned'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchAcceptedItems();
        await fetchStats();
        alert('Item marked as returned successfully');
      } else {
        alert(data.message || 'Error updating status');
      }
    } catch (error) {
      console.error('Error marking as returned:', error);
      alert('Error updating status');
    }
    
    setIsProcessing(false);
  };

  const handleViewClaimDetails = (claim) => {
    setSelectedClaim(claim);
    setShowClaimDetailsModal(true);
  };

  const handleApproveClaim = async (claim) => {
    setIsProcessing(true);
    
    try {
      const response = await adminFetch(`${API_BASE_URL}/api/admin/lost-found/claim/${claim._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'approved'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchPendingItems();
        await fetchAcceptedItems();
        await fetchStats();
        alert(getClaimApprovalAlertMessage(data));
      } else {
        alert(data.message || 'Error approving claim');
      }
    } catch (error) {
      console.error('Error approving claim:', error);
      alert('Error approving claim');
    }
    
    setIsProcessing(false);
  };

  const handleRejectClaim = async (claim) => {
    const reason = prompt('Please enter reason for rejection:');
    if (reason === null) return;
    
    setIsProcessing(true);
    
    try {
      const response = await adminFetch(`${API_BASE_URL}/api/admin/lost-found/claim/${claim._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'rejected',
          rejectionReason: reason
        })
      });

      const data = await response.json();
      
      if (data.success) {
        await fetchPendingItems();
        await fetchAcceptedItems();
        await fetchStats();
        alert('Claim rejected successfully. Item is now available again.');
      } else {
        alert(data.message || 'Error rejecting claim');
      }
    } catch (error) {
      console.error('Error rejecting claim:', error);
      alert('Error rejecting claim');
    }
    
    setIsProcessing(false);
  };

  const getFilteredItems = () => {
    let items = [];
    if (activeTab === 'pending-lost') {
      items = pendingItems.lost;
    } else if (activeTab === 'pending-found') {
      items = pendingItems.found;
    } else if (activeTab === 'pending-claims') {
      items = pendingItems.claims;
    } else if (activeTab === 'accepted-lost') {
      items = acceptedItems.lost;
    } else if (activeTab === 'accepted-found') {
      items = acceptedItems.found;
    } else if (activeTab === 'approved-claims') {
      items = acceptedItems.claims;
    } else {
      return [];
    }

    if (filterCategory !== 'all') {
      items = items.filter(item => item.category === filterCategory);
    }

    return items.filter(item => 
      (item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.claimantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.claimantStudentId?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const categories = ["all", "Electronics", "Books", "Personal", "Accessories", "Documents", "Clothing", "Other"];
  const filteredItems = getFilteredItems();

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 border border-blue-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-blue-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white border border-blue-100 shadow-sm flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/EduCore_Logo.png"
                  alt="EduCore logo"
                  className="h-9 w-auto object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-500">Lost & Found Management System</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => { fetchStats(); fetchPendingItems(); fetchAcceptedItems(); }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 bg-gray-100 hover:bg-blue-50 rounded-xl transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white bg-[#1E3A8A] hover:bg-[#3B82F6] rounded-xl transition-all flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard title="Pending Lost" value={stats.pending.lost} icon={Package} color="bg-amber-50 text-amber-600" />
          <StatCard title="Pending Found" value={stats.pending.found} icon={Search} color="bg-blue-50 text-blue-600" />
          <StatCard title="Pending Claims" value={stats.pending.claims} icon={Users} color="bg-purple-50 text-purple-600" />
          <StatCard title="Success Rate" value={`${stats.acceptanceRate}%`} icon={Award} color="bg-emerald-50 text-emerald-600" subtitle={`${stats.returned} items returned`} />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md border border-blue-100 mb-6 overflow-hidden">
          <div className="flex flex-wrap p-1 bg-gradient-to-r from-blue-50 to-indigo-50">
            {[
              { id: 'pending-lost', label: 'Lost Reports', icon: Package, count: stats.pending.lost },
              { id: 'pending-found', label: 'Found Reports', icon: Search, count: stats.pending.found },
              { id: 'pending-claims', label: 'Claims', icon: Users, count: stats.pending.claims },
              { id: 'accepted-lost', label: 'Accepted Lost', icon: CheckCircle, count: stats.approved.lost },
              { id: 'accepted-found', label: 'Accepted Found', icon: Award, count: stats.approved.found },
              { id: 'approved-claims', label: 'Approved Claims', icon: CheckCircle, count: stats.approved.claims }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-md border border-blue-100'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by item, person, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2.5 border border-blue-200 rounded-xl bg-white hover:bg-blue-50 transition-all flex items-center gap-2 text-sm text-gray-600"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl p-4 mb-6 border border-blue-100 shadow-sm">
            <div className="flex gap-3 flex-wrap">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-1.5 text-sm border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-blue-100">
              <Package className="w-12 h-12 text-blue-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No items to display</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item._id} className="bg-gradient-to-r from-white to-blue-50/30 rounded-xl p-4 hover:shadow-lg transition-all border border-blue-100">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-100 to-indigo-100 shadow-sm">
                    <img 
                      src={item.itemImageUrl ? `${API_BASE_URL}/${item.itemImageUrl}` : (item.imageUrl ? `${API_BASE_URL}/${item.imageUrl}` : 'https://via.placeholder.com/64x64?text=No+Image')} 
                      alt={item.itemName} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-800">{item.itemName}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{item.category}</span>
                      {activeTab === 'pending-claims' && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Claim Request</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
                      {activeTab === 'pending-claims' ? (
                        <>
                          <span className="flex items-center gap-1"><User className="w-3 h-3 text-purple-500" /> {item.claimantFullName}</span>
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-purple-500" /> {item.claimantEmail}</span>
                          <span className="flex items-center gap-1"><CreditCard className="w-3 h-3 text-purple-500" /> {item.claimantStudentId}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-purple-500" /> {new Date(item.claimDate).toLocaleDateString()}</span>
                        </>
                      ) : (
                        <>
                          <span className="flex items-center gap-1"><User className="w-3 h-3 text-blue-500" /> {item.fullName}</span>
                          <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-blue-500" /> {item.email}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-blue-500" /> {new Date(item.date || item.createdAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {activeTab === 'pending-claims' ? item.additionalNotes || 'No additional notes' : (item.description || 'No description')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {/* Lost and Found Reports - Show Accept/Reject/Delete */}
                    {(activeTab === 'pending-lost' || activeTab === 'pending-found') && (
                      <>
                        <button
                          onClick={() => handleReview(item, 'accept', activeTab.split('-')[1])}
                          className="px-3 py-1.5 text-sm bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleReview(item, 'reject', activeTab.split('-')[1])}
                          className="px-3 py-1.5 text-sm bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleDelete(item, activeTab.split('-')[1])}
                          className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </>
                    )}
                    
                    {/* Claims - Show Approve/Reject/Delete only */}
                    {activeTab === 'pending-claims' && (
                      <>
                        <button
                          onClick={() => handleApproveClaim(item)}
                          className="px-3 py-1.5 text-sm bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectClaim(item)}
                          className="px-3 py-1.5 text-sm bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all flex items-center gap-1.5"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button
                          onClick={() => handleDelete(item, 'claim')}
                          className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                        <button
                          onClick={() => handleViewClaimDetails(item)}
                          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          View Details
                        </button>
                      </>
                    )}
                    
                    {/* Accepted Found Items - Show Mark Returned and Delete */}
                    {activeTab === 'accepted-found' && item.status === 'approved' && (
                      <>
                        <button
                          onClick={() => handleMarkReturned(item)}
                          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Mark Returned
                        </button>
                        <button
                          onClick={() => handleDelete(item, 'found')}
                          className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </>
                    )}
                    
                    {/* Accepted Lost and Approved Claims - Show Delete only */}
                    {(activeTab === 'accepted-lost' || activeTab === 'approved-claims') && (
                      <button
                        onClick={() => handleDelete(item, activeTab === 'accepted-lost' ? 'lost' : 'claim')}
                        className="px-3 py-1.5 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Review Modal */}
      {showReviewModal && selectedItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
            <div className="p-5 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  {reviewAction === 'accept' ? 'Accept Report' : 'Reject Report'}
                </h2>
                <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4">
                {reviewAction === 'accept' 
                  ? 'This report will be published on the public page.' 
                  : 'This report will be rejected and not shown publicly.'}
              </p>
              <textarea
                rows="3"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={reviewAction === 'accept' ? "Add notes (optional)..." : "Reason for rejection..."}
              />
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={processReview}
                  disabled={isProcessing}
                  className={`flex-1 px-4 py-2 text-sm rounded-xl text-white transition flex items-center justify-center gap-2 ${
                    reviewAction === 'accept' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'
                  }`}
                >
                  {isProcessing ? <Loader className="w-4 h-4 animate-spin" /> : reviewAction === 'accept' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Claim Details Modal */}
      {showClaimDetailsModal && selectedClaim && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-4 flex justify-between items-center">
              <h2 className="text-white text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5" /> Claim Details
              </h2>
              <button onClick={() => setShowClaimDetailsModal(false)} className="text-white hover:bg-white/20 rounded-full p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Item Details */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" /> Item Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p><span className="text-gray-500">Item Name:</span> <strong>{selectedClaim.itemName}</strong></p>
                  <p><span className="text-gray-500">Category:</span> <strong>{selectedClaim.category}</strong></p>
                  <p><span className="text-gray-500">Location Found:</span> <strong>{selectedClaim.location}</strong></p>
                  <p><span className="text-gray-500">Date Found:</span> <strong>{new Date(selectedClaim.date).toLocaleDateString()}</strong></p>
                </div>
                {selectedClaim.itemImageUrl && (
                  <div className="mt-3">
                    <img 
                      src={`${API_BASE_URL}/${selectedClaim.itemImageUrl}`} 
                      alt={selectedClaim.itemName}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Claimant Details */}
              <div className="bg-purple-50 rounded-xl p-4">
                <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" /> Claimant Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p><span className="text-gray-500">Full Name:</span> <strong>{selectedClaim.claimantFullName}</strong></p>
                  <p><span className="text-gray-500">Student ID:</span> <strong>{selectedClaim.claimantStudentId}</strong></p>
                  <p><span className="text-gray-500">Email:</span> <strong>{selectedClaim.claimantEmail}</strong></p>
                  <p><span className="text-gray-500">Contact:</span> <strong>{selectedClaim.claimantContactNumber || 'Not provided'}</strong></p>
                </div>
              </div>

              {/* ID Proof Details */}
              <div className="bg-emerald-50 rounded-xl p-4">
                <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4" /> ID Proof Information
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <p><span className="text-gray-500">ID Type:</span> <strong>{selectedClaim.idProofType}</strong></p>
                  <p><span className="text-gray-500">ID Number:</span> <strong>{selectedClaim.idProofNumber}</strong></p>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedClaim.additionalNotes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Additional Notes
                  </h3>
                  <p className="text-sm text-gray-600">{selectedClaim.additionalNotes}</p>
                </div>
              )}

              {/* Claim Metadata */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Claim Metadata
                </h3>
                <p className="text-sm text-gray-600">Submitted on: {new Date(selectedClaim.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowClaimDetailsModal(false);
                    handleApproveClaim(selectedClaim);
                  }}
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Claim
                </button>
                <button
                  onClick={() => {
                    setShowClaimDetailsModal(false);
                    handleRejectClaim(selectedClaim);
                  }}
                  className="flex-1 px-4 py-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Claim
                </button>
                <button
                  onClick={() => {
                    setShowClaimDetailsModal(false);
                    handleDelete(selectedClaim, 'claim');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-blue-100 mt-12 py-6 text-center text-xs text-gray-400 bg-white">
        <p>© 2025 Student Support & Engagement Platform | Admin Lost & Found Management System</p>
      </footer>
    </div>
  );
}

export default AdminLostFoundPage;
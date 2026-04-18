import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';
import { useGetSocieties, usePrefetchNextPage } from '../hooks/useSocieties';
import SocietyFilters from '../features/societies/SocietyFilters';
import SocietyGrid from '../features/societies/SocietyGrid';
import Pagination from '../Components/Pagination';
import Button from '../Components/Button';

const SocietiesPage = () => {
  const navigate = useNavigate();
  const { filters, setFilter } = useUIStore();
  const { user } = useAuthStore();
  
  const { data, isLoading, isError } = useGetSocieties(filters);
  const prefetchNextPage = usePrefetchNextPage(filters);

  // Set document title
  useEffect(() => {
    document.title = 'Societies | UniConnect';
  }, []);

  const totalSocieties = data?.total || 0;
  const societies = data?.societies || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = filters.page || 1;

  const handlePageChange = (page) => {
    setFilter('page', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPageHover = () => {
    prefetchNextPage(totalPages);
  };

  const canCreate = user?.role === 'admin' || user?.role === 'society_leader';

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 md:py-20 animate-fadeUp">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light/10 border border-primary-light/20 text-primary-light text-[10px] font-black uppercase tracking-widest mb-4">
            University Ecosystem
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-primary-dark tracking-tight">
            Society Directory
          </h1>
          <p className="text-muted mt-3 font-medium text-lg">
            {!isLoading && totalSocieties > 0 
              ? `Discover and join ${totalSocieties} student organizations across campus.`
              : 'Discover communities and build your university network.'}
          </p>
        </div>
        
        {canCreate && (
          <Button 
            size="lg"
            className="shrink-0 group shadow-2xl shadow-blue-500/20 px-8 rounded-2xl font-bold"
            onClick={() => navigate('/societies/create')}
          >
            <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-500" />
            Add New Society
          </Button>
        )}
      </div>

      <div className="mb-12 p-8 bg-white border border-gray-100 rounded-[32px] shadow-sm">
        <SocietyFilters />
      </div>

      {isError ? (
        <div className="text-center p-16 rounded-[40px] border-2 border-dashed border-red-100 bg-red-50/30 mt-8">
          <p className="text-red-600 font-bold tracking-tight text-lg">Failed to load societies. Please check your connection and try again.</p>
        </div>
      ) : (
        <SocietyGrid 
          societies={societies} 
          isLoading={isLoading} 
          isEmpty={!isLoading && societies.length === 0} 
        />
      )}

      {/* Pagination Container */}
      {!isLoading && totalPages > 1 && (
        <div 
          className="mt-20 pt-10 border-t border-gray-100 flex justify-center w-full"
          onMouseEnter={handleNextPageHover}
        >
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default SocietiesPage;

import React from 'react';
import PropTypes from 'prop-types';
import { Filter } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import SearchInput from '../../Components/SearchInput';
import Button from '../../Components/Button';
import Badge from '../../Components/Badge';
import { cn } from '../../utils/cn';

const CATEGORIES = [
  'All',
  'Engineering',
  'Finance & Technology',
  'Arts & Culture',
  'Social Impact',
  'Sports',
  'Science',
  'Health & Wellness',
  'Other'
];

const SocietyFilters = ({ className }) => {
  const { filters, setFilter, resetFilters } = useUIStore();
  
  const activeFilterCount = (filters.category && filters.category !== 'All' ? 1 : 0) + (filters.search ? 1 : 0);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-light/10 flex items-center justify-center text-primary-light">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-display font-bold text-primary-dark tracking-tight">Refine Discovery</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-muted font-black uppercase tracking-widest">Active Filters</span>
              {activeFilterCount > 0 && (
                <div className="w-5 h-5 rounded-full bg-primary-light text-white flex items-center justify-center text-[10px] font-black animate-scaleIn">
                  {activeFilterCount}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <SearchInput
            value={filters.search}
            onChange={(val) => setFilter('search', val)}
            placeholder="Search societies..."
            className="w-full sm:w-80 h-12 rounded-2xl border-gray-100 focus:border-primary-light transition-all shadow-sm"
          />
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full sm:w-auto shrink-0 font-black text-[10px] uppercase tracking-widest text-primary-light hover:text-primary-dark">
              Reset All
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pb-2">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setFilter('category', category)}
            className={cn(
              "px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-light/20",
              (filters.category || 'All') === category
                ? "bg-primary-dark text-white shadow-xl shadow-blue-900/20"
                : "bg-white text-muted border border-gray-100 hover:border-primary-light hover:text-primary-dark shadow-sm"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

SocietyFilters.propTypes = {
  className: PropTypes.string
};

export default SocietyFilters;

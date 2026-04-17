import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../utils/cn';

const Pagination = ({ currentPage, totalPages, onPageChange, className }) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];

    // Calculate the range of pages to show around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1 && !rangeWithDots.includes(totalPages)) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <nav className={cn('flex items-center justify-center space-x-2', className)} aria-label="Pagination">
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="inline-flex items-center justify-center rounded-lg p-2 text-muted hover:text-primary hover:bg-surface border border-transparent hover:border-border disabled:opacity-50 disabled:pointer-events-none transition-all"
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-muted flex items-center justify-center pointer-events-none select-none">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                'inline-flex items-center justify-center h-10 w-10 rounded-lg text-sm font-medium transition-all select-none focus:outline-none',
                isActive
                  ? 'bg-accent text-white shadow-md cursor-default'
                  : 'text-muted hover:text-primary hover:bg-surface border border-transparent hover:border-border cursor-pointer focus:ring-2 focus:ring-accent/50'
              )}
              aria-current={isActive ? 'page' : undefined}
              disabled={isActive}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="inline-flex items-center justify-center rounded-lg p-2 text-muted hover:text-primary hover:bg-surface border border-transparent hover:border-border disabled:opacity-50 disabled:pointer-events-none transition-all"
        aria-label="Next Page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Pagination;

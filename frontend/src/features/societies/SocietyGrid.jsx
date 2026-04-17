import React from 'react';
import PropTypes from 'prop-types';
import SocietyCard, { SocietyCardSkeleton } from './SocietyCard';
import EmptyState from '../../components/EmptyState';

const SocietyGrid = ({ societies = [], isLoading, isEmpty }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SocietyCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (isEmpty || societies.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No societies found"
        description="Try adjusting your search criteria or category filter to find what you're looking for."
        className="mt-8"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {societies.map((society, index) => (
        <div
          key={society._id || society.slug} // fallback to slug if _id not present
          className="animate-fadeUp opacity-0"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <SocietyCard society={society} />
        </div>
      ))}
    </div>
  );
};

SocietyGrid.propTypes = {
  societies: PropTypes.array,
  isLoading: PropTypes.bool,
  isEmpty: PropTypes.bool,
};

export default SocietyGrid;

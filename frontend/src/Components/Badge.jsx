import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../utils/cn';

const Badge = ({ label, color, className }) => {
  // Generate a hash color if none provided
  const getColor = () => {
    if (color) return color;
    if (!label) return '#0EA5E9'; // default accent
    
    let hash = 0;
    for (let i = 0; i < label.length; i++) {
      hash = label.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#22C55E', 
      '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', 
      '#6366F1', '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E'
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const badgeColor = getColor();

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        className
      )}
      style={{
        backgroundColor: `${badgeColor}20`,
        color: badgeColor,
        border: `1px solid ${badgeColor}40`
      }}
    >
      {label}
    </span>
  );
};

Badge.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,
};

export default Badge;

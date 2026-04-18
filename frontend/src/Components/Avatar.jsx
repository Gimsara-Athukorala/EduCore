import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../utils/cn';

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
};

const Avatar = ({ name, src, size = 'md', className }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const getColor = (str) => {
    if (!str) return '#475569'; // default muted
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
        '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', 
        '#A855F7', '#EC4899', '#F43F5E', '#14B8A6'
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  const bgColor = getColor(name);

  // Consider default-profile.png as no source so we show initials instead
  const hasSrc = src && src !== 'default-profile.png' && src !== '';

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface text-white',
        sizes[size],
        className
      )}
      style={!hasSrc ? { backgroundColor: bgColor } : undefined}
    >
      {hasSrc ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="font-medium tracking-wide">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
};

Avatar.propTypes = {
  name: PropTypes.string,
  src: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Avatar;

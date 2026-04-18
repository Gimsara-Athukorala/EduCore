import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../utils/cn';

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
};

const Spinner = ({ size = 'md', color = 'text-accent', className }) => {
  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]',
        sizes[size],
        color,
        className
      )}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.string,
  className: PropTypes.string,
};

export default Spinner;

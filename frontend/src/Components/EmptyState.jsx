import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../utils/cn';

const EmptyState = ({ icon = '📂', title, description, action, className }) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-surface/50 min-h-[300px]', className)}>
      <div className="text-4xl mb-4 opacity-80 select-none">{icon}</div>
      <h3 className="text-lg font-display text-primary mb-2 tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm text-muted max-w-sm mx-auto mb-6">
          {description}
        </p>
      )}
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
};

export default EmptyState;

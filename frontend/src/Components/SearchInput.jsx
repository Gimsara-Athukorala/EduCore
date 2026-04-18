import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, X } from 'lucide-react';
import { cn } from '../utils/cn';

const SearchInput = ({ value, onChange, placeholder = 'Search...', debounceMs = 400, className }) => {
  const [innerValue, setInnerValue] = useState(value || '');

  useEffect(() => {
    setInnerValue(value || '');
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (innerValue !== value) {
        onChange(innerValue);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [innerValue, debounceMs, onChange, value]);

  const handleClear = () => {
    setInnerValue('');
    onChange('');
  };

  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-muted" />
      </div>
      <input
        type="text"
        value={innerValue}
        onChange={(e) => setInnerValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2 bg-surface text-primary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors text-sm placeholder:text-muted"
      />
      {innerValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-primary transition-colors focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

SearchInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  debounceMs: PropTypes.number,
  className: PropTypes.string,
};

export default SearchInput;

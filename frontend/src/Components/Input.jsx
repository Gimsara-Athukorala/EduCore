import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../utils/cn';

const Input = React.forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  register,
  helperText,
  icon: Icon,
  required = false,
  multiline = false,
  className,
  ...props
}, ref) => {
  const Component = multiline ? 'textarea' : 'input';
  
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-primary">
          {label} {required && <span className="text-red-600">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-muted" />
          </div>
        )}
        <Component
          id={name}
          type={multiline ? undefined : type}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-lg bg-white border text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 transition-colors',
            Icon ? 'pl-10 pr-4 py-2' : 'px-4 py-2',
            multiline && 'min-h-[100px] resize-y leading-relaxed',
            error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-accent'
          )}
          {...register}
          ref={register?.ref || ref}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p className={cn('text-sm', error ? 'text-red-600' : 'text-muted')}>
          {error?.message || error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  register: PropTypes.object,
  helperText: PropTypes.string,
  icon: PropTypes.elementType,
  required: PropTypes.bool,
  multiline: PropTypes.bool,
  className: PropTypes.string,
};

export default Input;

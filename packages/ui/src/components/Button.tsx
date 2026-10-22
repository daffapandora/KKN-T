import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'brand' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl border select-none active:scale-[0.98]';

    const sizeStyles = {
      sm: 'h-9 px-3.5 text-xs font-semibold gap-1.5',
      md: 'h-11 px-5 text-sm font-semibold gap-2 min-h-[44px]',
      lg: 'h-13 px-6 text-base font-semibold gap-2.5 min-h-[52px]',
    };

    const variantStyles = {
      // Apple Dark Slate primary
      primary:
        'bg-[#0F172A] text-white border-transparent hover:bg-[#1E293B] active:bg-[#020617] shadow-sm',
      // Natural Emerald Green brand accent
      brand:
        'bg-[#16A34A] text-white border-transparent hover:bg-[#15803D] active:bg-[#14532D] shadow-[0_2px_8px_rgba(22,163,74,0.25)]',
      // Apple frosted/bordered secondary
      secondary:
        'bg-white text-[#0F172A] border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 shadow-xs active:bg-slate-100',
      outline:
        'bg-transparent text-[#0F172A] border-slate-300 hover:bg-slate-50 active:bg-slate-100',
      ghost:
        'bg-transparent text-[#0F172A] border-transparent hover:bg-slate-100/80 active:bg-slate-200/60',
      danger:
        'bg-[#DC2626] text-white border-transparent hover:bg-[#B91C1C] active:bg-[#991B1B] shadow-[0_2px_8px_rgba(220,38,38,0.2)]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'muted';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseStyles =
      'bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_16px_-4px_rgba(0,0,0,0.03)] transition-all duration-200';

    const variantStyles = {
      default: 'bg-white hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]',
      bordered:
        'border-slate-200/90 hover:border-slate-300 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]',
      muted: 'bg-slate-50/70 border-slate-200/60 shadow-none',
    };

    return (
      <div
        ref={ref}
        className={twMerge(clsx(baseStyles, variantStyles[variant], className))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

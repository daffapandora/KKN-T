import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'brand' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  /**
   * Renders the button styles on another element (for example a router Link),
   * so navigation stays a single focusable anchor instead of a button nested in a link.
   */
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  /** Forwarded to the rendered element when `as` is a router Link */
  to?: string;
  href?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children' | 'disabled'>;

// Every size keeps a 44px minimum touch height on phones; `sm` relaxes it on pointer devices only.
const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'min-h-[44px] sm:min-h-[36px] px-3.5 py-2 text-xs gap-1.5',
  md: 'min-h-[44px] px-5 py-2.5 text-sm gap-2',
  lg: 'min-h-[48px] sm:min-h-[52px] px-6 py-3 text-base gap-2.5',
  icon: 'min-h-[44px] min-w-[44px] p-0',
};

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[#0F172A] text-white border-transparent hover:bg-[#1E293B] active:bg-[#020617]',
  brand:
    'bg-[#16A34A] text-white border-transparent hover:bg-[#15803D] active:bg-[#14532D]',
  secondary:
    'bg-white text-[#0F172A] border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100',
  outline:
    'bg-transparent text-[#0F172A] border-slate-300 hover:bg-slate-50 active:bg-slate-100',
  ghost:
    'bg-transparent text-[#0F172A] border-transparent hover:bg-slate-100 active:bg-slate-200/70',
  danger:
    'bg-[#DC2626] text-white border-transparent hover:bg-[#B91C1C] active:bg-[#991B1B]',
};

const baseStyles =
  'inline-flex items-center justify-center text-center font-semibold leading-tight transition-colors duration-150 ease-out rounded-xl border select-none no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16A34A] focus-visible:ring-offset-2 aria-disabled:opacity-50 aria-disabled:pointer-events-none disabled:opacity-50 disabled:pointer-events-none';

const buttonStyles = (
  variant: NonNullable<ButtonProps['variant']> = 'primary',
  size: NonNullable<ButtonProps['size']> = 'md',
  className?: string
) => twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className));

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      as,
      children,
      ...props
    },
    ref
  ) => {
    const Comp: React.ElementType = as ?? 'button';
    const isNativeButton = Comp === 'button';
    const isDisabled = Boolean(disabled || isLoading);

    const extra = isNativeButton
      ? { type: (props.type as string | undefined) ?? 'button', disabled: isDisabled }
      : { 'aria-disabled': isDisabled || undefined };

    return (
      <Comp
        ref={ref}
        className={buttonStyles(variant, size, className)}
        {...props}
        {...extra}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 text-current shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

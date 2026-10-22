import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ValidationStatus, RiskClass } from '@kemitir/shared';

export interface StatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: ValidationStatus;
  riskClass?: RiskClass;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusChip: React.FC<StatusChipProps> = ({
  status,
  riskClass,
  label,
  size = 'md',
  className,
  ...props
}) => {
  let displayLabel = label;
  let colorClasses = 'bg-gray-100 text-gray-800 border-gray-200';

  if (status) {
    switch (status) {
      case 'valid':
        displayLabel = displayLabel || 'Tervalidasi';
        colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200/90 font-semibold';
        break;
      case 'rejected':
        displayLabel = displayLabel || 'Ditolak';
        colorClasses = 'bg-rose-50 text-rose-800 border-rose-200/90 font-semibold';
        break;
      case 'pending':
      default:
        displayLabel = displayLabel || 'Menunggu Validasi';
        colorClasses = 'bg-amber-50 text-amber-800 border-amber-200/90 font-semibold';
        break;
    }
  } else if (riskClass) {
    switch (riskClass) {
      case 'low':
        displayLabel = displayLabel || 'Risiko Rendah';
        colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200/90 font-semibold';
        break;
      case 'medium':
        displayLabel = displayLabel || 'Risiko Sedang';
        colorClasses = 'bg-amber-50 text-amber-800 border-amber-200/90 font-semibold';
        break;
      case 'high':
        displayLabel = displayLabel || 'Risiko Tinggi';
        colorClasses = 'bg-orange-50 text-orange-800 border-orange-200/90 font-semibold';
        break;
      case 'very_high':
        displayLabel = displayLabel || 'Risiko Sangat Tinggi';
        colorClasses = 'bg-rose-50 text-rose-800 border-rose-200/90 font-semibold';
        break;
    }
  }

  const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs';

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 font-semibold rounded-full border tracking-wide',
          sizeClasses,
          colorClasses,
          className
        )
      )}
      {...props}
    >
      <span className="w-2 h-2 rounded-full bg-current shrink-0" aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
};

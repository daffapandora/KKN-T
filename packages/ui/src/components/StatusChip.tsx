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
        colorClasses = 'bg-green-50 text-green-700 border-green-200';
        break;
      case 'rejected':
        displayLabel = displayLabel || 'Ditolak';
        colorClasses = 'bg-red-50 text-red-700 border-red-200';
        break;
      case 'pending':
      default:
        displayLabel = displayLabel || 'Menunggu Validasi';
        colorClasses = 'bg-amber-50 text-amber-700 border-amber-200';
        break;
    }
  } else if (riskClass) {
    switch (riskClass) {
      case 'low':
        displayLabel = displayLabel || 'Risiko Rendah';
        colorClasses = 'bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]';
        break;
      case 'medium':
        displayLabel = displayLabel || 'Risiko Sedang';
        colorClasses = 'bg-[#FEFCE8] text-[#854D0E] border-[#FEF08A]';
        break;
      case 'high':
        displayLabel = displayLabel || 'Risiko Tinggi';
        colorClasses = 'bg-[#FFF7ED] text-[#C2410C] border-[#FFEDD5]';
        break;
      case 'very_high':
        displayLabel = displayLabel || 'Risiko Sangat Tinggi';
        colorClasses = 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
        break;
    }
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 font-medium rounded-full border tracking-wide uppercase',
          sizeClasses,
          colorClasses,
          className
        )
      )}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
      <span>{displayLabel}</span>
    </span>
  );
};

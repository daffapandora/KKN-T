export const USER_ROLES = {
  PUBLIC: 'public',
  CITIZEN: 'citizen',
  VALIDATOR: 'validator',
  ADMIN: 'admin',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const VALIDATION_STATUS = {
  PENDING: 'pending',
  VALID: 'valid',
  REJECTED: 'rejected',
} as const;

export type ValidationStatus = (typeof VALIDATION_STATUS)[keyof typeof VALIDATION_STATUS];

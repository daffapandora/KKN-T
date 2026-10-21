export const RISK_CLASSES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  VERY_HIGH: 'very_high',
} as const;

export type RiskClass = (typeof RISK_CLASSES)[keyof typeof RISK_CLASSES];

export const HAZARD_CLASSES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  VERY_HIGH: 'very_high',
} as const;

export type HazardClass = (typeof HAZARD_CLASSES)[keyof typeof HAZARD_CLASSES];

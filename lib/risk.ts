import type { RiskLevel } from './types';

// UI metadata for each risk level. Color is always paired with a label and an
// icon — never color alone (FRONTEND-SPEC.md §8 accessibility).
export const RISK_META: Record<
  RiskLevel,
  { label: string; colorKey: 'riskLow' | 'riskSuspicious' | 'riskHigh'; icon: string; a11y: string }
> = {
  low: {
    label: 'LOW',
    colorKey: 'riskLow',
    icon: 'checkmark.shield.fill',
    a11y: 'Risk: low',
  },
  suspicious: {
    label: 'SUSPICIOUS',
    colorKey: 'riskSuspicious',
    icon: 'exclamationmark.triangle.fill',
    a11y: 'Risk: suspicious',
  },
  high: {
    label: 'HIGH',
    colorKey: 'riskHigh',
    icon: 'exclamationmark.octagon.fill',
    a11y: 'Risk: high',
  },
};

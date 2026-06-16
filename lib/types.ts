// Shared types for Manipulation Shield. See TECHNICAL-ARCHITECTURE.md §6.

export type RiskLevel = 'low' | 'suspicious' | 'high';

export interface TacticHit {
  tacticId: string; // matches an id in tactics.ts
  name: string; // human label, e.g. "False Urgency"
  whatItsDoing: string;
  whyItWorks: string;
}

export interface FlaggedPhrase {
  phrase: string; // exact substring from the message
  reason: string;
}

export interface AnalysisResult {
  riskLevel: RiskLevel;
  isLikelyScam: boolean;
  summary: string;
  tactics: TacticHit[];
  flaggedPhrases: FlaggedPhrase[];
  recommendedAction: string;
}

export interface Tactic {
  id: string;
  name: string;
  summary: string; // one line for the list
  explanation: string; // full text for the expanded card
  example: string; // a real-world example message
}

// Error categories the UI maps to friendly copy (see FRONTEND-SPEC.md §6).
export type AnalysisErrorCode =
  | 'over_limit'
  | 'empty'
  | 'network'
  | 'timeout'
  | 'rate_limit'
  | 'service'
  | 'blocked'
  | 'parse';

export class AnalysisError extends Error {
  code: AnalysisErrorCode;
  constructor(code: AnalysisErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'AnalysisError';
    this.code = code;
  }
}

import {
  AnalysisError,
  type AnalysisResult,
  type FlaggedPhrase,
  type RiskLevel,
  type TacticHit,
} from './types';
import { buildPrompt, MAX_MESSAGE_CHARS, MODEL } from './prompt';
import { TACTIC_IDS } from './tactics';

const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const TIMEOUT_MS = 20000;

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY;
// Mock when no key is present, when explicitly forced, or otherwise in dev with
// no key, so the whole UI is buildable without a live key (ARCHITECTURE §4).
const USE_MOCK = !API_KEY || process.env.EXPO_PUBLIC_USE_MOCK === '1';

const RISK_LEVELS: RiskLevel[] = ['low', 'suspicious', 'high'];

function isString(v: unknown): v is string {
  return typeof v === 'string';
}

// Validate the parsed object against AnalysisResult. Throws on mismatch so a
// malformed response is treated as an error, never trusted (SECURITY §4).
function validate(data: unknown): AnalysisResult {
  if (!data || typeof data !== 'object') throw new AnalysisError('parse');
  const d = data as Record<string, unknown>;

  if (!isString(d.riskLevel) || !RISK_LEVELS.includes(d.riskLevel as RiskLevel)) {
    throw new AnalysisError('parse');
  }
  if (typeof d.isLikelyScam !== 'boolean') throw new AnalysisError('parse');
  if (!isString(d.summary) || !isString(d.recommendedAction)) {
    throw new AnalysisError('parse');
  }
  if (!Array.isArray(d.tactics) || !Array.isArray(d.flaggedPhrases)) {
    throw new AnalysisError('parse');
  }

  const tactics: TacticHit[] = d.tactics
    .filter(
      (t): t is TacticHit =>
        !!t &&
        typeof t === 'object' &&
        isString((t as TacticHit).tacticId) &&
        isString((t as TacticHit).name) &&
        isString((t as TacticHit).whatItsDoing) &&
        isString((t as TacticHit).whyItWorks),
    )
    // Drop any tactic the model invented outside the fixed set.
    .filter((t) => TACTIC_IDS.includes(t.tacticId));

  const flaggedPhrases: FlaggedPhrase[] = d.flaggedPhrases.filter(
    (p): p is FlaggedPhrase =>
      !!p &&
      typeof p === 'object' &&
      isString((p as FlaggedPhrase).phrase) &&
      isString((p as FlaggedPhrase).reason),
  );

  return {
    riskLevel: d.riskLevel as RiskLevel,
    isLikelyScam: d.isLikelyScam,
    summary: d.summary,
    tactics,
    flaggedPhrases,
    recommendedAction: d.recommendedAction,
  };
}

async function postToGemini(message: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPrompt(message)),
      signal: controller.signal,
    });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      throw new AnalysisError('timeout');
    }
    throw new AnalysisError('network');
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 429) throw new AnalysisError('rate_limit');
  if (!response.ok) throw new AnalysisError('service');

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new AnalysisError('parse');
  }

  if (data?.promptFeedback?.blockReason) throw new AnalysisError('blocked');

  const text: unknown = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!isString(text)) throw new AnalysisError('service');
  return text;
}

function parseResult(raw: string): AnalysisResult {
  // responseMimeType is JSON, so a direct parse should work; guard anyway.
  return validate(JSON.parse(raw));
}

/** Analyze a message and return a typed result. Never logs message content. */
export async function analyzeMessage(message: string): Promise<AnalysisResult> {
  const trimmed = message.trim();
  if (trimmed.length === 0) throw new AnalysisError('empty');
  if (message.length > MAX_MESSAGE_CHARS) throw new AnalysisError('over_limit');

  if (USE_MOCK) return mockAnalyze(trimmed);

  const raw = await postToGemini(trimmed);
  try {
    return parseResult(raw);
  } catch {
    // Single repair retry: re-ask once before giving up (ARCHITECTURE §4).
    const retry = await postToGemini(trimmed);
    return parseResult(retry);
  }
}

export const isMockMode = USE_MOCK;

// ---------------------------------------------------------------------------
// Mock mode: a representative result with a light keyword heuristic so the demo
// feels real without an API key. This is NOT the analyzer; it is a stand-in.

const SCAM_HINTS = [
  'otp',
  'urgent',
  'verify',
  'kyc',
  'suspend',
  'blocked',
  'won',
  'prize',
  'lottery',
  'click',
  'account',
  'password',
  'bank',
  'refund',
  'arrest',
  'fee',
  'expire',
];

async function mockAnalyze(message: string): Promise<AnalysisResult> {
  // Small artificial delay so loading states are visible during development.
  await new Promise((r) => setTimeout(r, 600));

  const lower = message.toLowerCase();
  const hits = SCAM_HINTS.filter((h) => lower.includes(h)).length;

  if (hits === 0) {
    return {
      riskLevel: 'low',
      isLikelyScam: false,
      summary: 'Nothing manipulative stands out in this message. Stay alert anyway.',
      tactics: [],
      flaggedPhrases: [],
      recommendedAction:
        'No action needed. If anything feels off later, verify with the sender through a channel you already trust.',
    };
  }

  const firstHint = SCAM_HINTS.find((h) => lower.includes(h));
  const idx = firstHint ? message.toLowerCase().indexOf(firstHint) : -1;
  const flaggedPhrases: FlaggedPhrase[] =
    idx >= 0
      ? [
          {
            phrase: message.slice(idx, idx + (firstHint?.length ?? 0)),
            reason: 'Language designed to trigger urgency or hand over sensitive details.',
          },
        ]
      : [];

  return {
    riskLevel: hits >= 2 ? 'high' : 'suspicious',
    isLikelyScam: hits >= 2,
    summary:
      'This message pressures you to act fast and hand over access — a common scam pattern. (Mock result)',
    tactics: [
      {
        tacticId: 'false-urgency',
        name: 'False Urgency',
        whatItsDoing:
          'It sets an artificial deadline so you respond before stopping to verify anything.',
        whyItWorks: 'Time pressure suppresses careful thinking and makes the demand feel unavoidable.',
      },
      {
        tacticId: 'fake-verification',
        name: 'Fake Verification',
        whatItsDoing: 'It frames handing over a code or details as a routine security step.',
        whyItWorks: 'Calling it "verification" makes a request for your secrets feel legitimate.',
      },
    ],
    flaggedPhrases,
    recommendedAction:
      'Do not reply, click any link, or share any code. Contact the organisation directly using a number you already trust — not one from this message.',
  };
}

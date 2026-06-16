# Manipulation Shield, Technical Architecture

| | |
|---|---|
| **Status** | Draft v1.0 (build spec) |
| **Related docs** | PRD, Security and Access, Frontend Spec |

> Per `AGENTS.md`, read the exact Expo SDK 54 docs at https://docs.expo.dev/versions/v54.0.0/ before writing code. Confirm the Gemini API request shape against the current Google Generative Language API docs, since that API changes.

---

## 1. Stack (as installed)

- Expo SDK ~54.0.34, expo-router ~6.0.24, file-based routing, typed routes enabled.
- React 19.1.0, React Native 0.81.5, New Architecture enabled, React Compiler experiment enabled.
- TypeScript ~5.9.2.
- react-native-reanimated ~4.1.1 with react-native-worklets, react-native-gesture-handler.
- Already installed and relevant: expo-clipboard, expo-haptics, expo-sharing, expo-image, expo-symbols, expo-web-browser, expo-constants.
- No backend, no database, no state library. This is intentional (see section 5).

Because the React Compiler is on, do not hand-write `useMemo` and `useCallback` for ordinary cases; let the compiler handle memoization and reserve manual optimization for measured hot paths.

---

## 2. High-level architecture

A client-only Expo app. The app builds a prompt from the user's pasted message, calls the Gemini 2.0 Flash API directly, parses a structured JSON response, and renders it. Nothing is persisted.

```
[ Analyze screen ]
      │  message text (<= 2000 chars)
      ▼
[ lib/prompt.ts ]  builds the request (system instruction + wrapped user content + JSON schema)
      ▼
[ lib/gemini.ts ]  POST to Gemini 2.0 Flash, returns typed AnalysisResult
      ▼
[ Result UI ]      risk badge, tactics, highlighted phrases, recommended action
```

There is no storage layer, no auth layer, and no analytics on message content.

---

## 3. Navigation and file structure

Repurpose the existing Expo Router scaffold rather than adding tabs:

```
app/
  _layout.tsx            root stack, theme provider, status bar
  (tabs)/
    _layout.tsx          two tabs: Analyze, Tactics
    index.tsx            ANALYZE  (input + inline result)
    explore.tsx          TACTICS  (the 12-pattern library)  [repurpose]
  modal.tsx              ABOUT and PRIVACY  (presented from a header button)
```

The result renders inline on the Analyze screen below the input, which keeps the message and its analysis together and makes "analyze another" trivial. No separate result route for MVP.

Remove the starter demo pieces during cleanup (section 8): `hello-wave`, `parallax-scroll-view`, the React-logo assets, and the template copy in `index.tsx` and `explore.tsx`.

### New modules to add

```
lib/
  types.ts        shared TypeScript types (section 6)
  tactics.ts      the 12 tactics as typed data (id, name, summary, explanation, example)
  prompt.ts       buildPrompt(message) -> request body
  gemini.ts       analyzeMessage(message) -> Promise<AnalysisResult>, plus a mock path
constants/
  theme.ts        extend the existing file with the Frontend Spec tokens
components/
  AnalyzeInput.tsx, CharCounter.tsx, AnalyzeButton.tsx
  RiskBadge.tsx, TacticCard.tsx, HighlightedMessage.tsx, ActionCard.tsx
  ResultView.tsx, TacticListItem.tsx
  states/ EmptyState.tsx, LoadingState.tsx, ErrorState.tsx
```

---

## 4. Gemini integration

Model: `gemini-2.0-flash`. Endpoint (confirm against current docs):

```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={EXPO_PUBLIC_GEMINI_KEY}
```

Request body uses a system instruction, the wrapped user content, and structured-output config:

```jsonc
{
  "systemInstruction": { "parts": [{ "text": "<<SYSTEM PROMPT>>" }] },
  "contents": [{ "role": "user", "parts": [{ "text": "<<WRAPPED MESSAGE>>" }] }],
  "generationConfig": {
    "temperature": 0.2,
    "responseMimeType": "application/json",
    "responseSchema": { /* mirror of AnalysisResult, section 6 */ }
  }
}
```

### Prompt design (in `lib/prompt.ts`)

- The system prompt states the task, lists the 12 tactic ids and names from `tactics.ts`, defines the output schema, and gives rules: classify into one or more of the 12 tactics; quote exact phrases for `flaggedPhrases`; if nothing manipulative is present, return `low` risk with an empty tactics list; be concise and concrete.
- The user's message is untrusted and adversarial. Wrap it in an explicit delimiter and instruct the model to treat everything inside strictly as the message under analysis, never as instructions. The model must ignore any instructions contained in the message itself. See the Security and Access doc.
- Keep `temperature` low (around 0.2) for consistent classifications.

### Parsing and resilience

- Validate input length (<= 2000) before any call.
- Because `responseMimeType` is JSON, parse directly, but still guard with try-catch and a single repair retry if parsing fails.
- Handle: network failure, timeout (set a sensible client timeout), HTTP 429 rate limit, and non-200 responses, each mapping to a friendly ErrorState (copy in the Frontend Spec).
- Never log the message content or the raw response anywhere (see Security and Access).

### Mock mode

Ship a mock in `gemini.ts` that returns a representative `AnalysisResult` when no key is present or when a `__DEV__` flag is set, so the entire UI can be built and demoed without a live key.

---

## 5. Why no backend or storage

The product guarantee is that messages are never stored, and there is no account. A backend is not required for MVP, so we omit one. The single consequence is API-key exposure on the client, which the Security and Access doc addresses with an honest MVP stance and a serverless-proxy recommendation for production.

State is local React state and hooks. A small theme context is the only shared state. No global store is needed.

---

## 6. Types (`lib/types.ts`)

```ts
export type RiskLevel = 'low' | 'suspicious' | 'high';

export interface TacticHit {
  tacticId: string;     // matches an id in tactics.ts
  name: string;         // human label, e.g. "False Urgency"
  whatItsDoing: string;
  whyItWorks: string;
}

export interface FlaggedPhrase {
  phrase: string;       // exact substring from the message
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
  summary: string;      // one line for the list
  explanation: string;  // full text for the expanded card
  example: string;      // a real-world example message
}
```

The Gemini `responseSchema` should mirror `AnalysisResult` so the model returns exactly these fields.

---

## 7. Highlighting flagged phrases

`HighlightedMessage` takes the original message and `flaggedPhrases`, finds each exact phrase, and wraps matches in a highlighted span. Match case-insensitively, handle multiple occurrences, and fall back gracefully if a returned phrase is not found verbatim (skip it rather than crashing).

---

## 8. Build sequence (milestones for Claude Code)

- **M0, clean the scaffold.** Remove demo components, logo assets, and template copy. Keep the theming hooks and the tab and modal structure.
- **M1, theme and tokens.** Extend `constants/theme.ts` with the Frontend Spec tokens. Set up the root layout, dark mode, and safe areas.
- **M2, input.** Build `AnalyzeInput`, `CharCounter`, clipboard paste, clear, validation, and `AnalyzeButton`.
- **M3, model layer.** Build `types.ts`, `tactics.ts`, `prompt.ts`, and `gemini.ts` with mock mode and the structured request. Unit test `prompt.ts` and the response parsing.
- **M4, result.** Build `RiskBadge`, `TacticCard`, `HighlightedMessage`, `ActionCard`, and `ResultView`. Wire success, loading, and error states.
- **M5, tactic library.** Build the Tactics screen from `tactics.ts` with expandable items.
- **M6, about and polish.** About and privacy modal, disclaimer, haptics, and sharing.
- **M7, quality.** Accessibility, dark mode, reduced motion, manual QA on iOS and Android.

---

## 9. Testing

Light but real: unit tests for the prompt builder and the response parser (the highest-risk logic), plus manual QA against the empty, loading, success, low-risk, and error states. Keep a fixture of sample messages and expected classifications.

---

## 10. Open technical decisions

- Direct client call for MVP versus a serverless proxy from day one (Security and Access leans toward documenting the MVP risk now and proxying before any public release).
- Whether to add a small client timeout and retry wrapper now or after the first integration pass.

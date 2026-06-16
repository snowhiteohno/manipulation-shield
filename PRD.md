# Manipulation Shield, Product Requirements Document

| | |
|---|---|
| **Product** | Manipulation Shield |
| **Owner** | Mallika Suri |
| **Status** | Draft v1.0 (build spec) |
| **Platform** | iOS, Android, Web (Expo SDK 54) |
| **Stack** | React Native, TypeScript, Expo Router, Google Gemini 2.0 Flash |
| **Related docs** | Technical Architecture, Security and Access, Frontend Spec |

---

## 1. Overview

Manipulation Shield explains the psychological manipulation inside a suspicious message. A user pastes a message they received (WhatsApp, SMS, or email), and the app names the tactic being used, explains what it is doing and why it works, highlights the manipulative phrases, assigns a risk level, and tells the user exactly what to do next.

The message is never stored, and no account is required.

This document is the build specification for completing the app. The current repository is a clean Expo Router starter; everything below is to be built on top of it.

---

## 2. Problem

Scams over WhatsApp, SMS, and email are surging across India and Southeast Asia. Most victims are not naive; they simply do not recognize the technique being used against them. Generic scam-awareness advice is abstract and forgettable. People need to understand the specific message in front of them, in seconds, with a clear next step.

---

## 3. Goals and non-goals

### Goals
- Turn a confusing message into a clear, named explanation in seconds.
- Teach the underlying pattern so the user recognizes it next time.
- Give one unambiguous recommended action per result.
- Keep the experience private: nothing stored, no account.

### Non-goals
- No message history or storage of any kind (this is a privacy guarantee, not a missing feature).
- No accounts, login, or profiles.
- No live interception, auto-blocking, or reading the user's actual inbox.
- Not legal or financial advice. The app explains technique; it does not adjudicate.

---

## 4. Target users

- **The unsure recipient (primary).** Got a message that feels off, wants to know if it is a scam and why, before acting.
- **The family checker.** Pastes a message a parent or relative received to verify it.
- **The learner.** Browses the tactic library to build intuition, with no specific message in hand.

---

## 5. Core flows

**A. Analyze.** Open the Analyze tab, paste a message (clipboard button or type), tap Analyze, see the result inline (risk level, tactic, flagged phrases, recommended action). Then analyze another or share.

**B. Learn.** Open the Tactics tab, browse the 12 patterns, expand one to read the explanation and a real-world example.

**C. Understand privacy.** Open About, read what the app does and how the message is handled.

---

## 6. Functional requirements

Priorities: **P0** = MVP must-have, **P1** = should-have, **P2** = later.

### Input
- P0: Multiline input accepting up to 2,000 characters, with a live character counter.
- P0: Paste-from-clipboard button (expo-clipboard is installed).
- P0: Clear button. Validation: block analyze on empty or over-limit input with clear messaging.

### Analysis
- P0: Send the message to Gemini 2.0 Flash and return a structured result (schema in section 7).
- P0: Handle loading, success, error (network, timeout, malformed response), and offline states explicitly.
- P0: A development mock mode so the UI is buildable and testable without a live API key.

### Result
- P0: Risk level shown as Low, Suspicious, or High, with a color and an icon and a text label (never color alone).
- P0: One or more named tactics, each with "what it's doing" and "why it works."
- P0: The original message rendered with the manipulative phrases highlighted in place.
- P0: A prominent recommended action.
- P1: Share the result (expo-sharing is installed). Copy result to clipboard.
- P1: Haptic feedback on result arrival (expo-haptics is installed), keyed to risk level.

### Tactic Library
- P0: A browsable list of the 12 tactics in section 8, each with a one-line summary and an expandable explanation plus example.
- P2: Search or filter the library.

### Privacy and access
- P0: No account, no login, no stored history. See the Security and Access doc.
- P0: An in-app privacy note and an AI-accuracy disclaimer.

### Later
- P2: "Try an example" sample messages on the empty state.
- P2: Multi-language input support beyond English and common Hinglish.

---

## 7. The analysis result

Every analysis returns this shape (typed in the Technical Architecture doc):

- `riskLevel`: one of `low`, `suspicious`, `high`.
- `isLikelyScam`: boolean.
- `summary`: one sentence describing what the message is doing.
- `tactics`: a list, each with `name`, `tacticId` (maps to the library), `whatItsDoing`, `whyItWorks`.
- `flaggedPhrases`: a list, each with the exact `phrase` from the message and a short `reason`.
- `recommendedAction`: one clear, safe next step.

If no manipulation is detected, return `riskLevel: low`, an empty `tactics` list, and a reassuring summary.

---

## 8. Tactic Library (the 12 patterns)

These are the classification set for the model and the content for the Tactics screen.

1. **False Urgency** — manufactured deadlines that pressure a fast decision.
2. **Fear Amplification** — threats of loss, suspension, or punishment to trigger panic.
3. **False Authority** — impersonating a bank, government body, police, or delivery service.
4. **Scarcity** — limited slots or an offer "ending now" to force action.
5. **Reward Bait** — prizes, refunds, lotteries, or job offers that seem too good.
6. **Fake Verification** — requests to confirm KYC, OTP, passwords, or "verify your account."
7. **Social Proof** — claims that everyone is doing it, with fake testimonials or numbers.
8. **Reciprocity** — a small gift or favor first, to create a sense of obligation.
9. **Familiarity and Impersonation** — pretending to be a known contact ("Mom, I lost my phone").
10. **Isolation and Secrecy** — urging the target to act alone and tell no one.
11. **Commitment Escalation** — "you have already invested, add a little more" (investment and crypto scams).
12. **Intimidation and Blackmail** — sextortion, legal threats, or account or police action.

---

## 9. Success metrics

- Analyses completed per session.
- Tactic Library opens and expansions.
- Share rate of results.
- Qualitative: does a user come away understanding the specific message, not just feeling warned.

---

## 10. Scope

**MVP.** Analyze flow end to end, the full result, the 12-tactic library, privacy note and disclaimer, and all loading, empty, and error states. iOS and Android first, web as a bonus since the template supports it.

**Later.** Sharing and haptics polish, sample messages, library search, and multi-language coverage.

---

## 11. Disclaimers

The analysis is best-effort AI and can be wrong in either direction. The app must tell users to verify anything important through official channels (for example, by calling their bank using the number on their card, not a number in the message). The app does not give legal or financial advice.

---

## 12. Open questions

- Does sharing a result share plain text, or a rendered image card?
- Should the empty state ship with a few canned example messages for first-run users?
- Is web a supported target at launch, or mobile only?

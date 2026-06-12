# Manipulation Shield 🛡️

> Paste any suspicious message. Understand exactly what psychological trick is being used against you.

Scams via WhatsApp, SMS, and email are surging across India and Southeast Asia. Most victims aren't naive — they simply don't recognize the technique being used against them. Manipulation Shield names the tactic, explains the psychology behind it, and tells you what to do next.

**The message never gets stored. No account required.**

---

## Demo

Paste a message like:
> "Your SBI account has been SUSPENDED. Verify your KYC immediately or lose access forever."

Get back:

- **Tactic:** False Urgency + Fear Amplification
- **What it's doing:** Creating a fake deadline to bypass rational thinking
- **Why it works:** Urgency triggers the brain's threat response, skipping deliberate reasoning
- **Flagged phrases:** "SUSPENDED", "immediately", "lose access forever"
- **What to do:** Do not click. Call your bank directly.

---

## Features

- Paste any message up to 2,000 characters
- AI-powered tactic classification via Gemini 2.0 Flash
- Flagged phrases highlighted with explanations
- Risk level: Low / Suspicious / High
- Recommended action for every result
- Tactic Library: 12 common manipulation patterns explained
- Privacy-first: nothing stored, no account needed

---

## Why I Built This

I study how AI models get manipulated through adversarial prompting and red-teaming. This app is the consumer-facing inversion of that work. The same techniques used to manipulate language models — false authority, urgency injection, reward framing — are used to manipulate people every day over WhatsApp.

Most people receive these messages and have no framework to recognize what's happening. This app gives them that framework in seconds.

---

## Tech Stack

- React Native (Expo SDK 54)
- Google Gemini 2.0 Flash API
- Expo Router
- TypeScript

---

## Project Docs

Full specification documents in `/docs`:

- [PRD](docs/PRD.md) — Product requirements and feature scope
- [Technical Architecture](docs/TECHNICAL-ARCHITECTURE.md) — System design and data flow
- [Security and Access](docs/SECURITY-AND-ACCESS.md) — Data handling and privacy model
- [Frontend Spec]
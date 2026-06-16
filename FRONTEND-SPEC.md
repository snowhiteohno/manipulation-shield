# Manipulation Shield, Frontend Spec

| | |
|---|---|
| **Status** | Draft v1.0 (build spec) |
| **Related docs** | PRD, Technical Architecture, Security and Access |

---

## 1. Design direction

This is a safety tool, not a toy. The UI should feel calm, trustworthy, and clear, never alarmist. The user is often anxious when they open it, so the interface should reduce panic, not add to it. Lead with legibility and a single clear action per screen. Reserve color intensity for the risk signal; keep everything else quiet.

The signature element is the result: a calm card that turns a scary message into a labelled, understandable explanation, with the risky phrases highlighted in the user's own text.

---

## 2. Tokens

Support light and dark (app.json `userInterfaceStyle` is automatic). Extend `constants/theme.ts`.

```
Neutrals (light)        bg #FBFBFC · surface #FFFFFF · border #E7E7EC
Neutrals (dark)         bg #0F1115 · surface #161922 · border #262B36
Text                    primary #16181D / #F2F3F5 · muted #6B7280 / #9AA3B2
Accent                  #3B6FE0  (calm blue, used sparingly for primary action)

Risk semantics (paired ALWAYS with a label + icon, never color alone)
  Low          #2E9E6B   leaf green
  Suspicious   #D9913B   amber
  High         #D8503C   warm red
```

Radius: 14 for cards, 999 for pills and badges. Spacing scale: 4, 8, 12, 16, 24, 32. Keep shadows soft and minimal.

---

## 3. Typography

Use the system font for reliability and native feel, with a clear scale. If a custom face is desired, load Inter via expo-font, but do not block first paint on it.

```
Display / screen title   28, weight 700
Section heading          17, weight 600
Body                     16, weight 400, line height 1.5
Label / caption          13, weight 500, letter-spacing 0.02em
Risk badge text          13, weight 700, uppercase
```

---

## 4. Screens

### 4.1 Analyze (tab 1, home)

- Header: title "Manipulation Shield" with a small shield glyph (expo-symbols). A header button opens About.
- Input card: a multiline field with placeholder "Paste a message you're unsure about." Below it, a row with the character counter (`0 / 2000`) on one side and a "Paste" button (clipboard) plus a "Clear" button on the other.
- Primary action: a full-width "Analyze message" button, disabled until there is valid input.
- Empty state below the input invites action (see microcopy).
- On analyze: show the LoadingState, then render `ResultView` inline below the input. The input stays visible so the user can edit and re-analyze.

### 4.2 Result (inline on Analyze)

Order, top to bottom:
1. **RiskBadge**: colored pill with an icon and one of LOW, SUSPICIOUS, HIGH. Plus the one-line `summary`.
2. **Tactics**: one `TacticCard` per detected tactic, each showing the tactic name, "What it's doing," and "Why it works." Tapping a card can deep-link to that tactic in the library.
3. **The message, annotated**: the original text via `HighlightedMessage`, with flagged phrases highlighted; a tappable phrase reveals its `reason`.
4. **ActionCard**: the `recommendedAction`, visually prominent, the most important block on the screen.
5. Footer actions: "Analyze another" and "Share" (P1), then the AI disclaimer line.

If `riskLevel` is low and no tactics are found, show a calm, reassuring result rather than empty space.

### 4.3 Tactics (tab 2, library)

- Title "Tactic Library" with a one-line intro.
- A list of the 12 tactics from `tactics.ts`. Each `TacticListItem` shows the name and one-line summary, and expands to reveal the full explanation and a real-world example.
- P2: a search field at the top.

### 4.4 About and Privacy (modal)

- What the app does, in two sentences.
- The privacy model in plain language: the message is not stored, no account is needed, and the message is sent to Google's Gemini API to be analyzed (be honest, see Security and Access).
- The AI disclaimer and the "verify through official channels" guidance.

---

## 5. Components

`AnalyzeInput`, `CharCounter`, `AnalyzeButton`, `RiskBadge`, `TacticCard`, `HighlightedMessage`, `ActionCard`, `ResultView`, `TacticListItem`, `EmptyState`, `LoadingState`, `ErrorState`, `Disclaimer`. Each does exactly one job.

---

## 6. Microcopy

Calm, active voice, sentence case, specific. The interface speaks; it does not apologize.

- Input placeholder: "Paste a message you're unsure about."
- Empty state: "Paste a message to see what it's really doing."
- Analyze button: "Analyze message". While running: "Reading the message...".
- Loading line: "Looking for the technique behind this message."
- Over limit: "That's a bit long. Trim it to 2,000 characters."
- Network error: "Couldn't analyze that. Check your connection and try again."
- Service error: "Something went wrong on the analysis side. Try again in a moment."
- Low-risk result summary fallback: "Nothing manipulative stands out in this message. Stay alert anyway."
- Disclaimer: "This is an AI explanation and can be wrong. For anything important, contact the company directly using a number you trust, not one in the message."
- Recommended action examples should be concrete, for example: "Do not click the link. Call your bank using the number on your card."

---

## 7. Motion

Subtle, with Reanimated 4. The result reveal fades and slides up gently as one orchestrated moment. The risk badge can have a small settle animation scaled to severity. Avoid scattered effects. Respect reduced motion: disable the reveal and badge animation and present the result immediately.

---

## 8. Accessibility (quality floor)

- Risk level must never rely on color alone. Always pair the color with the text label and an icon, so it works for colorblind users.
- Meet contrast on text over surfaces and over risk colors; if text on a risk color is borderline, place text on a neutral surface with the color as an accent rather than a fill.
- Support dynamic type; do not hard-cap font scaling.
- Provide screen-reader labels: the risk badge announces "Risk: high," flagged phrases announce their reason, and buttons state their action.
- Minimum 44 point tap targets. Visible focus on web.

---

## 9. Responsive

Phone-first portrait. The template sets `supportsTablet`, so constrain content to a comfortable reading width on tablets and web rather than stretching full-bleed. The Analyze input and result should center in a max-width column on wide screens.

import type { Tactic } from './types';

// The 12 manipulation tactics. This is both the content for the Tactics
// library screen and the classification set given to the model (PRD §8).
// Tactic ids are stable; the model is instructed to use exactly these ids.

export const TACTICS: Tactic[] = [
  {
    id: 'false-urgency',
    name: 'False Urgency',
    summary: 'Manufactured deadlines that pressure a fast decision.',
    explanation:
      'A fake time limit ("act within 2 hours", "expires today") is added to stop you from thinking, checking, or asking anyone. Real institutions rarely force an instant decision over a message.',
    example:
      'URGENT: Your account will be permanently closed in 60 minutes unless you confirm your details now.',
  },
  {
    id: 'fear-amplification',
    name: 'Fear Amplification',
    summary: 'Threats of loss, suspension, or punishment to trigger panic.',
    explanation:
      'The message inflates a scary consequence — a frozen account, a fine, a lost parcel — so the fear does the thinking for you. Panic narrows attention and makes the demanded action feel like relief.',
    example:
      'We detected illegal activity on your account. It has been suspended and legal action will follow unless you respond.',
  },
  {
    id: 'false-authority',
    name: 'False Authority',
    summary: 'Impersonating a bank, government body, police, or delivery service.',
    explanation:
      'The sender borrows the name and logo of a trusted institution so you obey out of habit. Authority short-circuits scrutiny; we are trained to comply with banks, police, and tax offices.',
    example:
      'This is the Income Tax Department. Your PAN has been flagged. Click here to avoid prosecution.',
  },
  {
    id: 'scarcity',
    name: 'Scarcity',
    summary: 'Limited slots or an offer "ending now" to force action.',
    explanation:
      'Claiming something is almost gone ("only 3 left", "offer ends tonight") makes you act before you can compare or verify. Scarcity makes a thing feel more valuable than it is.',
    example:
      'Only 2 work-from-home positions left in your area! Pay the ₹500 registration fee to lock your seat.',
  },
  {
    id: 'reward-bait',
    name: 'Reward Bait',
    summary: 'Prizes, refunds, lotteries, or job offers that seem too good.',
    explanation:
      'A reward you did not earn — a lottery you never entered, a refund you were not owed — is dangled to get you to click, share details, or pay a "release fee". The prize never arrives.',
    example:
      'Congratulations! You have won ₹25,00,000 in the KBC lucky draw. Share your bank details to claim.',
  },
  {
    id: 'fake-verification',
    name: 'Fake Verification',
    summary: 'Requests to confirm KYC, OTP, passwords, or "verify your account".',
    explanation:
      'Dressed up as routine security, the message asks for the exact secrets that let an attacker in: your OTP, password, card number, or KYC. Legitimate organisations never ask you to share an OTP.',
    example:
      'Your KYC is incomplete. Share the OTP we just sent to keep your account active.',
  },
  {
    id: 'social-proof',
    name: 'Social Proof',
    summary: 'Claims that everyone is doing it, with fake testimonials or numbers.',
    explanation:
      'Fabricated reviews, screenshots of "earnings", or "thousands have joined" make a scam feel safe because others appear to trust it. We copy the crowd when we are unsure.',
    example:
      'Join 50,000+ investors already earning 30% daily. See the screenshots in our group!',
  },
  {
    id: 'reciprocity',
    name: 'Reciprocity',
    summary: 'A small gift or favor first, to create a sense of obligation.',
    explanation:
      'A free trial, a small "bonus", or a helpful favor is offered first so you feel you owe something back. The obligation is then cashed in for money or information.',
    example:
      'We have credited ₹100 to your wallet as a welcome gift. Just pay the ₹50 activation to withdraw it.',
  },
  {
    id: 'familiarity-impersonation',
    name: 'Familiarity and Impersonation',
    summary: 'Pretending to be a known contact ("Mom, I lost my phone").',
    explanation:
      'The sender poses as someone you trust — a child, a boss, a friend on a new number — so your guard drops. The "new number" detail pre-explains why the voice or account is different.',
    example:
      'Hi mom, I dropped my phone and this is my temporary number. I need money urgently, can you send it now?',
  },
  {
    id: 'isolation-secrecy',
    name: 'Isolation and Secrecy',
    summary: 'Urging the target to act alone and tell no one.',
    explanation:
      'You are told to keep it confidential and not consult family, bank, or police. Secrecy removes the one thing that reliably stops scams: a second opinion.',
    example:
      'Do not discuss this case with anyone, including family, or you will be considered a co-accused.',
  },
  {
    id: 'commitment-escalation',
    name: 'Commitment Escalation',
    summary: '"You have already invested, add a little more" (investment and crypto scams).',
    explanation:
      'After a small first step, you are pushed to commit more to "unlock", "recover", or "double" what you put in. Each step uses your prior investment as the reason to risk the next.',
    example:
      'Your withdrawal is ready but a 10% tax must be paid first to release your ₹2,00,000 profit.',
  },
  {
    id: 'intimidation-blackmail',
    name: 'Intimidation and Blackmail',
    summary: 'Sextortion, legal threats, or account or police action.',
    explanation:
      'The message threatens exposure, arrest, or harm unless you pay or comply. The shame and fear are designed to keep you from reporting it or asking for help.',
    example:
      'We have your private video. Pay within 24 hours or it will be sent to all your contacts.',
  },
];

export const TACTIC_IDS = TACTICS.map((t) => t.id);

export function getTactic(id: string): Tactic | undefined {
  return TACTICS.find((t) => t.id === id);
}

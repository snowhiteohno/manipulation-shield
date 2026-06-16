import type { FlaggedPhrase } from './types';

export type Segment = { text: string; reason?: string; key: string };

// Build non-overlapping segments of the message: plain runs and highlighted
// runs. Matching is case-insensitive and handles multiple occurrences; phrases
// not found verbatim are skipped rather than crashing (ARCHITECTURE §7).
export function segmentMessage(message: string, phrases: FlaggedPhrase[]): Segment[] {
  const lower = message.toLowerCase();
  const ranges: { start: number; end: number; reason: string }[] = [];

  for (const { phrase, reason } of phrases) {
    if (!phrase) continue;
    const needle = phrase.toLowerCase();
    let from = 0;
    let idx = lower.indexOf(needle, from);
    while (idx !== -1) {
      ranges.push({ start: idx, end: idx + phrase.length, reason });
      from = idx + phrase.length;
      idx = lower.indexOf(needle, from);
    }
  }

  // Sort and drop overlaps (keep the earliest-starting range).
  ranges.sort((a, b) => a.start - b.start);
  const kept: typeof ranges = [];
  let cursor = 0;
  for (const r of ranges) {
    if (r.start >= cursor) {
      kept.push(r);
      cursor = r.end;
    }
  }

  const segments: Segment[] = [];
  let pos = 0;
  kept.forEach((r, i) => {
    if (r.start > pos) {
      segments.push({ text: message.slice(pos, r.start), key: `p${pos}` });
    }
    segments.push({ text: message.slice(r.start, r.end), reason: r.reason, key: `h${i}` });
    pos = r.end;
  });
  if (pos < message.length) {
    segments.push({ text: message.slice(pos), key: `p${pos}` });
  }
  return segments;
}

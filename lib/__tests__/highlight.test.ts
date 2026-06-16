import { segmentMessage } from '../highlight';

describe('segmentMessage', () => {
  it('returns a single plain segment when nothing is flagged', () => {
    const segs = segmentMessage('all clear here', []);
    expect(segs).toHaveLength(1);
    expect(segs[0].reason).toBeUndefined();
    expect(segs[0].text).toBe('all clear here');
  });

  it('highlights an exact phrase and preserves surrounding text', () => {
    const segs = segmentMessage('please verify now', [{ phrase: 'verify', reason: 'r' }]);
    expect(segs.map((s) => s.text).join('')).toBe('please verify now');
    const highlighted = segs.filter((s) => s.reason);
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0].text).toBe('verify');
  });

  it('matches case-insensitively but keeps the original casing', () => {
    const segs = segmentMessage('VERIFY your account', [{ phrase: 'verify', reason: 'r' }]);
    expect(segs[0].text).toBe('VERIFY');
    expect(segs[0].reason).toBe('r');
  });

  it('highlights multiple occurrences of the same phrase', () => {
    const segs = segmentMessage('pay now, pay again', [{ phrase: 'pay', reason: 'r' }]);
    expect(segs.filter((s) => s.reason)).toHaveLength(2);
  });

  it('skips phrases not found verbatim rather than crashing', () => {
    const segs = segmentMessage('hello world', [{ phrase: 'not present', reason: 'r' }]);
    expect(segs).toHaveLength(1);
    expect(segs[0].reason).toBeUndefined();
  });

  it('drops overlapping ranges, keeping the earliest', () => {
    // "account" and "count" overlap; only one highlight should survive.
    const segs = segmentMessage('your account', [
      { phrase: 'account', reason: 'a' },
      { phrase: 'count', reason: 'b' },
    ]);
    const highlighted = segs.filter((s) => s.reason);
    expect(highlighted).toHaveLength(1);
    expect(highlighted[0].text).toBe('account');
  });
});

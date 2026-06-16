import { parseResult, validateAnalysis } from '../gemini';
import { AnalysisError } from '../types';

const valid = {
  riskLevel: 'high',
  isLikelyScam: true,
  summary: 'A fake bank alert pressuring you to verify.',
  tactics: [
    {
      tacticId: 'fake-verification',
      name: 'Fake Verification',
      whatItsDoing: 'Asks for your OTP under the guise of security.',
      whyItWorks: 'Calling it verification makes it feel routine.',
    },
  ],
  flaggedPhrases: [{ phrase: 'share the OTP', reason: 'Never share an OTP.' }],
  recommendedAction: 'Call your bank using the number on your card.',
};

describe('validateAnalysis', () => {
  it('accepts a well-formed result', () => {
    const r = validateAnalysis(valid);
    expect(r.riskLevel).toBe('high');
    expect(r.tactics).toHaveLength(1);
    expect(r.flaggedPhrases[0].phrase).toBe('share the OTP');
  });

  it('rejects an unknown risk level', () => {
    expect(() => validateAnalysis({ ...valid, riskLevel: 'critical' })).toThrow(AnalysisError);
  });

  it('rejects a missing required field', () => {
    const { summary, ...rest } = valid;
    expect(() => validateAnalysis(rest)).toThrow(AnalysisError);
  });

  it('rejects non-object input', () => {
    expect(() => validateAnalysis('nope')).toThrow(AnalysisError);
    expect(() => validateAnalysis(null)).toThrow(AnalysisError);
  });

  it('drops tactics outside the fixed 12-id set', () => {
    const r = validateAnalysis({
      ...valid,
      tactics: [
        ...valid.tactics,
        {
          tacticId: 'made-up-tactic',
          name: 'Invented',
          whatItsDoing: 'x',
          whyItWorks: 'y',
        },
      ],
    });
    expect(r.tactics).toHaveLength(1);
    expect(r.tactics[0].tacticId).toBe('fake-verification');
  });

  it('drops malformed flagged phrases instead of crashing', () => {
    const r = validateAnalysis({
      ...valid,
      flaggedPhrases: [{ phrase: 'ok', reason: 'fine' }, { phrase: 123 }, null],
    });
    expect(r.flaggedPhrases).toHaveLength(1);
  });
});

describe('parseResult', () => {
  it('parses a JSON string from the model', () => {
    const r = parseResult(JSON.stringify(valid));
    expect(r.isLikelyScam).toBe(true);
  });

  it('throws on non-JSON text', () => {
    expect(() => parseResult('not json at all')).toThrow();
  });
});

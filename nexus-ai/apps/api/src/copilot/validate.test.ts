import { describe, expect, it } from 'vitest';
import { validateInvestigation } from './validate.js';

const base = {
  abstain: false,
  missingInfo: ['x'],
  recommendedNextStep: 'Check the deploy',
};

describe('validateInvestigation', () => {
  it('keeps hypotheses with valid citations', () => {
    const r = validateInvestigation(
      {
        ...base,
        hypotheses: [
          {
            statement: 'Config change caused timeouts',
            likelihood: 'likely',
            evidenceIds: ['E1', 'E2'],
            againstIds: [],
          },
        ],
      },
      ['E1', 'E2'],
    );
    expect(r.status).toBe('complete');
    expect(r.hypotheses).toHaveLength(1);
    expect(r.hypotheses[0].evidenceIds).toEqual(['E1', 'E2']);
  });

  it('strips citations to evidence that does not exist', () => {
    const r = validateInvestigation(
      {
        ...base,
        hypotheses: [
          {
            statement: 'Config change caused timeouts',
            likelihood: 'likely',
            evidenceIds: ['E1', 'E99'],
            againstIds: [],
          },
        ],
      },
      ['E1'],
    );
    expect(r.hypotheses[0].evidenceIds).toEqual(['E1']);
  });

  it('drops unsupported claims and abstains when none survive', () => {
    const r = validateInvestigation(
      {
        ...base,
        hypotheses: [
          {
            statement: 'Cosmic rays flipped a bit',
            likelihood: 'likely',
            evidenceIds: ['E42'],
            againstIds: [],
          },
        ],
      },
      ['E1'],
    );
    expect(r.status).toBe('abstained');
    expect(r.droppedClaims).toBe(1);
    expect(r.hypotheses).toHaveLength(0);
  });

  it('fails closed on malformed output', () => {
    const r = validateInvestigation({ nonsense: true }, ['E1']);
    expect(r.status).toBe('failed');
  });

  it('respects an explicit abstention', () => {
    const r = validateInvestigation(
      { ...base, abstain: true, abstainReason: 'No traces', hypotheses: [] },
      ['E1'],
    );
    expect(r.status).toBe('abstained');
    expect(r.abstainReason).toBe('No traces');
  });
});

import { z } from 'zod';
import type { Hypothesis, Investigation } from '@nexus/shared';

/** Shape we ask the model to return. Anything else is rejected. */
export const ModelOutput = z.object({
  abstain: z.boolean(),
  abstainReason: z.string().optional(),
  hypotheses: z
    .array(
      z.object({
        statement: z.string().min(10),
        likelihood: z.enum(['likely', 'possible', 'unlikely', 'very_unlikely']),
        evidenceIds: z.array(z.string()),
        againstIds: z.array(z.string()).default([]),
      }),
    )
    .max(5),
  missingInfo: z.array(z.string()).max(8),
  recommendedNextStep: z.string(),
});
export type ModelOutput = z.infer<typeof ModelOutput>;

export type ValidatedResult = Pick<
  Investigation,
  | 'status'
  | 'hypotheses'
  | 'missingInfo'
  | 'recommendedNextStep'
  | 'abstainReason'
  | 'droppedClaims'
>;

/**
 * Enforces the product rule "every AI claim links to evidence the user can see".
 * - Citations to unknown evidence ids are stripped.
 * - A hypothesis with no remaining supporting OR opposing evidence is dropped.
 * - If nothing survives, the investigation becomes an abstention.
 */
export function validateInvestigation(raw: unknown, allowedEvidenceIds: string[]): ValidatedResult {
  const parsed = ModelOutput.safeParse(raw);
  if (!parsed.success) {
    return {
      status: 'failed',
      hypotheses: [],
      missingInfo: [],
      recommendedNextStep:
        'Investigate manually. The copilot returned output that failed validation.',
      abstainReason: 'Output did not match the required format.',
      droppedClaims: 0,
    };
  }
  const allowed = new Set(allowedEvidenceIds);
  const out = parsed.data;
  let dropped = 0;
  const hypotheses: Hypothesis[] = [];
  for (const h of out.hypotheses) {
    const evidenceIds = h.evidenceIds.filter((id) => allowed.has(id));
    const againstIds = h.againstIds.filter((id) => allowed.has(id));
    if (evidenceIds.length === 0 && againstIds.length === 0) {
      dropped++;
      continue;
    }
    hypotheses.push({
      id: `H${hypotheses.length + 1}`,
      rank: hypotheses.length + 1,
      statement: h.statement,
      likelihood: h.likelihood,
      evidenceIds,
      againstIds,
    });
  }

  if (out.abstain || hypotheses.length === 0) {
    return {
      status: 'abstained',
      hypotheses,
      missingInfo: out.missingInfo,
      recommendedNextStep: out.recommendedNextStep,
      abstainReason: out.abstainReason ?? 'Not enough evidence to rank a root cause.',
      droppedClaims: dropped,
    };
  }
  return {
    status: 'complete',
    hypotheses,
    missingInfo: out.missingInfo,
    recommendedNextStep: out.recommendedNextStep,
    droppedClaims: dropped,
  };
}

import type { Concept } from "./types";

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateConcept(
  c: Concept,
  knownProblemIds: Set<string>,
  knownVisualKeys: Set<string>,
): string[] {
  const errors: string[] = [];
  if (!KEBAB.test(c.slug)) errors.push(`slug must be kebab-case: ${c.slug}`);
  if (!c.title) errors.push(`concept ${c.slug} missing title`);
  if (!c.oneLiner) errors.push(`concept ${c.slug} missing oneLiner`);
  if (!c.definition) errors.push(`concept ${c.slug} missing definition`);
  if (!c.examples || c.examples.length === 0) errors.push(`concept ${c.slug} has no examples`);
  if (!c.realWorldUseCases || c.realWorldUseCases.length === 0) errors.push(`concept ${c.slug} has no use cases`);
  for (const id of c.relatedProblemIds) {
    if (!knownProblemIds.has(id)) errors.push(`concept ${c.slug} references unknown problem: ${id}`);
  }
  if (!knownVisualKeys.has(c.visual)) errors.push(`concept ${c.slug} references unknown visual: ${c.visual}`);
  return errors;
}

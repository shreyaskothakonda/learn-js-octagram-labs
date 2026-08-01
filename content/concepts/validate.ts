import type { Concept } from "./types";

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateConcept(
  c: Concept,
  knownProblemIds: Set<string>,
  knownVisualKeys: Set<string>,
  knownTopics: Set<string>,
  knownSlugs: Set<string>,
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
  if (!knownTopics.has(c.topic)) errors.push(`concept ${c.slug} references unknown topic: ${c.topic}`);
  if (c.check) {
    if (c.check.options.length < 2 || c.check.options.length > 4) {
      errors.push(`concept ${c.slug} check needs 2-4 options`);
    }
    if (!Number.isInteger(c.check.answerIndex) || c.check.answerIndex < 0 || c.check.answerIndex >= c.check.options.length) {
      errors.push(`concept ${c.slug} check answerIndex out of range`);
    }
  }
  if (c.pitfalls) {
    for (const p of c.pitfalls) {
      if (!p) {
        errors.push(`concept ${c.slug} has an empty pitfall`);
        break;
      }
    }
  }
  if (c.keyTakeaways) {
    for (const t of c.keyTakeaways) {
      if (!t) {
        errors.push(`concept ${c.slug} has an empty takeaway`);
        break;
      }
    }
  }
  if (c.related) {
    for (const r of c.related) {
      if (!knownSlugs.has(r)) errors.push(`concept ${c.slug} references unknown related concept: ${r}`);
      if (r === c.slug) errors.push(`concept ${c.slug} lists itself as related`);
    }
  }
  return errors;
}

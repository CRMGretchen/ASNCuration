import type { ContentAsset } from "../types";

export interface RelevanceResult {
  score: number;
  reasons: string[];
}

/**
 * Produces a relevance score and human-readable explanations for why an asset
 * surfaces for the curator's current context and search query. This is a
 * lightweight, explainable heuristic — not a real ranking model.
 */
export function scoreAsset(
  asset: ContentAsset,
  contextId: string | null,
  query: string
): RelevanceResult {
  const reasons: string[] = [];
  let score = 0;

  if (contextId && asset.sourceContextIds.includes(contextId)) {
    score += 50;
    reasons.push("Directly tied to your selected context");
  }

  const q = query.trim().toLowerCase();
  if (q.length > 0) {
    const haystack = [
      asset.title,
      asset.summary,
      ...asset.tags,
      asset.sourceLabel,
    ]
      .join(" ")
      .toLowerCase();
    if (asset.title.toLowerCase().includes(q)) {
      score += 30;
      reasons.push(`Title matches "${query}"`);
    } else if (haystack.includes(q)) {
      score += 15;
      reasons.push(`Mentions "${query}"`);
    }
    const matchedTags = asset.tags.filter((t) => t.toLowerCase().includes(q));
    if (matchedTags.length > 0 && !asset.title.toLowerCase().includes(q)) {
      reasons.push(`Tagged ${matchedTags.join(", ")}`);
    }
  }

  const daysOld =
    (Date.now() - new Date(asset.lastUpdated).getTime()) / (1000 * 60 * 60 * 24);
  if (daysOld < 30) {
    score += 8;
    reasons.push("Recently updated");
  } else if (daysOld > 150) {
    score -= 5;
  }

  if (asset.durationMinutes <= 8) {
    reasons.push("Quick to consume");
  }

  if (reasons.length === 0) {
    reasons.push("Part of the canonical content library");
  }

  return { score, reasons };
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} hr` : `${hours} hr ${rest} min`;
}

export function formatRelativeFreshness(iso: string): string {
  const days = Math.round(
    (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days <= 0) return "Updated today";
  if (days === 1) return "Updated yesterday";
  if (days < 30) return `Updated ${days} days ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `Updated ${months} mo ago`;
  return `Updated ${Math.round(months / 12)} yr ago`;
}

export type AssetType =
  | "video"
  | "lab"
  | "module"
  | "playlist"
  | "assessment"
  | "page";

export type RecommendedUse =
  | "short intro"
  | "deep dive"
  | "hands-on lab"
  | "go deeper"
  | "check understanding"
  | "quick refresher";

export type ContextKind = "credential" | "course" | "event" | "role";

export interface JourneyContext {
  id: string;
  kind: ContextKind;
  title: string;
  description: string;
  tags: string[];
}

export interface PageUnit {
  id: string;
  title: string;
  durationMinutes: number;
}

export interface ContentAsset {
  id: string;
  type: AssetType;
  title: string;
  summary: string;
  durationMinutes: number;
  owner: string;
  lastUpdated: string; // ISO date
  sourceLabel: string; // e.g. "Module: Match tools to tasks"
  sourceContextIds: string[]; // which JourneyContext(s) this belongs to
  recommendedUse: RecommendedUse;
  tags: string[];
  breadcrumb: string[]; // ordered lineage, e.g. [credential, course, module, page]
  pages?: PageUnit[]; // present only for modules, to allow "include pages/units"
  freshnessWarning?: string; // governance note, e.g. stale content
  isCanonical: boolean;
}

export interface PlaylistItem {
  key: string; // unique key within playlist (asset id or asset id + page id)
  assetId: string;
  pageId?: string; // if this item is a specific page/unit inside a module
}

export interface JourneyDefinition {
  contextId: string | null;
  audience: string;
  timeCommitment: string; // e.g. "15-20 minutes"
  goal: string;
  title: string;
}

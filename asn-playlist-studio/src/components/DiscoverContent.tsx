import { useMemo, useState } from "react";
import { contentAssets, getContextById } from "../data/content";
import type { AssetType, ContentLevel, JourneyDefinition, PlaylistItem } from "../types";
import ResultCard from "./ResultCard";
import { scoreAsset } from "../utils/relevance";
import { ASSET_TYPE_META } from "./AssetTypeBadge";

interface Props {
  journey: JourneyDefinition;
  playlistItems: PlaylistItem[];
  onAdd: (assetId: string, pageId?: string) => void;
  onRemove: (key: string) => void;
}

const ALL_TYPES = Object.keys(ASSET_TYPE_META) as AssetType[];
const SEARCHABLE_TYPES = ALL_TYPES.filter((t) => t !== "page");
const LEVEL_OPTIONS: ContentLevel[] = ["Beginner", "Intermediate", "Advanced"];
const AUDIENCE_OPTIONS = Array.from(new Set(contentAssets.map((a) => a.audience))).sort();

export default function DiscoverContent({ journey, playlistItems, onAdd, onRemove }: Props) {
  const [query, setQuery] = useState("");
  const [activeTypes, setActiveTypes] = useState<Set<AssetType>>(new Set(SEARCHABLE_TYPES));
  const [includePages, setIncludePages] = useState(false);
  const [officialOnly, setOfficialOnly] = useState(false);
  const [level, setLevel] = useState<ContentLevel | "">("");
  const [audience, setAudience] = useState<string>("");

  const context = journey.contextId ? getContextById(journey.contextId) : undefined;

  const results = useMemo(() => {
    return contentAssets
      .filter((a) => activeTypes.has(a.type))
      .filter((a) => (officialOnly ? a.isMicrosoftOfficial : true))
      .filter((a) => (level ? a.level === level : true))
      .filter((a) => (audience ? a.audience === audience : true))
      .map((a) => ({ asset: a, ...scoreAsset(a, journey.contextId, query) }))
      .filter((r) => (query.trim() ? r.score > 0 : true))
      .sort((a, b) => b.score - a.score);
  }, [activeTypes, officialOnly, level, audience, journey.contextId, query]);

  function toggleType(t: AssetType) {
    setActiveTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  }

  return (
    <section className="panel">
      <header className="panel__header">
        <h2>Discover canonical content</h2>
        <p>
          Search across the trusted content library. Results are explained, not just ranked — see
          exactly why each asset surfaced for{" "}
          {context ? <strong>{context.title}</strong> : "your playlist"}.
        </p>
      </header>

      <div className="search-bar">
        <input
          className="text-input search-input"
          placeholder="Search videos, labs, modules, assessments…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="filter-row">
        <div className="filter-chips">
          {SEARCHABLE_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              className={`type-filter ${activeTypes.has(t) ? "is-active" : ""}`}
              style={{ "--filter-color": ASSET_TYPE_META[t].color } as React.CSSProperties}
              onClick={() => toggleType(t)}
            >
              {ASSET_TYPE_META[t].icon} {ASSET_TYPE_META[t].label}
            </button>
          ))}
        </div>

        <div className="toggle-row">
          <label className="toggle">
            <input
              type="checkbox"
              checked={includePages}
              onChange={(e) => setIncludePages(e.target.checked)}
            />
            <span className="toggle__track">
              <span className="toggle__thumb" />
            </span>
            Include pages/units
          </label>

          <label className="toggle">
            <input
              type="checkbox"
              checked={officialOnly}
              onChange={(e) => setOfficialOnly(e.target.checked)}
            />
            <span className="toggle__track">
              <span className="toggle__thumb" />
            </span>
            Only Microsoft Official Content
          </label>
        </div>
      </div>

      <div className="dropdown-row">
        <div className="field-group field-group--inline">
          <label className="field-label">Level</label>
          <select
            className="text-input"
            value={level}
            onChange={(e) => setLevel(e.target.value as ContentLevel | "")}
          >
            <option value="">Any level</option>
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="field-group field-group--inline">
          <label className="field-label">Audience</label>
          <select
            className="text-input"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
          >
            <option value="">Any audience</option>
            {AUDIENCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="result-count">
        {results.length} result{results.length === 1 ? "" : "s"}
        {query.trim() && ` for "${query}"`}
      </div>

      <div className="result-list">
        {results.map(({ asset }) => (
          <ResultCard
            key={asset.id}
            asset={asset}
            contextId={journey.contextId}
            query={query}
            playlistItems={playlistItems}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
        {results.length === 0 && (
          <div className="empty-state">
            No matches. Try clearing filters or searching a broader term like "Copilot" or "Scout".
          </div>
        )}
      </div>
    </section>
  );
}


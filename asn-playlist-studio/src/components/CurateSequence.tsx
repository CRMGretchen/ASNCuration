import { getAssetById } from "../data/content";
import type { PageUnit, PlaylistItem } from "../types";
import AssetTypeBadge from "./AssetTypeBadge";
import { formatDuration } from "../utils/relevance";

interface Props {
  playlistItems: PlaylistItem[];
  onRemove: (key: string) => void;
  onMove: (key: string, direction: "up" | "down") => void;
}

export default function CurateSequence({ playlistItems, onRemove, onMove }: Props) {
  const enriched = playlistItems
    .map((item) => {
      const asset = getAssetById(item.assetId);
      if (!asset) return null;
      const page = item.pageId ? asset.pages?.find((p: PageUnit) => p.id === item.pageId) : undefined;
      const title = page ? page.title : asset.title;
      const duration = page ? page.durationMinutes : asset.durationMinutes;
      return { item, asset, page, title, duration };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const totalMinutes = enriched.reduce((sum, e) => sum + e.duration, 0);

  const mix = enriched.reduce<Record<string, number>>((acc, e) => {
    const key = e.page ? "page" : e.asset.type;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const warnings = enriched.filter((e) => e.asset.freshnessWarning);
  const uniqueSources = new Set(enriched.map((e) => e.asset.sourceLabel));

  return (
    <section className="panel">
      <header className="panel__header">
        <h2>Curate the sequence</h2>
        <p>Order your playlist. Every item is a live reference to canonical content — nothing is copied.</p>
      </header>

      <div className="summary-strip">
        <div className="summary-stat">
          <span className="summary-stat__value">{formatDuration(totalMinutes)}</span>
          <span className="summary-stat__label">Total learner time</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat__value">{enriched.length}</span>
          <span className="summary-stat__label">Items</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat__value">{Object.keys(mix).length}</span>
          <span className="summary-stat__label">Asset type mix</span>
        </div>
        <div className="summary-stat">
          <span className="summary-stat__value">{uniqueSources.size}</span>
          <span className="summary-stat__label">Source modules/courses</span>
        </div>
      </div>

      {Object.keys(mix).length > 0 && (
        <div className="mix-bar">
          {Object.entries(mix).map(([type, count]) => (
            <span
              key={type}
              className="mix-bar__segment"
              style={{ flexGrow: count }}
              title={`${type}: ${count}`}
            >
              {type} × {count}
            </span>
          ))}
        </div>
      )}

      {warnings.length > 0 && (
        <div className="governance-banner">
          <strong>⚠ Governance notes</strong>
          <ul>
            {warnings.map((w) => (
              <li key={w.item.key}>
                <em>{w.title}</em>: {w.asset.freshnessWarning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {enriched.length === 0 ? (
        <div className="empty-state">
          Your playlist is empty. Go back to Discover content and add a few assets.
        </div>
      ) : (
        <ol className="sequence-list">
          {enriched.map(({ item, asset, page, title, duration }, idx) => (
            <li key={item.key} className="sequence-item">
              <span className="sequence-item__index">{idx + 1}</span>
              <div className="sequence-item__body">
                <div className="sequence-item__top">
                  <AssetTypeBadge type={page ? "page" : asset.type} size="sm" />
                  <span className="sequence-item__title">{title}</span>
                </div>
                <div className="sequence-item__meta">
                  <span>{formatDuration(duration)}</span>
                  <span className="dot">•</span>
                  <span>{asset.sourceLabel}</span>
                  {page && (
                    <>
                      <span className="dot">•</span>
                      <span>from “{asset.title}”</span>
                    </>
                  )}
                </div>
              </div>
              <div className="sequence-item__actions">
                <button
                  type="button"
                  className="icon-btn"
                  disabled={idx === 0}
                  onClick={() => onMove(item.key, "up")}
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="icon-btn"
                  disabled={idx === enriched.length - 1}
                  onClick={() => onMove(item.key, "down")}
                  aria-label="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="icon-btn icon-btn--danger"
                  onClick={() => onRemove(item.key)}
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

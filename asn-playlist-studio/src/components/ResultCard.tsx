import { useState } from "react";
import type { ContentAsset, PlaylistItem } from "../types";
import AssetTypeBadge from "./AssetTypeBadge";
import { formatDuration, formatRelativeFreshness, scoreAsset } from "../utils/relevance";

interface Props {
  asset: ContentAsset;
  contextId: string | null;
  query: string;
  playlistItems: PlaylistItem[];
  onAdd: (assetId: string, pageId?: string) => void;
  onRemove: (key: string) => void;
}

export default function ResultCard({
  asset,
  contextId,
  query,
  playlistItems,
  onAdd,
  onRemove,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const { reasons } = scoreAsset(asset, contextId, query);
  const isInPlaylist = playlistItems.some(
    (i) => i.assetId === asset.id && !i.pageId
  );

  return (
    <article className="result-card">
      <div className="result-card__main">
        <div className="result-card__top">
          <AssetTypeBadge type={asset.type} />
          <span className="chip chip--use">{asset.recommendedUse}</span>
          {asset.freshnessWarning && (
            <span className="chip chip--warning" title={asset.freshnessWarning}>
              ⚠ Governance note
            </span>
          )}
        </div>
        <h3 className="result-card__title">{asset.title}</h3>
        <p className="result-card__summary">{asset.summary}</p>

        <div className="result-card__meta">
          <span>{formatDuration(asset.durationMinutes)}</span>
          <span className="dot">•</span>
          <span>{asset.owner}</span>
          <span className="dot">•</span>
          <span>{formatRelativeFreshness(asset.lastUpdated)}</span>
          <span className="dot">•</span>
          <span className="result-card__source">{asset.sourceLabel}</span>
        </div>

        <div className="result-card__reasons">
          {reasons.map((r) => (
            <span key={r} className="reason-pill">
              {r}
            </span>
          ))}
        </div>

        {asset.freshnessWarning && (
          <p className="result-card__warning-text">⚠ {asset.freshnessWarning}</p>
        )}

        {asset.pages && asset.pages.length > 0 && (
          <button
            type="button"
            className="link-btn"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Hide" : "Show"} {asset.pages.length} pages/units
          </button>
        )}

        {expanded && asset.pages && (
          <ul className="page-list">
            {asset.pages.map((pg) => {
              const key = `${asset.id}::${pg.id}`;
              const added = playlistItems.some((i) => i.key === key);
              return (
                <li key={pg.id} className="page-list__item">
                  <span className="page-list__icon">▫</span>
                  <span className="page-list__title">{pg.title}</span>
                  <span className="page-list__duration">{formatDuration(pg.durationMinutes)}</span>
                  <button
                    type="button"
                    className={`btn btn--tiny ${added ? "btn--added" : "btn--outline"}`}
                    onClick={() => (added ? onRemove(key) : onAdd(asset.id, pg.id))}
                  >
                    {added ? "Added ✓" : "+ Add to playlist"}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="result-card__action">
        <button
          type="button"
          className={`btn ${isInPlaylist ? "btn--added" : "btn--primary"}`}
          onClick={() => (isInPlaylist ? onRemove(asset.id) : onAdd(asset.id))}
        >
          {isInPlaylist ? "Added ✓" : "+ Add to playlist"}
        </button>
      </div>
    </article>
  );
}

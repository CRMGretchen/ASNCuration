import { useState } from "react";
import { getAssetById } from "../data/content";
import type { JourneyDefinition, PageUnit, PlaylistItem } from "../types";
import AssetTypeBadge from "./AssetTypeBadge";
import { formatDuration } from "../utils/relevance";

interface Props {
  journey: JourneyDefinition;
  playlistItems: PlaylistItem[];
}

export default function LearnerPreview({ journey, playlistItems }: Props) {
  const [showBreadcrumbs, setShowBreadcrumbs] = useState(true);

  const enriched = playlistItems
    .map((item) => {
      const asset = getAssetById(item.assetId);
      if (!asset) return null;
      const page = item.pageId ? asset.pages?.find((p: PageUnit) => p.id === item.pageId) : undefined;
      return { item, asset, page };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const totalMinutes = enriched.reduce(
    (sum, e) => sum + (e.page ? e.page.durationMinutes : e.asset.durationMinutes),
    0
  );

  return (
    <section className="panel">
      <header className="panel__header panel__header--split">
        <div>
          <h2>Learner preview</h2>
          <p>This is what a learner sees when they open the playlist.</p>
        </div>
        <label className="toggle toggle--standalone">
          <input
            type="checkbox"
            checked={showBreadcrumbs}
            onChange={(e) => setShowBreadcrumbs(e.target.checked)}
          />
          <span className="toggle__track">
            <span className="toggle__thumb" />
          </span>
          Show breadcrumbs
        </label>
      </header>

      <div className="learner-hero">
        <span className="learner-hero__eyebrow">Curated playlist</span>
        <h3>{journey.title || "Untitled playlist"}</h3>
        <p>{journey.goal || "No learning goal set yet."}</p>
        <div className="learner-hero__meta">
          {journey.audience && <span className="chip">{journey.audience}</span>}
          {journey.timeCommitment && <span className="chip">{journey.timeCommitment}</span>}
          <span className="chip chip--accent">{formatDuration(totalMinutes)} total</span>
          <span className="chip">{enriched.length} items</span>
        </div>
      </div>

      {enriched.length === 0 ? (
        <div className="empty-state">Add items to the playlist to see the learner preview.</div>
      ) : (
        <ol className="learner-timeline">
          {enriched.map(({ item, asset, page }, idx) => {
            const title = page ? page.title : asset.title;
            const duration = page ? page.durationMinutes : asset.durationMinutes;
            const crumbs = page ? [...asset.breadcrumb, page.title] : asset.breadcrumb;
            return (
              <li key={item.key} className="learner-card">
                <div className="learner-card__marker">
                  <span>{idx + 1}</span>
                  {idx < enriched.length - 1 && <span className="learner-card__line" />}
                </div>
                <div className="learner-card__body">
                  <div className="learner-card__top">
                    <AssetTypeBadge type={page ? "page" : asset.type} size="sm" />
                    <span className="learner-card__duration">{formatDuration(duration)}</span>
                  </div>
                  <h4 className="learner-card__title">{title}</h4>
                  {showBreadcrumbs && (
                    <p className="learner-card__breadcrumb">
                      From {crumbs.join(" › ")}
                    </p>
                  )}
                  <p className="learner-card__summary">{asset.summary}</p>
                  <div className="learner-card__jump">
                    {page && (
                      <a className="jump-link" href="#preview">
                        Continue in full module: {asset.title} →
                      </a>
                    )}
                    <a className="jump-link jump-link--muted" href="#preview">
                      Open source: {asset.sourceLabel} →
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

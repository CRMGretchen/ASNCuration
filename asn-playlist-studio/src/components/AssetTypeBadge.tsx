import type { AssetType } from "../types";

export const ASSET_TYPE_META: Record<
  AssetType,
  { label: string; icon: string; color: string }
> = {
  video: { label: "Video", icon: "▶", color: "#7C5CFC" },
  lab: { label: "Lab", icon: "🧪", color: "#1F9D6E" },
  module: { label: "Module", icon: "▤", color: "#2E7DD1" },
  playlist: { label: "Playlist", icon: "≡", color: "#D1832E" },
  assessment: { label: "Assessment", icon: "✓", color: "#C2417A" },
  page: { label: "Page / Unit", icon: "▫", color: "#6B7280" },
};

interface Props {
  type: AssetType;
  size?: "sm" | "md";
}

export default function AssetTypeBadge({ type, size = "md" }: Props) {
  const meta = ASSET_TYPE_META[type];
  return (
    <span
      className={`asset-badge asset-badge--${size}`}
      style={{ "--badge-color": meta.color } as React.CSSProperties}
    >
      <span className="asset-badge__icon">{meta.icon}</span>
      {meta.label}
    </span>
  );
}

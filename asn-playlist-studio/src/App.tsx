import { useState } from "react";
import "./App.css";
import StepNav from "./components/StepNav";
import DefineJourney from "./components/DefineJourney";
import DiscoverContent from "./components/DiscoverContent";
import CurateSequence from "./components/CurateSequence";
import LearnerPreview from "./components/LearnerPreview";
import type { JourneyDefinition, PlaylistItem } from "./types";

const INITIAL_JOURNEY: JourneyDefinition = {
  contextId: "ctx-super-app-launch",
  audience: "",
  timeCommitment: "",
  goal: "",
  title: "",
};

function App() {
  const [step, setStep] = useState(1);
  const [furthestUnlocked, setFurthestUnlocked] = useState(1);
  const [journey, setJourney] = useState<JourneyDefinition>(INITIAL_JOURNEY);
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[]>([]);

  function goTo(next: number) {
    setStep(next);
    setFurthestUnlocked((prev) => Math.max(prev, next));
  }

  function addToPlaylist(assetId: string, pageId?: string) {
    const key = pageId ? `${assetId}::${pageId}` : assetId;
    setPlaylistItems((prev) => {
      if (prev.some((i) => i.key === key)) return prev;
      return [...prev, { key, assetId, pageId }];
    });
  }

  function removeFromPlaylist(key: string) {
    setPlaylistItems((prev) => prev.filter((i) => i.key !== key));
  }

  function moveItem(key: string, direction: "up" | "down") {
    setPlaylistItems((prev) => {
      const idx = prev.findIndex((i) => i.key === key);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
      return next;
    });
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__mark">✦</span>
          <div>
            <span className="app-header__title">AI Skills Navigator</span>
            <span className="app-header__subtitle">Playlist Studio</span>
          </div>
        </div>
        <p className="app-header__tagline">
          Build a launch playlist from trusted canonical content — no copies, no rebuilding.
        </p>
      </header>

      <StepNav current={step} furthestUnlocked={furthestUnlocked} onSelect={goTo} />

      <main className="app-main">
        {step === 1 && <DefineJourney journey={journey} onChange={setJourney} />}
        {step === 2 && (
          <DiscoverContent
            journey={journey}
            playlistItems={playlistItems}
            onAdd={addToPlaylist}
            onRemove={removeFromPlaylist}
          />
        )}
        {step === 3 && (
          <CurateSequence
            playlistItems={playlistItems}
            onRemove={removeFromPlaylist}
            onMove={moveItem}
          />
        )}
        {step === 4 && <LearnerPreview journey={journey} playlistItems={playlistItems} />}
      </main>

      <footer className="app-footer">
        <button
          type="button"
          className="btn btn--outline"
          disabled={step === 1}
          onClick={() => goTo(step - 1)}
        >
          ← Back
        </button>
        <span className="app-footer__status">
          {playlistItems.length} item{playlistItems.length === 1 ? "" : "s"} in playlist
        </span>
        <button
          type="button"
          className="btn btn--primary"
          disabled={step === 4}
          onClick={() => goTo(step + 1)}
        >
          {step === 3 ? "Preview learner experience →" : "Continue →"}
        </button>
      </footer>
    </div>
  );
}

export default App;

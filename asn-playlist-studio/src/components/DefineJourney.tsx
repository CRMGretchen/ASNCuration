import { journeyContexts } from "../data/content";
import type { ContextKind, JourneyDefinition } from "../types";

const KIND_LABEL: Record<ContextKind, string> = {
  credential: "Credential",
  course: "Course",
  event: "Launch moment / Event",
  role: "Role",
};

interface Props {
  journey: JourneyDefinition;
  onChange: (next: JourneyDefinition) => void;
}

const TIME_OPTIONS = ["10-15 minutes", "15-20 minutes", "20-30 minutes", "30-45 minutes", "45+ minutes"];

export default function DefineJourney({ journey, onChange }: Props) {
  return (
    <section className="panel">
      <header className="panel__header">
        <h2>Define your journey</h2>
        <p>
          Every great playlist starts with a purpose. Tell us the moment you're building for, who
          it's for, and what "done" looks like.
        </p>
      </header>

      <div className="field-group">
        <label className="field-label">Playlist title</label>
        <input
          className="text-input"
          placeholder="e.g. Super App Launch: Get Field-Ready in 20 Minutes"
          value={journey.title}
          onChange={(e) => onChange({ ...journey, title: e.target.value })}
        />
      </div>

      <div className="field-group">
        <label className="field-label">Anchor to a context</label>
        <p className="field-hint">
          Pick the credential, course, event, or role this playlist should be built around. Search
          results in the next step will be ranked against this context.
        </p>
        <div className="context-grid">
          {journeyContexts.map((ctx) => {
            const selected = journey.contextId === ctx.id;
            return (
              <button
                type="button"
                key={ctx.id}
                className={`context-card ${selected ? "is-selected" : ""}`}
                onClick={() => onChange({ ...journey, contextId: ctx.id })}
              >
                <span className={`context-card__kind context-card__kind--${ctx.kind}`}>
                  {KIND_LABEL[ctx.kind]}
                </span>
                <span className="context-card__title">{ctx.title}</span>
                <span className="context-card__desc">{ctx.description}</span>
                <span className="context-card__tags">
                  {ctx.tags.map((t) => (
                    <span key={t} className="chip chip--ghost">
                      {t}
                    </span>
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="field-row">
        <div className="field-group">
          <label className="field-label">Target audience</label>
          <input
            className="text-input"
            placeholder="e.g. Customer Success Managers"
            value={journey.audience}
            onChange={(e) => onChange({ ...journey, audience: e.target.value })}
          />
        </div>
        <div className="field-group">
          <label className="field-label">Learner time commitment</label>
          <select
            className="text-input"
            value={journey.timeCommitment}
            onChange={(e) => onChange({ ...journey, timeCommitment: e.target.value })}
          >
            <option value="">Choose a time budget…</option>
            {TIME_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">Learning goal</label>
        <textarea
          className="text-input text-input--area"
          rows={3}
          placeholder="e.g. Give CSMs enough confidence to demo Copilot, Scout, Cowork, and Code on day one of the launch."
          value={journey.goal}
          onChange={(e) => onChange({ ...journey, goal: e.target.value })}
        />
      </div>
    </section>
  );
}

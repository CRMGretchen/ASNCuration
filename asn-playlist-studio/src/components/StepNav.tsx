interface Step {
  id: number;
  title: string;
  subtitle: string;
}

export const STEPS: Step[] = [
  { id: 1, title: "Define journey", subtitle: "Set purpose & audience" },
  { id: 2, title: "Discover content", subtitle: "Search canonical assets" },
  { id: 3, title: "Curate sequence", subtitle: "Assemble the playlist" },
  { id: 4, title: "Preview experience", subtitle: "See it as a learner" },
];

interface Props {
  current: number;
  furthestUnlocked: number;
  onSelect: (step: number) => void;
}

export default function StepNav({ current, furthestUnlocked, onSelect }: Props) {
  return (
    <nav className="step-nav" aria-label="Playlist authoring steps">
      {STEPS.map((step, idx) => {
        const isActive = step.id === current;
        const isDone = step.id < current;
        const isLocked = step.id > furthestUnlocked;
        return (
          <button
            key={step.id}
            className={`step-nav__item ${isActive ? "is-active" : ""} ${
              isDone ? "is-done" : ""
            } ${isLocked ? "is-locked" : ""}`}
            onClick={() => !isLocked && onSelect(step.id)}
            disabled={isLocked}
            type="button"
          >
            <span className="step-nav__index">{isDone ? "✓" : step.id}</span>
            <span className="step-nav__text">
              <span className="step-nav__title">{step.title}</span>
              <span className="step-nav__subtitle">{step.subtitle}</span>
            </span>
            {idx < STEPS.length - 1 && <span className="step-nav__connector" />}
          </button>
        );
      })}
    </nav>
  );
}

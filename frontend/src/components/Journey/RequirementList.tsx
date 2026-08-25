import type { Requirement } from '../../types/journey';

type RequirementListProps = {
  requirements: Requirement[];
  onComplete: (requirementId: string) => void;
  completingRequirementId: string | null;
};

export function RequirementList({
  requirements,
  onComplete,
  completingRequirementId,
}: RequirementListProps) {
  if (requirements.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 rounded-xl bg-slate-50 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        Requirements
      </p>

      <div className="space-y-3">
        {requirements.map((requirement) => {
          const isCompleted =
            requirement.status === 'Completed';

          const isCompleting =
            completingRequirementId === requirement.id;

          return (
            <div
              key={requirement.id}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span
                  className={
                    isCompleted
                      ? 'font-bold text-emerald-600'
                      : 'text-slate-400'
                  }
                >
                  {isCompleted ? '✓' : '○'}
                </span>

                <span>{requirement.title}</span>
              </div>

              {!isCompleted && (
                <button
                  type="button"
                  disabled={isCompleting}
                  onClick={() =>
                    onComplete(requirement.id)
                  }
                  className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCompleting
                    ? 'Completing...'
                    : 'Complete'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
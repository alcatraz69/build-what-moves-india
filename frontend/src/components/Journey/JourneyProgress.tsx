type JourneyProgressProps = {
  completedSteps: number;
  totalSteps: number;
};

export function JourneyProgress({
  completedSteps,
  totalSteps,
}: JourneyProgressProps) {
  const progress =
    totalSteps > 0
      ? Math.round((completedSteps / totalSteps) * 100)
      : 0;

  const remainingSteps = Math.max(totalSteps - completedSteps, 0);

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Journey progress
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {completedSteps} of {totalSteps} steps completed
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold tracking-tight text-blue-700">
            {progress}%
          </p>

          <p className="text-xs text-slate-400">
            {remainingSteps === 0
              ? "Complete"
              : `${remainingSteps} ${
                  remainingSteps === 1 ? "step" : "steps"
                } remaining`}
          </p>
        </div>
      </div>

      <div
        className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Journey progress"
      >
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
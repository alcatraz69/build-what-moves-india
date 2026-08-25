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

  return (
    <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Journey progress
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {completedSteps} of {totalSteps} steps completed
          </p>
        </div>

        <span className="text-sm font-bold text-blue-700">
          {progress}%
        </span>
      </div>

      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"
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
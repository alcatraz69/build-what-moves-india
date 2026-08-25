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
      ? (completedSteps / totalSteps) * 100
      : 0;

  return (
    <div className="mt-8">
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-2 text-sm text-slate-500">
        {completedSteps} of {totalSteps} steps completed
      </p>
    </div>
  );
}
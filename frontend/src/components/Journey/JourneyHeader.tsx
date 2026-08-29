type JourneyHeaderProps = {
  status: string;
  currentStepTitle: string;
  referenceNumber: string;
};

export function JourneyHeader({
  status,
  currentStepTitle,
  referenceNumber,
}: JourneyHeaderProps) {
  const isCompleted = status === "Completed";

  return (
    <header className="border-b border-slate-100 pb-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Saarathi 2.0
            </span>

            <span className="text-slate-300">•</span>

            <span className="text-sm font-medium text-slate-400">
              Licence Journey
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Your driving licence journey
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Complete each step to move through your licence application.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Application reference
            </span>

            <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
              {referenceNumber}
            </span>
          </div>
        </div>

        <span
          className={[
            "w-fit shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold",
            isCompleted
              ? "bg-emerald-50 text-emerald-700"
              : "bg-blue-50 text-blue-700",
          ].join(" ")}
        >
          {status}
        </span>
      </div>

      {!isCompleted && (
        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Current step
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600" />

            <p className="text-sm font-semibold text-slate-800">
              {currentStepTitle}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

type JourneyHeaderProps = {
  status: string;
  currentStepTitle: string;
};

export function JourneyHeader({
  status,
  currentStepTitle,
}: JourneyHeaderProps) {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Licence Journey
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Get your driving licence
        </h1>

        <p className="mt-2 text-slate-500">
          Complete each step to move through your licence journey.
        </p>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Current step
          </p>

          <p className="mt-1 text-base font-semibold text-slate-900">
            {currentStepTitle}
          </p>
        </div>
      </div>

      <span
        className={[
          "w-fit rounded-full px-3 py-1.5 text-sm font-semibold",
          status === "Completed"
            ? "bg-emerald-50 text-emerald-700"
            : "bg-blue-50 text-blue-700",
        ].join(" ")}
      >
        {status}
      </span>
    </header>
  );
}
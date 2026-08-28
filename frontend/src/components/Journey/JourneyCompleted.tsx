type JourneyCompletedProps = {
  completedSteps: number;
  totalSteps: number;
  onStartNewJourney: () => void;
};

export function JourneyCompleted({
  completedSteps,
  totalSteps,
  onStartNewJourney,
}: JourneyCompletedProps) {
  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50">
      <div className="px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-8 w-8 text-emerald-600"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 12 4.5 4.5L19 7"
            />
          </svg>
        </div>

        <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-emerald-600">
          Saarathi 2.0
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-emerald-950">
          Your journey is complete
        </h2>

        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-emerald-800 sm:text-base">
          Congratulations! You've successfully completed all the steps in your
          driving licence journey.
        </p>

        <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-200 bg-white px-5 py-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Journey status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />

              <p className="text-sm font-semibold text-slate-900">
                Completed
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-white px-5 py-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Steps completed
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-900">
              {completedSteps} of {totalSteps}
            </p>
          </div>
        </div>

        <div className="mx-auto mt-6 max-w-xl rounded-xl border border-emerald-200 bg-white px-5 py-4 text-left">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-8h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
                />
              </svg>
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                What happens next?
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                You've completed the Saarathi 2.0 journey. In a real
                implementation, the final licence issuance and delivery
                details would be available here.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onStartNewJourney}
          className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Start a new journey →
        </button>
      </div>
    </div>
  );
}
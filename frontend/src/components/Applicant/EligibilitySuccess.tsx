type EligibilitySuccessProps = {
  loading: boolean;
  onStartJourney: () => void;
};

export function EligibilitySuccess({
  loading,
  onStartJourney,
}: EligibilitySuccessProps) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
          ✓
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-emerald-900">
            You're eligible
          </h2>

          <p className="mt-1 text-sm leading-6 text-emerald-800">
            Great — you meet the eligibility rules for starting your
            learner's licence journey.
          </p>

          <div className="mt-5 border-t border-emerald-200 pt-5">
            <h3 className="text-sm font-semibold text-emerald-900">
              What happens next
            </h3>

            <p className="mt-1 text-sm leading-6 text-emerald-800">
              We'll create a personalized journey for you, starting with
              your learner's licence application.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartJourney}
            disabled={loading}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Starting..." : "Start my journey →"}
          </button>
        </div>
      </div>
    </div>
  );
}
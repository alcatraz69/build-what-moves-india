type WaitingPeriodProps = {
  learnerLicenceIssuedAt: string | null;
};

export function WaitingPeriod({
  learnerLicenceIssuedAt,
}: WaitingPeriodProps) {
  if (!learnerLicenceIssuedAt) {
    return (
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          Your learner's licence issue date is not available yet.
        </p>
      </div>
    );
  }

  const issuedAt = new Date(learnerLicenceIssuedAt);
  const eligibleAt = new Date(issuedAt);
  eligibleAt.setDate(eligibleAt.getDate() + 30);

  const now = new Date();

  const millisecondsRemaining = eligibleAt.getTime() - now.getTime();

  const daysRemaining = Math.max(
    0,
    Math.ceil(millisecondsRemaining / (1000 * 60 * 60 * 24)),
  );

  const issuedDate = issuedAt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const eligibleDate = eligibleAt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mt-4 rounded-xl border border-blue-100 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Waiting period
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Your learner's licence was issued on{" "}
            <span className="font-semibold text-slate-900">
              {issuedDate}
            </span>
            .
          </p>
        </div>

        <div className="shrink-0 rounded-xl bg-blue-50 px-5 py-3 text-center">
          <p className="text-2xl font-bold text-blue-700">
            {daysRemaining}
          </p>

          <p className="text-xs font-semibold text-blue-600">
            {daysRemaining === 1 ? "day remaining" : "days remaining"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Issued</span>
          <span>Eligible date</span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  ((now.getTime() - issuedAt.getTime()) /
                    (eligibleAt.getTime() - issuedAt.getTime())) *
                    100,
                ),
              )}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs font-medium text-slate-600">
          <span>{issuedDate}</span>
          <span>{eligibleDate}</span>
        </div>
      </div>

      {daysRemaining > 0 ? (
        <p className="mt-5 text-sm text-slate-600">
          You can apply for your Driving Licence after{" "}
          <span className="font-semibold text-slate-900">
            {eligibleDate}
          </span>
          .
        </p>
      ) : (
        <p className="mt-5 text-sm font-semibold text-emerald-700">
          Your waiting period is complete. You can now apply for your Driving
          Licence.
        </p>
      )}
    </div>
  );
}
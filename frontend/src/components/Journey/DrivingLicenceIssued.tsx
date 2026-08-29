type DrivingLicenceIssuedProps = {
  referenceNumber: string;
  onComplete: () => void;
  completing: boolean;
};

export function DrivingLicenceIssued({
  referenceNumber,
  onComplete,
  completing,
}: DrivingLicenceIssuedProps) {
  const issueDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const licenceNumber = `KA-DL-2026-${referenceNumber
    .replace("SAR-", "")
    .toUpperCase()}`;

  return (
    <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
            ✓
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Licence issued
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-900">
              Driving Licence issued successfully
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your driving licence journey is now complete.
            </p>
          </div>
        </div>

        <span className="w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          Active
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Licence number
          </p>

          <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
            {licenceNumber}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Vehicle classes
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            LMV
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Issue date
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {issueDate}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-400">
            Application reference
          </p>

          <p className="mt-1 font-mono text-xs font-semibold text-slate-700">
            {referenceNumber}
          </p>
        </div>

        <button
          type="button"
          disabled={completing}
          onClick={onComplete}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {completing ? "Completing..." : "Complete Journey"}
        </button>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-400">
        Digital licence details shown for the Saarathi 2.0 prototype.
      </p>
    </div>
  );
}
import { useState } from "react";

type DrivingTestProps = {
  completing: boolean;
  onPass: () => void;
};

export function DrivingTest({
  completing,
  onPass,
}: DrivingTestProps) {
  const [scheduled, setScheduled] = useState(false);

  const appointmentDate = new Date();
  appointmentDate.setDate(appointmentDate.getDate() + 1);

  const formattedDate = appointmentDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (scheduled) {
    return (
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">
            ✓
          </div>

          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Driving test passed
          </p>

          <h3 className="mt-1 text-xl font-bold text-slate-900">
            Test successfully completed
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Your driving competence test has been successfully completed.
            You can now proceed to the final licence issuance step.
          </p>

          <button
            type="button"
            disabled={completing}
            onClick={onPass}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {completing ? "Completing..." : "Continue"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Driving Test
          </p>

          <h3 className="mt-1 text-base font-semibold text-slate-900">
            Driving competence test
          </h3>
        </div>

        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          Ready
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Appointment
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formattedDate}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            10:30 AM
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Vehicle class
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            LMV
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            Light Motor Vehicle
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Test centre
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            Local RTO
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            Regional Transport Office
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-slate-400">
          Simulated appointment for the Saarathi 2.0 prototype.
        </p>

        <button
          type="button"
          onClick={() => setScheduled(true)}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Simulate Driving Test
        </button>
      </div>
    </div>
  );
}
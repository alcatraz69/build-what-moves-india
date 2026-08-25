import { useState } from "react";
import { ApplicantForm } from "./ApplicantForm";
import type {
  Applicant,
  CreateApplicantRequest,
  RuleFailure,
} from "../../types/applicant";
import {
  createApplicant,
  createJourney,
} from "../../services/applicantService";
import type { Journey } from "../../types/journey";

type ApplicantPageProps = {
  onJourneyCreated: (journey: Journey) => void;
};

export function ApplicantPage({ onJourneyCreated }: ApplicantPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failures, setFailures] = useState<RuleFailure[]>([]);
  const [eligibleApplicant, setEligibleApplicant] = useState<Applicant | null>(
    null,
  );

  const handleSubmit = async (data: CreateApplicantRequest) => {
    try {
      setLoading(true);
      setError(null);
      setFailures([]);
      setEligibleApplicant(null);

      const applicant = await createApplicant(data);

      if (!applicant.isEligible) {
        setFailures(applicant.failures);
        return;
      }

      setEligibleApplicant(applicant);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartJourney = async () => {
    if (!eligibleApplicant) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const journey = await createJourney(eligibleApplicant.id);

      onJourneyCreated(journey);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start your journey.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Build What Moves India
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Get your driving licence
          </h1>

          <p className="mt-2 text-slate-500">
            Tell us a little about yourself to get started.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {failures.length > 0 && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h2 className="font-semibold text-amber-900">
              You're not eligible yet
            </h2>

            <ul className="mt-3 space-y-2 text-sm text-amber-800">
              {failures.map((failure) => (
                <li key={failure.rule}>• {failure.message}</li>
              ))}
            </ul>
          </div>
        )}

        {eligibleApplicant ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg text-emerald-700">
                ✓
              </div>

              <div>
                <h2 className="text-lg font-semibold text-emerald-900">
                  You're eligible
                </h2>

                <p className="mt-1 text-sm text-emerald-800">
                  You can start your learner's licence journey.
                </p>

                <button
                  type="button"
                  onClick={handleStartJourney}
                  disabled={loading}
                  className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Starting..." : "Start Journey"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <ApplicantForm onSubmit={handleSubmit} loading={loading} />
        )}
      </section>
    </main>
  );
}

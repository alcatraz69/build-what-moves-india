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
import OnboardingProgress from "./OnboardingProgress";
import { EligibilitySuccess } from "./EligibilitySuccess";
import { EligibilityFailure } from "./EligibilityFailure";

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
      <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            Build What Moves India
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Find your path to a driving licence
          </h1>

          <p className="mt-2 text-slate-500">
            Tell us a little about yourself and we'll guide you through the
            journey.
          </p>
        </div>

        <OnboardingProgress />

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {failures.length > 0 && <EligibilityFailure failures={failures} />}

        {eligibleApplicant ? (
          <EligibilitySuccess
            loading={loading}
            onStartJourney={handleStartJourney}
          />
        ) : (
          <ApplicantForm onSubmit={handleSubmit} loading={loading} />
        )}
      </section>
    </main>
  );
}

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
// import OnboardingProgress from "./OnboardingProgress";
import { EligibilitySuccess } from "./EligibilitySuccess";
import { EligibilityFailure } from "./EligibilityFailure";
import { SiteHeader } from "../Layout/SiteHeader";
import { SiteFooter } from "../Layout/SiteFooter";

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
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />

      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <section className="mx-auto grid max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:min-h-[calc(100vh-190px)] lg:grid-cols-2">

          {/* LEFT: Hero */}
          <div className="relative flex flex-col justify-center overflow-hidden bg-blue-800 px-6 py-10 sm:px-10 lg:px-12">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/5" />
            <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-white/5" />

            <div className="relative max-w-xl">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-blue-50">
                Driving Licence Services
              </span>

              <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Your driving licence journey, simplified.
              </h1>

              <p className="mt-4 max-w-lg text-base leading-7 text-blue-100">
                Check your eligibility, understand what's required, and follow
                every step of your application from start to finish.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-blue-50">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs">
                    ✓
                  </span>
                  <span>Check your eligibility</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-blue-50">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs">
                    ✓
                  </span>
                  <span>Follow a personalized journey</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-blue-50">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs">
                    ✓
                  </span>
                  <span>Get guidance with AI assistance</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Application */}
          <div
            id="application-form"
            className="flex items-center px-6 py-8 sm:px-10 lg:px-12"
          >
            <div className="w-full">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Get started
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  Start your application
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Tell us a little about yourself and we'll check your
                  eligibility.
                </p>
              </div>

              {/* <OnboardingProgress /> */}

              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {failures.length > 0 && (
                <EligibilityFailure failures={failures} />
              )}

              {eligibleApplicant ? (
                <EligibilitySuccess
                  loading={loading}
                  onStartJourney={handleStartJourney}
                />
              ) : (
                <ApplicantForm
                  onSubmit={handleSubmit}
                  loading={loading}
                />
              )}
            </div>
          </div>

        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
  

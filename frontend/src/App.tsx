import { useState, useEffect } from "react";
import { ApplicantPage } from "./components/Applicant/ApplicantPage";
import { JourneyHeader } from "./components/Journey/JourneyHeader";
import { JourneyProgress } from "./components/Journey/JourneyProgress";
import { JourneyStep } from "./components/Journey/JourneyStep";
import {
  completeRequirement,
  completeStep,
  evaluateWaitingPeriod,
  getJourney,
  retryStep,
} from "./services/journeyService";
import type { Journey } from "./types/journey";

function App() {
  const [applicantId, setApplicantId] = useState<string | null>(() =>
    localStorage.getItem("applicantId"),
  );

  const [journey, setJourney] = useState<Journey | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [completingRequirementId, setCompletingRequirementId] = useState<
    string | null
  >(null);

  const [completingStepId, setCompletingStepId] = useState<string | null>(null);

  const [retryingStepId, setRetryingStepId] = useState<string | null>(null);

  useEffect(() => {
    if (!applicantId) {
      return;
    }

    const restoreJourney = async () => {
      try {
        setError(null);

        const restoredJourney = await getJourney(applicantId);

        if (restoredJourney.currentStep === "WaitingPeriod") {
          const evaluatedJourney = await evaluateWaitingPeriod(
            restoredJourney.id,
          );

          setJourney(evaluatedJourney);
        } else {
          setJourney(restoredJourney);
        }
      } catch (err) {
        localStorage.removeItem("applicantId");
        setApplicantId(null);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to restore your journey.",
        );
      }
    };

    restoreJourney();
  }, [applicantId]);

  const handleCompleteRequirement = async (requirementId: string) => {
    if (!journey) {
      return;
    }

    const currentStep = journey.steps.find(
      (step) => step.type === journey.currentStep,
    );

    if (!currentStep) {
      return;
    }

    try {
      setCompletingRequirementId(requirementId);
      setError(null);

      const updatedJourney = await completeRequirement(
        journey.id,
        currentStep.id,
        requirementId,
      );

      setJourney(updatedJourney);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to complete requirement.",
      );
    } finally {
      setCompletingRequirementId(null);
    }
  };

  const handleCompleteStep = async (stepId: string) => {
    if (!journey) {
      return;
    }

    try {
      setCompletingStepId(stepId);
      setError(null);

      const updatedJourney = await completeStep(journey.id, stepId, "Pass");

      setJourney(updatedJourney);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete step.");
    } finally {
      setCompletingStepId(null);
    }
  };

  const handleRetryStep = async (stepId: string) => {
    if (!journey) {
      return;
    }

    try {
      setRetryingStepId(stepId);
      setError(null);

      const updatedJourney = await retryStep(journey.id, stepId);

      setJourney(updatedJourney);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to retry journey step.",
      );
    } finally {
      setRetryingStepId(null);
    }
  };

  const handleBackToHome = () => {
    localStorage.removeItem("applicantId");
    setApplicantId(null);
    setJourney(null);
    setError(null);
  };

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  if (applicantId && !journey) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Restoring your journey...</p>
      </main>
    );
  }

  if (!applicantId && !journey) {
    return (
      <ApplicantPage
        onJourneyCreated={(createdJourney) => {
          localStorage.setItem("applicantId", createdJourney.applicantId);

          setApplicantId(createdJourney.applicantId);
          setJourney(createdJourney);
        }}
      />
    );
  }

  if (!journey) {
    return null;
  }

  const isJourneyCompleted = journey.status === "Completed";

  const completedSteps = journey.steps.filter(
    (step) => step.status === "Completed",
  ).length;

  const currentStep = journey.steps.find(
    (step) => step.type === journey.currentStep,
  );

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <JourneyHeader
          status={journey.status}
          currentStepTitle={currentStep?.title ?? "Journey completed"}
        />

        <JourneyProgress
          completedSteps={completedSteps}
          totalSteps={journey.steps.length}
        />

        <div className="mt-8">
          {journey.steps.map((step, index) => (
            <JourneyStep
              key={step.id}
              step={step}
              index={index}
              learnerLicenceIssuedAt={journey.learnerLicenceIssuedAt}
              onCompleteRequirement={handleCompleteRequirement}
              completingRequirementId={completingRequirementId}
              onCompleteStep={() => handleCompleteStep(step.id)}
              completingStep={completingStepId === step.id}
              onRetryStep={() => handleRetryStep(step.id)}
              retryingStep={retryingStepId === step.id}
            />
          ))}
        </div>

        {isJourneyCompleted && (
          <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <div className="text-3xl">🎉</div>

            <h2 className="mt-3 text-lg font-semibold text-emerald-900">
              Journey completed
            </h2>

            <p className="mt-1 text-sm text-emerald-700">
              You have completed your driving licence journey.
            </p>

            <button
              type="button"
              onClick={handleBackToHome}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;

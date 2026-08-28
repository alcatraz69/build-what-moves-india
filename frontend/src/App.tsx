import { useState, useEffect } from "react";
import { ApplicantPage } from "./components/Applicant/ApplicantPage";
import { JourneyHeader } from "./components/Journey/JourneyHeader";
import { JourneyProgress } from "./components/Journey/JourneyProgress";
import { JourneyStep } from "./components/Journey/JourneyStep";
import { JourneyAssistant } from "./components/Journey/JourneyAssistant";
import {
  completeRequirement,
  completeStep,
  evaluateWaitingPeriod,
  getJourney,
  retryStep,
} from "./services/journeyService";
import type { Journey } from "./types/journey";
import { SiteHeader } from "./components/Layout/SiteHeader";
import { SiteFooter } from "./components/Layout/SiteFooter";
import { JourneyCompleted } from "./components/Journey/JourneyCompleted";

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

  const handleSimulateWaitingPeriod = async () => {
    if (!journey) {
      return;
    }

    try {
      setError(null);

      const updatedJourney = await evaluateWaitingPeriod(journey.id);

      setJourney(updatedJourney);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to simulate waiting period.",
      );
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
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="px-4 py-10 sm:px-6">
        <section className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <JourneyHeader
            status={journey.status}
            currentStepTitle={currentStep?.title ?? "Journey completed"}
          />

          <JourneyProgress
            completedSteps={completedSteps}
            totalSteps={journey.steps.length}
          />

          <JourneyAssistant applicantId={journey.applicantId} />

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
                onSimulateWaitingPeriod={handleSimulateWaitingPeriod}
                onRetryStep={() => handleRetryStep(step.id)}
                retryingStep={retryingStepId === step.id}
              />
            ))}
          </div>

          {isJourneyCompleted && (
            <JourneyCompleted
              completedSteps={completedSteps}
              totalSteps={journey.steps.length}
              onStartNewJourney={handleBackToHome}
            />
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import { JourneyHeader } from "./components/Journey/JourneyHeader";
import { JourneyProgress } from "./components/Journey/JourneyProgress";
import { JourneyStep } from "./components/Journey/JourneyStep";
import {
  completeRequirement,
  completeStep,
  getJourney,
} from "./services/journeyService";
import type { Journey } from "./types/journey";

const APPLICANT_ID = "c006e14c-c7cc-46f8-bd97-6e3f6c4901ca";

function App() {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingRequirementId, setCompletingRequirementId] = useState<
    string | null
  >(null);
  const [completingStepId, setCompletingStepId] = useState<string | null>(null);

  useEffect(() => {
    getJourney(APPLICANT_ID)
      .then(setJourney)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading your journey...</div>;
  }

  if (error || !journey) {
    return <div>{error ?? "Journey not found."}</div>;
  }

  const completedSteps = journey.steps.filter(
    (step) => step.status === "Completed",
  ).length;

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

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <section className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <JourneyHeader status={journey.status} />

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
              onCompleteRequirement={handleCompleteRequirement}
              completingRequirementId={completingRequirementId}
              onCompleteStep={() => handleCompleteStep(step.id)}
              completingStep={completingStepId === step.id}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;

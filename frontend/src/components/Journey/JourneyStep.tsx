import type { JourneyStep as JourneyStepType } from "../../types/journey";
import { RequirementList } from "./RequirementList";

type JourneyStepProps = {
  step: JourneyStepType;
  index: number;
  onCompleteRequirement: (requirementId: string) => void;
  completingRequirementId: string | null;
  onCompleteStep: () => void;
  completingStep: boolean;
};

export function JourneyStep({
  step,
  index,
  onCompleteRequirement,
  completingRequirementId,
  onCompleteStep,
  completingStep,
}: JourneyStepProps) {
  const isCompleted = step.status === "Completed";
  const isAvailable = step.status === "Available";
  const isLocked = step.status === "Locked";
  const hasIncompleteRequirements = step.requirements.some(
    (requirement) => requirement.required && requirement.status !== "Completed",
  );

  return (
    <article className="flex gap-4 border-t border-slate-100 py-5">
      <div
        className={[
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
          isCompleted && "bg-emerald-100 text-emerald-700",
          isAvailable && "bg-blue-100 text-blue-700",
          isLocked && "bg-slate-100 text-slate-400",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {isCompleted ? "✓" : isLocked ? "🔒" : index + 1}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">
              Step {index + 1}
            </p>

            <h2
              className={[
                "mt-1 text-base font-semibold",
                isLocked ? "text-slate-400" : "text-slate-900",
              ].join(" ")}
            >
              {step.title}
            </h2>
          </div>

          <span
            className={[
              "w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
              isCompleted && "bg-emerald-50 text-emerald-700",
              isAvailable && "bg-blue-50 text-blue-700",
              isLocked && "bg-slate-100 text-slate-400",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {step.status}
          </span>
        </div>

        {!isLocked && (
          <RequirementList
            requirements={step.requirements}
            onComplete={onCompleteRequirement}
            completingRequirementId={completingRequirementId}
          />
        )}

        {isAvailable && (
          <button
            type="button"
            disabled={completingStep || hasIncompleteRequirements}
            onClick={onCompleteStep}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {completingStep ? "Completing..." : "Continue"}
          </button>
        )}
      </div>
    </article>
  );
}

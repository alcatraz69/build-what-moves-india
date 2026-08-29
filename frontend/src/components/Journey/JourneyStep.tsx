import type { JourneyStep as JourneyStepType } from "../../types/journey";
import { RequirementList } from "./RequirementList";
import { WaitingPeriod } from "./WaitingPeriod";
import { PaymentStep } from "./PaymentStep";
import { LearnerTest } from "./LearnerTest";
import { DrivingTest } from "./DrivingTest";
import { DrivingLicenceIssued } from "./DrivingLicenceIssued";

type JourneyStepProps = {
  step: JourneyStepType;
  index: number;
  learnerLicenceIssuedAt: string | null;
  onCompleteRequirement: (requirementId: string) => void;
  completingRequirementId: string | null;
  onCompleteStep: () => void;
  completingStep: boolean;
  onRetryStep: () => void;
  retryingStep: boolean;
  onSimulateWaitingPeriod: () => void;
  referenceNumber: string;
};

type StepPresentation = "action" | "requirements" | "status";

function getStepPresentation(type: string): StepPresentation {
  switch (type) {
    case "LlDocuments":
    case "LlAuthentication":
      return "requirements";

    case "WaitingPeriod":
      return "status";

    default:
      return "action";
  }
}

function getStepActionLabel(type: string): string {
  switch (type) {
    case "LlApplication":
      return "Start Application";

    case "LlPayment":
      return "Pay Fee";

    case "LlTest":
      return "Take Test";

    case "DlApplication":
      return "Start Application";

    case "DlPayment":
      return "Pay Fee";

    case "DrivingTest":
      return "Take Driving Test";

    case "DlIssued":
      return "Complete";

    default:
      return "Continue";
  }
}

export function JourneyStep({
  step,
  index,
  learnerLicenceIssuedAt,
  onCompleteRequirement,
  completingRequirementId,
  onCompleteStep,
  completingStep,
  onRetryStep,
  retryingStep,
  onSimulateWaitingPeriod,
  referenceNumber,
}: JourneyStepProps) {
  const isCompleted = step.status === "Completed";
  const isAvailable = step.status === "Available";
  const isLocked = step.status === "Locked";
  const isFailed = step.status === "Failed";

  const hasIncompleteRequirements = step.requirements.some(
    (requirement) => requirement.required && requirement.status !== "Completed",
  );

  const presentation = getStepPresentation(step.type);
  const actionLabel = getStepActionLabel(step.type);

  return (
    <article
      className={[
        "border-t border-slate-100 py-5",
        isAvailable &&
          "mb-4 rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-5",
        isFailed &&
          "mb-4 rounded-xl border border-red-100 bg-red-50/40 px-4 py-5",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex gap-4">
        {/* Step indicator */}
        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            isCompleted && "bg-emerald-100 text-emerald-700",
            isAvailable && "bg-blue-600 text-white shadow-sm",
            isFailed && "bg-red-100 text-red-700",
            isLocked && "bg-slate-100 text-slate-500",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {isCompleted ? "✓" : isFailed ? "!" : isLocked ? "🔒" : index + 1}
        </div>

        <div className="min-w-0 flex-1">
          {/* Step heading */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p
                className={[
                  "text-xs font-semibold",
                  isLocked ? "text-slate-400" : "text-slate-400",
                ].join(" ")}
              >
                Step {index + 1}
              </p>

              <h2
                className={[
                  "mt-1 text-base font-semibold",
                  isLocked
                    ? "text-slate-500"
                    : isCompleted
                      ? "text-slate-600"
                      : "text-slate-900",
                ].join(" ")}
              >
                {step.title}
              </h2>
            </div>

            <span
              className={[
                "w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                isCompleted && "bg-emerald-100 text-emerald-700",
                isAvailable && "bg-blue-600 text-white shadow-sm",
                isFailed && "bg-red-100 text-red-700",
                isLocked && "bg-slate-100 text-slate-500",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {step.status}
            </span>
          </div>

          {/* Requirements */}
          {!isLocked && (
            <RequirementList
              requirements={step.requirements}
              onComplete={onCompleteRequirement}
              completingRequirementId={completingRequirementId}
            />
          )}

          {/* Failed state */}
          {isFailed && (
            <div className="mt-4 rounded-lg border border-red-100 bg-white p-4">
              <p className="text-sm font-medium text-red-800">
                This step was not completed successfully.
              </p>

              <p className="mt-1 text-sm text-red-600">
                You can retry this step to continue your journey.
              </p>

              <button
                type="button"
                disabled={retryingStep}
                onClick={onRetryStep}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {retryingStep ? "Retrying..." : "Retry"}
              </button>
            </div>
          )}

          {/* Waiting period */}
          {isAvailable &&
            presentation === "status" &&
            step.type === "WaitingPeriod" && (
              <WaitingPeriod
                learnerLicenceIssuedAt={learnerLicenceIssuedAt}
                onComplete={onCompleteStep}
                completing={completingStep}
                onSimulate={onSimulateWaitingPeriod}
              />
            )}

          {isAvailable &&
            (step.type === "LlPayment" || step.type === "DlPayment") && (
              <PaymentStep
                type={step.type}
                referenceNumber={referenceNumber}
                completing={completingStep}
                onPay={onCompleteStep}
              />
            )}

          {isAvailable && step.type === "LlTest" && (
            <LearnerTest completing={completingStep} onPass={onCompleteStep} />
          )}

          {isAvailable && step.type === "DrivingTest" && (
            <DrivingTest completing={completingStep} onPass={onCompleteStep} />
          )}

          {isAvailable && step.type === "DlIssued" && (
            <DrivingLicenceIssued
              referenceNumber={referenceNumber}
              completing={completingStep}
              onComplete={onCompleteStep}
            />
          )}

          {/* Action step */}
          {isAvailable &&
            presentation !== "status" &&
            step.type !== "LlPayment" &&
            step.type !== "DlPayment" &&
            step.type !== "LlTest" &&
            step.type !== "DrivingTest" &&
            step.type !== "DlIssued" && (
              <button
                type="button"
                disabled={completingStep || hasIncompleteRequirements}
                onClick={onCompleteStep}
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {completingStep ? "Completing..." : actionLabel}
              </button>
            )}
        </div>
      </div>
    </article>
  );
}

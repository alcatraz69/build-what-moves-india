import type { RuleFailure } from "../../types/applicant";

type EligibilityFailureProps = {
  failures: RuleFailure[];
};

export function EligibilityFailure({
  failures,
}: EligibilityFailureProps) {
  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg font-semibold text-amber-700">
          !
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-amber-900">
            You're not eligible yet
          </h2>

          <p className="mt-1 text-sm leading-6 text-amber-800">
            Based on the information you provided, you can't start this
            journey right now.
          </p>

          <div className="mt-5 border-t border-amber-200 pt-5">
            <h3 className="text-sm font-semibold text-amber-900">
              Here's why
            </h3>

            <ul className="mt-3 space-y-2">
              {failures.map((failure) => (
                <li
                  key={failure.rule}
                  className="flex items-start gap-2 text-sm leading-6 text-amber-800"
                >
                  <span aria-hidden="true">•</span>
                  <span>{failure.message}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-5 text-sm text-amber-800">
            You can update your details above and check your eligibility
            again.
          </p>
        </div>
      </div>
    </div>
  );
}
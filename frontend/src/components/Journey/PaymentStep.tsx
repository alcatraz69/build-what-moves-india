type PaymentStepProps = {
  type: string;
  referenceNumber: string;
  completing: boolean;
  onPay: () => void;
};

export function PaymentStep({
  type,
  referenceNumber,
  completing,
  onPay,
}: PaymentStepProps) {
  const isLearnerLicencePayment = type === "LlPayment";

  const title = isLearnerLicencePayment
    ? "Learner's Licence Fee"
    : "Driving Licence Fee";

  const applicationFee = isLearnerLicencePayment ? 150 : 200;
  const testFee = isLearnerLicencePayment ? 50 : 300;
  const total = applicationFee + testFee;

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Payment
          </p>

          <h3 className="mt-1 text-base font-semibold text-slate-900">
            {title}
          </h3>
        </div>

        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          Demo payment
        </span>
      </div>

      <div className="mt-5 rounded-lg bg-slate-50 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Application fee</span>
          <span className="font-medium text-slate-900">
            ₹{applicationFee}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">
            {isLearnerLicencePayment ? "Learner test fee" : "Driving test fee"}
          </span>
          <span className="font-medium text-slate-900">₹{testFee}</span>
        </div>

        <div className="my-4 border-t border-slate-200" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-900">
            Total
          </span>

          <span className="text-lg font-bold text-slate-900">
            ₹{total}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400">
            Application reference
          </p>

          <p className="mt-1 font-mono text-xs font-semibold text-slate-700">
            {referenceNumber}
          </p>
        </div>

        <button
          type="button"
          disabled={completing}
          onClick={onPay}
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {completing ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-400">
        This is a simulated payment for the Saarathi 2.0 prototype.
      </p>
    </div>
  );
}
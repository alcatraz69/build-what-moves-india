const steps = [
  {
    number: 1,
    label: 'Check eligibility',
  },
  {
    number: 2,
    label: 'Get your journey',
  },
  {
    number: 3,
    label: 'Complete each step',
  },
];

export default function OnboardingProgress() {
  return (
    <div className="mt-6 mb-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-medium text-slate-500">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                step.number === 1
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {step.number}
            </span>

            <span>{step.label}</span>
          </div>

          {index < steps.length - 1 && (
            <span className="text-slate-300">→</span>
          )}
        </div>
      ))}
    </div>
  );
}
import type { ReactNode } from "react";

type VehicleTypeCardProps = {
  label: string;
  description: string;
  icon: ReactNode;
  checked: boolean;
  onChange: () => void;
};

export function VehicleTypeCard({
  label,
  description,
  icon,
  checked,
  onChange,
}: VehicleTypeCardProps) {
  return (
    <label
      className={[
        "flex cursor-pointer items-center gap-4 rounded-xl border px-4 py-4 transition-all",
        checked
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50",
      ].join(" ")}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />

      <div
        className={[
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xl",
          checked ? "bg-blue-100" : "bg-slate-100",
        ].join(" ")}
        aria-hidden="true"
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-800">
          {label}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <div
        className={[
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all",
          checked
            ? "border-blue-600 bg-blue-600 text-white"
            : "border-slate-300 bg-white",
        ].join(" ")}
        aria-hidden="true"
      >
        {checked && (
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
          >
            <path
              d="M5 10.5L8.5 14L15 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </label>
  );
}
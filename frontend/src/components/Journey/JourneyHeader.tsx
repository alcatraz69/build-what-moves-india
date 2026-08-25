type JourneyHeaderProps = {
  status: string;
};

export function JourneyHeader({
  status,
}: JourneyHeaderProps) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Licence Journey
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Get your driving licence
        </h1>

        <p className="mt-2 text-slate-500">
          Complete each step to move through your licence journey.
        </p>
      </div>

      <span className="w-fit rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
        {status}
      </span>
    </header>
  );
}
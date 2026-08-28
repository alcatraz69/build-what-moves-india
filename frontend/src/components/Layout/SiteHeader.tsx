type SiteHeaderProps = {
  onHomeClick?: () => void;
};

export function SiteHeader({ onHomeClick }: SiteHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onHomeClick}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-lg text-white shadow-sm">
            🇮🇳
          </div>

          <div>
            <p className="text-base font-bold tracking-tight text-slate-900">
              Saarathi 2.0
            </p>

            <p className="text-xs font-medium text-slate-500">
              Driving Licence Services
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3 sm:gap-5">
          <button
            type="button"
            className="hidden text-sm font-medium text-slate-600 transition hover:text-slate-900 sm:block"
          >
            Help
          </button>

          <button
            type="button"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            English
          </button>

          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Prototype
          </span>
        </div>
      </div>
    </header>
  );
}
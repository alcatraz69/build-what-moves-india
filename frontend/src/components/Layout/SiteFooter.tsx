export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {/* <p className="text-sm font-bold text-slate-900">
              Saarathi 2.0
            </p> */}

            <p className="max-w-xl text-sm leading-6 text-slate-500">
              A modern citizen experience for navigating the driving licence
              application journey.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <span>Privacy</span>
            <span>Accessibility</span>
            <span>Terms</span>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="text-xs text-slate-400">
            Prototype service · Government integrations simulated for
            demonstration
          </p>
        </div>
      </div>
    </footer>
  );
}
type HeroBannerProps = {
  onStart: () => void;
};

export function HeroBanner({ onStart }: HeroBannerProps) {
  return (
    <section className="relative overflow-hidden bg-blue-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.12),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-blue-50 backdrop-blur-sm">
            Driving Licence Services
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Your driving licence journey, simplified.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
            Check your eligibility, understand what's required, and follow
            every step of your application from start to finish.
          </p>

          <button
            type="button"
            onClick={onStart}
            className="mt-7 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-blue-800 shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-800"
          >
            Start your application →
          </button>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-100">
            <span>✓ Eligibility check</span>
            <span>✓ Guided journey</span>
            <span>✓ AI assistance</span>
          </div>
        </div>
      </div>
    </section>
  );
}
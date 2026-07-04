export function SiteFooter() {
  return (
    <footer className="border-t border-surface-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-10 text-center text-sm text-foreground/50 sm:flex-row sm:justify-between sm:text-left">
        <p>Pinwheel — a small universe of calculators.</p>
        <p className="text-foreground/35">
          Built with Next.js. Every result runs locally in your browser.
        </p>
      </div>
    </footer>
  );
}

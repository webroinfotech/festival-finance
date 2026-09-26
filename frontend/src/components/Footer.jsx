export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-center gap-1.5 text-xs text-gray-500">
        <span>&copy; {new Date().getFullYear()} Festival Amount Maintenance.</span>
        <span className="hidden sm:inline">·</span>
        <span>
          Crafted by{" "}
          <a
            href="https://webroinfotech.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-amber-400/90 hover:text-amber-300 transition-colors"
          >
            webroinfotech.in
          </a>
        </span>
      </div>
    </footer>
  );
}

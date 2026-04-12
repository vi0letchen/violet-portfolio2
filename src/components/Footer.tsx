export default function Footer() {
  return (
    <footer className="border-t border-[#1e1e2e] py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#6b7280]">
        <span>
          Designed &amp; built by{" "}
          <span className="text-[#a78bfa] font-medium">Violet Chen</span>
        </span>
        <span className="font-mono text-xs">v2 · 2026</span>
      </div>
    </footer>
  );
}

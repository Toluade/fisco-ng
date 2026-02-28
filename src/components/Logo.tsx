export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* ₦ — left vertical */}
      <line x1="5" y1="4" x2="5" y2="20" />
      {/* ₦ — right vertical */}
      <line x1="19" y1="4" x2="19" y2="20" />
      {/* ₦ — diagonal (the N stroke) */}
      <line x1="5" y1="4" x2="19" y2="20" />
      {/* ₦ — upper horizontal bar */}
      <line x1="3" y1="10" x2="21" y2="10" />
      {/* ₦ — lower horizontal bar */}
      <line x1="3" y1="14" x2="21" y2="14" />
    </svg>
  );
}

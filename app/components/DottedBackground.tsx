export default function DottedBackground() {
  return (
    <svg
      aria-hidden="true"
      className="dot-pattern pointer-events-none fixed inset-0 h-full w-full fill-[var(--dot-color)]"
    >
      <defs>
        <pattern
          id="dot-pattern"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
        >
          <circle cx="12" cy="12" r="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-pattern)" />
    </svg>
  );
}

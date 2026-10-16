/** Decorative leaves and a soft wave - abstract nature motif, hidden from screen readers. */
export default function LeafMotif({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="var(--color-primary-softer)" />
      <path d="M20 86c14-8 26-8 40 0s26 8 40 0" stroke="var(--color-border-strong)" strokeWidth="3" strokeLinecap="round" />
      <path d="M38 74c0-22 14-36 38-38-2 24-16 38-38 38Z" fill="var(--color-primary)" opacity="0.85" />
      <path d="M38 74 60 52" stroke="var(--color-surface)" strokeWidth="3" strokeLinecap="round" />
      <path d="M62 78c4-14 14-21 28-20-3 14-13 21-28 20Z" fill="var(--color-accent)" opacity="0.55" />
    </svg>
  );
}

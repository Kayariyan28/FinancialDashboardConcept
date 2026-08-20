import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" className="text-card-2" />
      <polygon
        points="16,5 26,11 26,21 16,27 6,21 6,11"
        fill="none"
        stroke="currentColor"
        className="text-income"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <polygon
        points="16,11 20,13.5 20,18.5 16,21 12,18.5 12,13.5"
        fill="currentColor"
        className="text-income"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight">RevMoney</span>
    </span>
  );
}

import { cn } from "@/lib/utils";

type BrandMarkProps = {
  className?: string;
  compact?: boolean;
};

export function BrandMark({ className, compact = false }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center",
        compact ? "size-9" : "size-24",
        className,
      )}
    >
      <span className="absolute inset-[8%] rotate-45 rounded-[22%] border border-primary/45 bg-navy/70 shadow-[0_0_28px_color-mix(in_oklab,var(--primary)_24%,transparent)]" />
      <span className="absolute inset-[18%] -rotate-12 rounded-[24%] border border-gold/35" />
      <svg
        viewBox="0 0 100 100"
        className={cn("relative z-10 fill-none", compact ? "size-6" : "size-16")}
      >
        <path
          d="M20 26 H80 L22 74 H80"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gold"
        />
        <path
          d="M18 18 H68"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          className="text-primary"
        />
      </svg>
    </span>
  );
}
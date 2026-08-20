import { Info } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import type { SparkPoint } from "@/components/sparkline";
import { cn, formatPct } from "@/lib/utils";

export type KpiTipRow = {
  label: string;
  value: string;
  tone?: "positive" | "negative" | "muted";
};

export type KpiTipData = {
  title: string;
  definition: string;
  rows: KpiTipRow[];
  hint?: string;
  spark?: SparkPoint[];
  sparkColor?: string;
  formatSpark?: (value: number) => string;
  delta?: number;
  invert?: boolean;
};

const SIDE_MOTION: Record<
  "left" | "top" | "bottom" | "right",
  { from: string; to: string; pos: CSSProperties }
> = {
  top: {
    from: "translate(-50%, 8px)",
    to: "translate(-50%, 0)",
    pos: { bottom: "calc(100% + 12px)", left: "50%" },
  },
  bottom: {
    from: "translate(-50%, -8px)",
    to: "translate(-50%, 0)",
    pos: { top: "calc(100% + 12px)", left: "50%" },
  },
  left: {
    from: "translate(8px, -50%)",
    to: "translate(0, -50%)",
    pos: { right: "calc(100% + 12px)", top: "50%" },
  },
  right: {
    from: "translate(-8px, -50%)",
    to: "translate(0, -50%)",
    pos: { left: "calc(100% + 12px)", top: "50%" },
  },
};

export function KpiTip({
  data,
  className,
  children,
  side = "left",
}: {
  data: KpiTipData;
  className?: string;
  children: ReactNode;
  side?: "left" | "top" | "bottom" | "right";
}) {
  const motion = SIDE_MOTION[side];

  return (
    <div className={cn("kpi-tip relative", className)}>
      {children}
      <div
        role="tooltip"
        className="kpi-tip-panel absolute z-30 w-72 max-w-[min(18rem,calc(100vw-2rem))]"
        style={
          {
            "--kpi-tip-from": motion.from,
            "--kpi-tip-to": motion.to,
            ...motion.pos,
          } as CSSProperties
        }
      >
        <KpiTipBody data={data} />
      </div>
    </div>
  );
}

export function KpiTipBody({ data }: { data: KpiTipData }) {
  const good =
    data.delta == null ? null : data.invert ? data.delta <= 0 : data.delta >= 0;

  return (
    <div className="flex flex-col gap-2.5 rounded-xl bg-card-2 p-3.5 shadow-border">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{data.title}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">{data.definition}</p>
        </div>
        {data.delta != null && good != null ? (
          <Badge variant={good ? "positive" : "negative"}>{formatPct(data.delta)}</Badge>
        ) : null}
      </div>
      <dl className="flex flex-col gap-1">
        {data.rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4 text-xs">
            <dt className="text-muted">{row.label}</dt>
            <dd
              className={cn(
                "tabular-nums",
                row.tone === "positive" && "text-positive",
                row.tone === "negative" && "text-negative",
                row.tone === "muted" && "text-muted",
                !row.tone && "text-foreground",
              )}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
      {data.hint ? <p className="text-xs leading-relaxed text-subtle">{data.hint}</p> : null}
    </div>
  );
}

export function KpiLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted">
      {children}
      <Info className="kpi-tip-icon size-3.5" />
    </span>
  );
}

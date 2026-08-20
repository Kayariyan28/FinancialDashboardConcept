import { useId, useMemo, useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

export type SparkPoint = {
  value: number;
  label: string;
};

export function toSpark<T extends { label: string }>(
  series: T[],
  pick: (point: T) => number,
): SparkPoint[] {
  return series.map((point) => ({ value: pick(point), label: point.label }));
}

export function Sparkline({
  points,
  color = "var(--color-income)",
  height = 48,
  format = (value) => value.toLocaleString("en-US"),
  interactive = true,
  fill = true,
  showValue = true,
  className,
}: {
  points: SparkPoint[];
  color?: string;
  height?: number;
  format?: (value: number) => string;
  interactive?: boolean;
  fill?: boolean;
  showValue?: boolean;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const width = 240;

  const geo = useMemo(() => layout(points, width, height), [points, height]);
  if (!geo) return null;

  const shown = geo.coords[activeIndex ?? geo.coords.length - 1];
  const canScrub = interactive && points.length > 1;

  const setFromEvent = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / Math.max(1, rect.width)) * width;
    let nearest = 0;
    let best = Infinity;
    for (let i = 0; i < geo.coords.length; i++) {
      const d = Math.abs(geo.coords[i].x - x);
      if (d < best) {
        best = d;
        nearest = i;
      }
    }
    setActiveIndex(nearest);
  };

  return (
    <div className={cn("relative min-w-0", className)}>
      {showValue && shown ? (
        <p className="mb-1 text-[11px] tabular-nums text-muted">
          {shown.label}
          <span className="text-subtle"> · </span>
          {format(shown.value)}
        </p>
      ) : null}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={cn("w-full overflow-visible", canScrub && "touch-none cursor-crosshair")}
        style={{ height }}
        role="img"
        aria-label={`Trend, latest ${shown ? format(shown.value) : ""}`}
        onPointerDown={(event) => {
          if (!canScrub) return;
          event.stopPropagation();
          event.currentTarget.setPointerCapture(event.pointerId);
          setFromEvent(event);
        }}
        onPointerMove={(event) => {
          if (!canScrub) return;
          if (event.buttons || event.pointerType === "mouse") setFromEvent(event);
        }}
        onPointerLeave={() => setActiveIndex(null)}
        onPointerUp={() => setActiveIndex(null)}
      >
        <defs>
          <linearGradient id={`spark-fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {fill ? (
          <path d={geo.area} fill={`url(#spark-fill-${uid})`} className="spark-fill" />
        ) : null}
        {geo.zero != null ? (
          <line
            x1={geo.padX}
            x2={width - geo.padX}
            y1={geo.zero}
            y2={geo.zero}
            stroke="currentColor"
            strokeOpacity="0.16"
            strokeDasharray="3 3"
          />
        ) : null}
        <path
          d={geo.line}
          fill="none"
          stroke={color}
          strokeWidth="1.75"
          strokeLinejoin="round"
          strokeLinecap="round"
          pathLength={1}
          className="spark-line"
        />
        {shown ? (
          <circle cx={shown.x} cy={shown.y} r={activeIndex != null ? 3.2 : 2.4} fill={color} />
        ) : null}
        {activeIndex != null && shown ? (
          <line
            x1={shown.x}
            x2={shown.x}
            y1={geo.padY}
            y2={height - geo.padY}
            stroke={color}
            strokeOpacity="0.35"
            strokeWidth="1"
          />
        ) : null}
      </svg>
    </div>
  );
}

function layout(points: SparkPoint[], width: number, height: number) {
  if (points.length < 2) return null;
  const padX = 4;
  const padY = 5;
  const values = points.map((p) => p.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const span = max - min;
  min -= span * 0.08;
  max += span * 0.08;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const yAt = (value: number) => padY + (1 - (value - min) / (max - min)) * innerH;
  const coords = points.map((point, i) => ({
    ...point,
    x: padX + (i / (points.length - 1)) * innerW,
    y: yAt(point.value),
  }));
  const line = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(2)} ${c.y.toFixed(2)}`)
    .join(" ");
  const last = coords[coords.length - 1];
  const first = coords[0];
  const area = `${line} L${last.x.toFixed(2)} ${height - padY} L${first.x.toFixed(2)} ${height - padY} Z`;
  const zero = min < 0 && max > 0 ? yAt(0) : null;
  return { coords, line, area, padX, padY, zero };
}

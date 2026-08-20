import { Calendar, Clock, MapPin, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  BIN_ALGOS,
  formatCoord,
  formatHexValue,
  getHoneycomb,
  HEX_LEVELS,
  type AggMode,
  type BinAlgo,
  type HexCell,
  type HexOrient,
} from "@/lib/honeycomb";
import { cn } from "@/lib/utils";

const RANGES = [
  { id: 2024, label: "Today" },
  { id: 2025, label: "Last 7 days" },
  { id: 2023, label: "Last 30 days" },
  { id: 2026, label: "This year" },
];

const AGGS: { id: AggMode; label: string }[] = [
  { id: "sum", label: "Sum" },
  { id: "mean", label: "Mean" },
  { id: "count", label: "Count" },
];

export function HoneycombMap({ seed = 2024 }: { seed?: number }) {
  const [rangeId, setRangeId] = useState(seed);
  const [algo, setAlgo] = useState<BinAlgo>("cube");
  const [agg, setAgg] = useState<AggMode>("sum");
  const [orient, setOrient] = useState<HexOrient>("pointy");
  const [size, setSize] = useState(8);
  const [showPoints, setShowPoints] = useState(false);
  const [filterLevel, setFilterLevel] = useState<number | null>(null);

  const map = useMemo(
    () => getHoneycomb(rangeId, { algo, agg, orient, size }),
    [rangeId, algo, agg, orient, size],
  );
  const [activeId, setActiveId] = useState<string | null>(map.midtownId);

  useEffect(() => {
    setActiveId(map.midtownId);
  }, [map.midtownId]);

  const active = map.cells.find((c) => c.id === activeId) ?? null;
  const range = RANGES.find((r) => r.id === rangeId) ?? RANGES[0];
  const algoMeta = BIN_ALGOS.find((a) => a.id === algo) ?? BIN_ALGOS[0];

  const onCell = (cell: HexCell) => {
    if (cell.count === 0) {
      setActiveId(null);
      return;
    }
    setActiveId((id) => (id === cell.id ? null : cell.id));
  };

  return (
    <section className="rounded-2xl bg-card p-4 shadow-border sm:p-5">
      <header className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <h2 className="text-sm font-medium">Revenue heatmap</h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-positive/10 px-2 py-0.5 text-xs text-positive">
            <span className="size-1.5 rounded-full bg-positive" />
            All accounts connected
          </span>
        </div>
        <label className="relative inline-flex h-10 items-center gap-1.5 rounded-full bg-card-2 px-3 text-xs text-muted shadow-border">
          <Calendar className="size-3.5" />
          <span className="sr-only">Heatmap range</span>
          <select
            value={rangeId}
            onChange={(e) => setRangeId(Number(e.target.value))}
            className="cursor-pointer appearance-none bg-transparent pr-4 text-foreground outline-none"
          >
            {RANGES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="mb-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Seg
            value={algo}
            onChange={setAlgo}
            options={BIN_ALGOS.map((a) => ({ id: a.id, label: a.label }))}
          />
          <Seg value={agg} onChange={setAgg} options={AGGS} />
          <Seg
            value={orient}
            onChange={setOrient}
            options={[
              { id: "pointy", label: "Pointy" },
              { id: "flat", label: "Flat" },
            ]}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex min-w-[12rem] flex-1 items-center gap-3 text-xs text-muted">
            <span className="shrink-0">Bin size {size}</span>
            <input
              type="range"
              min={7}
              max={14}
              step={1}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="hex-range h-10 w-full"
              aria-label="Hex bin size"
            />
          </label>
          <button
            type="button"
            onClick={() => setShowPoints((v) => !v)}
            className={cn(
              "h-10 rounded-full px-3 text-xs shadow-border",
              showPoints ? "bg-income/15 text-foreground" : "bg-card-2 text-muted",
            )}
          >
            {showPoints ? "Hide points" : "Show points"}
          </button>
        </div>
        <p className="text-xs leading-relaxed text-muted">
          {algoMeta.blurb}{" "}
          <span className="text-subtle">
            {map.events.length.toLocaleString("en-US")} deals → {map.occupied} occupied hexes.
          </span>
        </p>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3" />
          {active ? formatCoord(active.lat, active.lng) : "40.7549° N, 73.9840° W"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3" />
          {range.label === "Today" ? "03:52 pm" : range.label}
        </span>
        {active ? (
          <span className="tabular-nums text-subtle">
            q {active.q}, r {active.r}
          </span>
        ) : null}
      </div>

      <div className="relative overflow-visible">
        <div className="relative min-h-[320px] overflow-hidden rounded-xl bg-background sm:min-h-[460px]">
          <svg
            viewBox={map.viewBox}
            className="h-auto w-full"
            role="img"
            aria-label="Hexagonally binned revenue heatmap"
          >
            {active ? (
              <g className="pointer-events-none" stroke="var(--color-border-strong)" strokeDasharray="3 4">
                <line
                  x1={map.minX}
                  x2={map.minX + map.width}
                  y1={active.y}
                  y2={active.y}
                  strokeWidth="0.8"
                />
                <line
                  x1={active.x}
                  x2={active.x}
                  y1={map.minY}
                  y2={map.minY + map.height}
                  strokeWidth="0.8"
                />
              </g>
            ) : null}
            {map.cells.map((cell) => {
              const dim =
                filterLevel != null && cell.level !== filterLevel && cell.level !== 0;
              return (
                <polygon
                  key={cell.id}
                  points={cell.points}
                  fill={`var(--color-hex-${cell.level})`}
                  className={cn(
                    "hex-cell",
                    cell.count > 0 && "is-hot",
                    activeId === cell.id && "is-active",
                  )}
                  opacity={dim ? 0.22 : 1}
                  aria-label={`${cell.district} ${formatHexValue(cell, agg)}`}
                  onClick={() => onCell(cell)}
                  onMouseEnter={() => {
                    if (cell.count > 0) setActiveId(cell.id);
                  }}
                />
              );
            })}
            {showPoints
              ? map.events.map((event, i) => (
                  <circle
                    key={i}
                    cx={event.x}
                    cy={event.y}
                    r={size * 0.12}
                    fill="var(--color-foreground)"
                    fillOpacity="0.35"
                    className="pointer-events-none"
                  />
                ))
              : null}
          </svg>

          <MiniMap map={map} active={active} />
          <Legend
            filterLevel={filterLevel}
            onToggle={(level) => setFilterLevel((v) => (v === level ? null : level))}
          />
        </div>

        {active && active.count > 0 ? (
          <HexTooltip cell={active} map={map} agg={agg} onClose={() => setActiveId(null)} />
        ) : null}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto md:hidden">
        {HEX_LEVELS.map((level) => (
          <button
            key={level.id}
            type="button"
            onClick={() => setFilterLevel((v) => (v === level.id ? null : level.id))}
            className={cn(
              "flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-card-2 px-3 text-xs text-muted",
              filterLevel === level.id && "text-foreground shadow-border",
            )}
          >
            <span
              className="size-2 rounded-[2px]"
              style={{ background: `var(--color-hex-${level.id})` }}
            />
            {level.label}
          </button>
        ))}
      </div>
    </section>
  );
}

function Seg<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { id: T; label: string }[];
}) {
  return (
    <div className="inline-flex rounded-full bg-card-2 p-0.5 shadow-border">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            "h-9 rounded-full px-3 text-xs transition-colors duration-150",
            value === opt.id ? "bg-card text-foreground shadow-border" : "text-muted",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function HexTooltip({
  cell,
  map,
  agg,
  onClose,
}: {
  cell: HexCell;
  map: ReturnType<typeof getHoneycomb>;
  agg: AggMode;
  onClose: () => void;
}) {
  const left = ((cell.x - map.minX) / map.width) * 100;
  const top = ((cell.y - map.minY) / map.height) * 100;
  const below = top < 46;
  return (
    <div
      className={cn(
        "hex-tip is-open absolute z-20 w-48 rounded-lg bg-card-2 p-2.5 shadow-border",
        below && "hex-tip-below",
      )}
      style={{ left: `${left}%`, top: `${top}%` }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium">{cell.district}</p>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClose}
          className="flex size-7 items-center justify-center rounded-md text-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      </div>
      <p className="mt-1.5 flex items-center gap-2 text-xs">
        <span
          className="size-2.5 rounded-[2px]"
          style={{ background: `var(--color-hex-${cell.level})` }}
        />
        <span className="tabular-nums">{formatHexValue(cell, agg)}</span>
      </p>
      <p className="mt-1 text-xs tabular-nums text-subtle">
        {cell.count} deals · avg{" "}
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(cell.mean)}
      </p>
    </div>
  );
}

function MiniMap({
  map,
  active,
}: {
  map: ReturnType<typeof getHoneycomb>;
  active: HexCell | null;
}) {
  return (
    <div className="absolute bottom-3 left-3 hidden overflow-hidden rounded-lg bg-card-2 p-1.5 shadow-border sm:block">
      <svg viewBox={map.viewBox} className="h-20 w-24 opacity-80">
        {map.cells.map((cell) => (
          <polygon
            key={cell.id}
            points={cell.points}
            fill={cell.level === 0 ? "var(--color-hex-0)" : "var(--color-hex-7)"}
            stroke="transparent"
          />
        ))}
        {active ? (
          <circle cx={active.x} cy={active.y} r={map.size * 1.1} fill="var(--color-income)" />
        ) : null}
      </svg>
    </div>
  );
}

function Legend({
  filterLevel,
  onToggle,
}: {
  filterLevel: number | null;
  onToggle: (level: number) => void;
}) {
  return (
    <aside className="absolute top-4 right-3 z-10 hidden rounded-lg bg-card-2/95 p-2.5 shadow-border md:block">
      <p className="mb-1.5 text-xs text-muted">Intensity</p>
      <ul className="flex flex-col gap-0.5">
        {HEX_LEVELS.map((level) => (
          <li key={level.id}>
            <button
              type="button"
              onClick={() => onToggle(level.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-sm px-0.5 py-0.5 text-left text-xs tabular-nums text-muted",
                filterLevel === level.id && "text-foreground",
                filterLevel != null && filterLevel !== level.id && "opacity-40",
              )}
            >
              <span
                className="size-2.5 shrink-0 rounded-[2px]"
                style={{ background: `var(--color-hex-${level.id})` }}
              />
              {level.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

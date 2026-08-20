import { useEffect, useMemo, useState, type ReactElement } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import type { MixSlice, PeriodPoint } from "@/lib/data";

export function ClientChart({
  children,
  className,
}: {
  children: ReactElement;
  className?: string;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className={className} />;
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function useNarrow(breakpoint = 640) {
  const [narrow, setNarrow] = useState(() =>
    typeof window === "undefined" ? true : window.innerWidth <= breakpoint,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [breakpoint]);
  return narrow;
}

function tickInterval(count: number, narrow: boolean) {
  const max = narrow ? 4 : 12;
  if (count <= max) return 0;
  return Math.ceil(count / max) - 1;
}

type TipPayload = {
  value?: number;
  name?: string;
  color?: string;
  dataKey?: string;
  payload?: PeriodPoint & { costsNeg?: number };
};

function ChartTooltip({
  active,
  label,
  payload,
  names,
}: {
  active?: boolean;
  label?: string;
  payload?: TipPayload[];
  names?: Record<string, string>;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  const title = point?.fullLabel ?? label ?? "";
  const seen = new Set<string>();
  return (
    <div className="min-w-44 rounded-xl bg-card-2 px-3 py-2.5 shadow-border">
      <p className="mb-1.5 text-xs font-medium text-muted">{title}</p>
      {payload.map((row) => {
        const key = String(row.dataKey ?? row.name);
        if (seen.has(key)) return null;
        seen.add(key);
        const name = names?.[key] ?? row.name ?? key;
        const raw = key === "costsNeg" ? Math.abs(row.value ?? 0) : (row.value ?? 0);
        const color =
          key === "costsNeg" || key === "costs" || key === "churned"
            ? "var(--color-expense)"
            : key === "revenue" || key === "net"
              ? "var(--color-income)"
              : (row.color ?? "var(--color-foreground)");
        return (
          <div key={key} className="flex items-center justify-between gap-6 text-xs">
            <span className="flex items-center gap-1.5 text-muted">
              <span className="size-1.5 rounded-full" style={{ background: color }} />
              {name}
            </span>
            <span className="tabular-nums text-foreground">{formatCurrency(raw)}</span>
          </div>
        );
      })}
    </div>
  );
}

export function DivergingBars({
  data,
  activeKey,
  onActive,
}: {
  data: PeriodPoint[];
  activeKey: string | null;
  onActive: (key: string | null) => void;
}) {
  const chartData = useMemo(
    () => data.map((d) => ({ ...d, costsNeg: -d.costs })),
    [data],
  );
  const narrow = useNarrow();
  const activeIndex = Math.max(
    0,
    chartData.findIndex((d) => d.key === activeKey),
  );

  return (
    <ClientChart className="h-[260px] w-full sm:h-[300px]">
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 4, left: 0, bottom: 4 }}
        barCategoryGap="28%"
        onMouseMove={(state) => {
          const idx = state?.activeTooltipIndex;
          if (typeof idx === "number" && chartData[idx]) onActive(chartData[idx].key);
        }}
        onClick={(state) => {
          const idx = state?.activeTooltipIndex;
          if (typeof idx === "number" && chartData[idx]) onActive(chartData[idx].key);
        }}
      >
        <defs>
          <pattern
            id="hatchIn"
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(40)"
          >
            <rect width="7" height="7" fill="#16161a" />
            <rect width="3" height="7" fill="#2c2c34" />
          </pattern>
          <pattern
            id="hatchOut"
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(40)"
          >
            <rect width="7" height="7" fill="#16161a" />
            <rect width="3" height="7" fill="#3a3036" />
          </pattern>
        </defs>
        <CartesianGrid
          vertical={false}
          stroke="rgba(255,255,255,0.05)"
          strokeDasharray="3 6"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--color-subtle)", fontSize: 11 }}
          interval={tickInterval(chartData.length, narrow)}
          minTickGap={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--color-subtle)", fontSize: 11 }}
          tickFormatter={(v: number) => `$${Math.abs(v / 1000).toFixed(0)}k`}
          width={40}
        />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
          content={
            <ChartTooltip names={{ revenue: "Revenue", costsNeg: "Costs", costs: "Costs" }} />
          }
        />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.12)" />
        <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={36} cursor="pointer">
          {chartData.map((d, i) => (
            <Cell
              key={d.key}
              fill={i === activeIndex ? "var(--color-income)" : "url(#hatchIn)"}
            />
          ))}
        </Bar>
        <Bar dataKey="costsNeg" radius={[0, 0, 6, 6]} maxBarSize={36} cursor="pointer">
          {chartData.map((d, i) => (
            <Cell
              key={d.key}
              fill={i === activeIndex ? "var(--color-expense)" : "url(#hatchOut)"}
            />
          ))}
        </Bar>
      </BarChart>
    </ClientChart>
  );
}

export function ForecastLines({
  data,
  highlightKey,
}: {
  data: PeriodPoint[];
  highlightKey: string | null;
}) {
  const highlight = data.find((d) => d.key === highlightKey) ?? data[Math.floor(data.length / 2)];

  return (
    <ClientChart className="h-[180px] w-full">
      <LineChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 6" />
        <XAxis dataKey="label" hide />
        <YAxis hide domain={["auto", "auto"]} />
        <Tooltip
          content={<ChartTooltip names={{ revenue: "Revenue", costs: "Costs" }} />}
        />
        {highlight ? (
          <ReferenceLine
            x={highlight.label}
            stroke="rgba(255,255,255,0.2)"
            strokeDasharray="3 3"
            label={{
              value: highlight.label,
              position: "top",
              fill: "var(--color-muted)",
              fontSize: 11,
            }}
          />
        ) : null}
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-income)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-income)", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="costs"
          stroke="var(--color-expense)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-expense)", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ClientChart>
  );
}

export function CostDonut({
  slices,
  totalLabel,
  totalValue,
}: {
  slices: MixSlice[];
  totalLabel: string;
  totalValue: string;
}) {
  return (
    <div className="relative mx-auto h-[168px] w-[168px] shrink-0">
      <ClientChart className="h-full w-full">
        <PieChart>
          <Pie
            data={slices}
            dataKey="value"
            nameKey="label"
            innerRadius={54}
            outerRadius={76}
            paddingAngle={3}
            stroke="none"
            startAngle={90}
            endAngle={-270}
          >
            {slices.map((s) => (
              <Cell key={s.id} fill={s.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const row = payload[0];
              const slice = row?.payload as MixSlice | undefined;
              if (!slice) return null;
              return (
                <div className="rounded-xl bg-card-2 px-3 py-2 text-xs shadow-border">
                  <p className="text-muted">{slice.label}</p>
                  <p className="tabular-nums">
                    {formatCurrency(slice.value)} · {Math.round(slice.share * 100)}%
                  </p>
                </div>
              );
            }}
          />
        </PieChart>
      </ClientChart>
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center">
          <p className="text-2xl font-semibold tabular-nums tracking-tight">{totalValue}</p>
          <p className="text-xs text-muted">{totalLabel}</p>
        </div>
      </div>
    </div>
  );
}

export function NetArea({ data }: { data: PeriodPoint[] }) {
  const narrow = useNarrow();
  return (
    <ClientChart className="h-[260px] w-full sm:h-[300px]">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-income)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-income)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 6" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--color-subtle)", fontSize: 11 }}
          interval={tickInterval(data.length, narrow)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--color-subtle)", fontSize: 11 }}
          tickFormatter={(v: number) => formatCurrency(v, true)}
          width={48}
        />
        <Tooltip content={<ChartTooltip names={{ net: "Net income", netWorth: "Net worth" }} />} />
        <Area
          type="monotone"
          dataKey="net"
          stroke="var(--color-income)"
          fill="url(#netFill)"
          strokeWidth={2}
        />
      </AreaChart>
    </ClientChart>
  );
}

export function WorthArea({ data }: { data: PeriodPoint[] }) {
  const narrow = useNarrow();
  return (
    <ClientChart className="h-[260px] w-full sm:h-[300px]">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="worthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-mix-b)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--color-mix-b)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 6" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--color-subtle)", fontSize: 11 }}
          interval={tickInterval(data.length, narrow)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--color-subtle)", fontSize: 11 }}
          tickFormatter={(v: number) => formatCurrency(v, true)}
          width={52}
        />
        <Tooltip content={<ChartTooltip names={{ netWorth: "Net worth", savings: "Savings" }} />} />
        <Area
          type="monotone"
          dataKey="netWorth"
          stroke="var(--color-mix-b)"
          fill="url(#worthFill)"
          strokeWidth={2}
        />
      </AreaChart>
    </ClientChart>
  );
}

export function MixBar({ slices }: { slices: MixSlice[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  return (
    <div className="flex h-2 overflow-hidden rounded-full">
      {slices.map((s) => (
        <div
          key={s.id}
          className="h-full"
          style={{ width: `${(s.value / total) * 100}%`, background: s.color }}
        />
      ))}
    </div>
  );
}

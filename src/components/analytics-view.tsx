import { Calendar, ChevronDown, Sparkles } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { BreakdownTable } from "@/components/breakdown-table";
import {
  CostDonut,
  DivergingBars,
  ForecastLines,
  MixBar,
  NetArea,
  WorthArea,
} from "@/components/charts";
import { HoneycombMap } from "@/components/honeycomb-map";
import { KpiLabel, KpiTip, type KpiTipData } from "@/components/kpi-tip";
import { Sparkline, toSpark } from "@/components/sparkline";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ACCOUNTS,
  GRAINS,
  TABS,
  YEARS,
  type Filters,
  type Grain,
  type TabId,
  DEFAULT_FILTERS,
  forecastInsight,
  getCostMix,
  getKpis,
  getRevenueMix,
  getSegments,
  getSeries,
  getTransactions,
  presetRange,
  previousRange,
  rangeForYear,
} from "@/lib/data";
import { cn, formatCurrency, formatPct } from "@/lib/utils";

export function AnalyticsView() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const series = useMemo(() => getSeries(filters), [filters]);
  const kpis = useMemo(() => getKpis(filters), [filters]);
  const defaultKey =
    series.find((p) => p.label === "May")?.key ?? series[Math.floor(series.length / 2)]?.key ?? null;
  const [activeKey, setActiveKey] = useState<string | null>(defaultKey);
  const active = series.find((p) => p.key === activeKey) ?? series[0];

  const revenueMix = getRevenueMix(kpis.revenue);
  const costMix = getCostMix(kpis.costs);
  const segments = getSegments(filters, kpis);
  const insight = forecastInsight(series);
  const tx = getTransactions(filters);

  const patch = (next: Partial<Filters>) => {
    setFilters((f) => {
      const merged = { ...f, ...next };
      if (next.year != null && next.from == null) {
        const range = rangeForYear(next.year);
        merged.from = range.from;
        merged.to = range.to;
      }
      return merged;
    });
    setActiveKey(null);
  };

  return (
    <div className="stagger-in flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">
          Financial analytics
        </h1>
        <FiltersBar filters={filters} onChange={patch} />
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => patch({ tab: tab.id })}
            className={cn(
              "relative shrink-0 px-3 py-2 text-sm transition-colors duration-150",
              filters.tab === tab.id ? "text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {tab.label}
            {filters.tab === tab.id ? (
              <span className="absolute inset-x-2 -bottom-0.5 h-px bg-foreground" />
            ) : null}
          </button>
        ))}
      </div>

      <MainPanel
        tab={filters.tab}
        filters={filters}
        series={series}
        kpis={kpis}
        activeKey={activeKey ?? defaultKey}
        onActive={(key) => setActiveKey(key)}
        period={active}
      />

      {filters.tab === "summary" || filters.tab === "income" ? (
        <HoneycombMap seed={filters.year} />
      ) : null}

      {filters.tab === "summary" || filters.tab === "income" || filters.tab === "spending" ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Panel
            title="Revenue mix"
            action={
              <ViewSwitch
                value="Categories"
                options={["Categories", "Sources"]}
              />
            }
          >
            <p className="mt-4 text-3xl font-semibold tracking-tight tabular-nums">
              {formatCurrency(kpis.revenue)}
            </p>
            <div className="mt-4">
              <MixBar slices={revenueMix} />
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {revenueMix.map((s) => (
                <div key={s.id}>
                  <p className="flex items-center gap-1.5 text-xs text-muted">
                    <span className="size-1.5 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </p>
                  <p className="mt-1 text-sm font-medium tabular-nums">
                    {formatCurrency(s.value, true)}
                  </p>
                  <p className="text-[11px] text-subtle">{Math.round(s.share * 100)}%</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Cost analysis"
            action={
              <ViewSwitch
                value="Categories"
                options={["Categories", "Transactions"]}
              />
            }
          >
            <div className="mt-2 flex items-center gap-3">
              <CostDonut
                slices={costMix}
                totalLabel="Total"
                totalValue={String(kpis.txCount)}
              />
              <ul className="flex min-w-0 flex-1 flex-col gap-1.5 text-xs">
                {costMix.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-muted">
                      <span className="size-1.5 rounded-full" style={{ background: s.color }} />
                      {s.label}
                    </span>
                    <span className="tabular-nums">{Math.round(s.share * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          <Panel title="Financial forecast">
            <div className="mt-1 flex items-center gap-3 text-[11px] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-income" /> Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-expense" /> Costs
              </span>
            </div>
            <ForecastLines data={series} highlightKey={activeKey ?? defaultKey} />
            <p className="mt-1 flex items-start gap-2 text-xs leading-relaxed text-muted">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-warning" />
              {insight}
            </p>
          </Panel>
        </div>
      ) : null}

      {filters.tab === "spending" ? (
        <Panel title="Recent transactions">
          <TxList rows={tx.slice(0, 8)} />
        </Panel>
      ) : null}

      <div>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-sm font-medium text-muted">Segment breakdown</h2>
          <p className="hidden text-xs text-subtle sm:block">Click column headers to sort</p>
        </div>
        <BreakdownTable rows={segments} />
      </div>
    </div>
  );
}

function MainPanel({
  tab,
  filters,
  series,
  kpis,
  activeKey,
  onActive,
  period,
}: {
  tab: TabId;
  filters: Filters;
  series: ReturnType<typeof getSeries>;
  kpis: ReturnType<typeof getKpis>;
  activeKey: string | null;
  onActive: (key: string | null) => void;
  period?: ReturnType<typeof getSeries>[number];
}) {
  const chart =
    tab === "net-income" || tab === "savings" ? (
      <NetArea data={series} />
    ) : tab === "net-worth" || tab === "balance" ? (
      <WorthArea data={series} />
    ) : (
      <DivergingBars data={series} activeKey={activeKey} onActive={onActive} />
    );

  const prev = previousRange(filters);
  const priorLabel = formatRangeLabel(prev.from, prev.to);
  const currentLabel = formatRangeLabel(filters.from, filters.to);
  const priorRevenue = kpis.revenue - kpis.revenueChange;
  const priorCosts = kpis.costDelta === -100 ? 0 : kpis.costs / (1 + kpis.costDelta / 100);
  const priorChurn = kpis.churn - kpis.churnDelta;

  const kpiItems =
    tab === "spending"
      ? [
          {
            label: "Total costs",
            value: formatCurrency(kpis.costs),
            delta: kpis.costDelta,
            invert: true,
            tip: {
              title: "Total costs",
              definition: "Operating spend in the selected range, across the chosen accounts.",
              delta: kpis.costDelta,
              invert: true,
              spark: toSpark(series, (p) => p.costs),
              sparkColor: "var(--color-expense)",
              rows: [
                { label: "This range", value: formatCurrency(kpis.costs) },
                { label: "Prior range", value: formatCurrency(priorCosts), tone: "muted" as const },
                {
                  label: "Change",
                  value: `${formatPct(kpis.costDelta)} vs prior`,
                  tone: kpis.costDelta <= 0 ? ("positive" as const) : ("negative" as const),
                },
                { label: "Compared to", value: priorLabel, tone: "muted" as const },
              ],
              hint: period
                ? `${period.fullLabel} costs ${formatCurrency(period.costs)}.`
                : `Window: ${currentLabel}.`,
            },
          },
          {
            label: "Cost change",
            value: formatPct(kpis.costDelta),
            delta: kpis.costDelta,
            invert: true,
            tip: {
              title: "Cost change",
              definition: "Percent movement versus the equal-length period immediately before this range.",
              delta: kpis.costDelta,
              invert: true,
              spark: toSpark(series, (p) => p.costs),
              sparkColor: "var(--color-expense)",
              rows: [
                { label: "This range", value: formatCurrency(kpis.costs) },
                { label: "Prior range", value: formatCurrency(priorCosts), tone: "muted" as const },
                { label: "Compared to", value: priorLabel, tone: "muted" as const },
              ],
            },
          },
          {
            label: "Transactions",
            value: String(kpis.txCount),
            delta: kpis.growth,
            tip: {
              title: "Transactions",
              definition: "Booked payments and invoices in this window. Used as the donut center count.",
              delta: kpis.growth,
              spark: toSpark(series, (p) => p.revenue + p.costs),
              sparkColor: "var(--color-muted)",
              formatSpark: (v: number) => Math.round(v).toLocaleString("en-US"),
              rows: [
                { label: "Count", value: String(kpis.txCount) },
                { label: "Range", value: currentLabel, tone: "muted" as const },
              ],
              hint: "Open Spending for the recent transaction list.",
            },
          },
        ]
      : tab === "net-worth" || tab === "balance"
        ? [
            {
              label: "Net worth",
              value: formatCurrency(kpis.netWorth),
              delta: kpis.netDelta,
              tip: {
                title: "Net worth",
                definition: "Cumulative cash after revenue and costs, ending at the last period in range.",
                delta: kpis.netDelta,
                spark: toSpark(series, (p) => p.netWorth),
                sparkColor: "var(--color-mix-b)",
                rows: [
                  { label: "Ending balance", value: formatCurrency(kpis.netWorth) },
                  { label: "Net this range", value: formatCurrency(kpis.net) },
                  { label: "Compared to", value: priorLabel, tone: "muted" as const },
                ],
              },
            },
            {
              label: "Savings",
              value: formatCurrency(kpis.savings),
              delta: kpis.savingsRate,
              tip: {
                title: "Savings",
                definition: "Share of net income set aside during the selected window.",
                delta: kpis.savingsRate,
                spark: toSpark(series, (p) => p.savings),
                sparkColor: "var(--color-mix-b)",
                rows: [
                  { label: "Saved", value: formatCurrency(kpis.savings) },
                  { label: "Rate", value: formatPct(kpis.savingsRate) },
                  { label: "Revenue base", value: formatCurrency(kpis.revenue), tone: "muted" as const },
                ],
              },
            },
            {
              label: "Savings rate",
              value: formatPct(kpis.savingsRate),
              delta: kpis.savingsRate,
              tip: {
                title: "Savings rate",
                definition: "Savings divided by revenue for this range.",
                delta: kpis.savingsRate,
                spark: toSpark(series, (p) => (p.revenue ? (p.savings / p.revenue) * 100 : 0)),
                formatSpark: (v: number) => `${v.toFixed(1)}%`,
                rows: [
                  { label: "Rate", value: formatPct(kpis.savingsRate) },
                  { label: "Saved", value: formatCurrency(kpis.savings) },
                ],
              },
            },
          ]
        : [
            {
              label: "Revenue",
              value: formatCurrency(kpis.revenue),
              delta: kpis.revenueDelta,
              tip: {
                title: "Revenue",
                definition: "Gross billed revenue across the selected accounts and dates.",
                delta: kpis.revenueDelta,
                spark: toSpark(series, (p) => p.revenue),
                sparkColor: "var(--color-income)",
                rows: [
                  { label: "This range", value: formatCurrency(kpis.revenue) },
                  { label: "Prior range", value: formatCurrency(priorRevenue), tone: "muted" as const },
                  {
                    label: "Change",
                    value: `${kpis.revenueChange >= 0 ? "+" : "−"}${formatCurrency(Math.abs(kpis.revenueChange))}`,
                    tone: kpis.revenueChange >= 0 ? ("positive" as const) : ("negative" as const),
                  },
                  { label: "Compared to", value: priorLabel, tone: "muted" as const },
                ],
                hint: period
                  ? `${period.fullLabel}: ${formatCurrency(period.revenue)}. Click a bar to pin a month.`
                  : `Window: ${currentLabel}.`,
              },
            },
            {
              label: "Growth",
              value: `${kpis.revenueChange >= 0 ? "+" : "−"}${formatCurrency(Math.abs(kpis.revenueChange))}`,
              delta: kpis.growth,
              tip: {
                title: "Growth",
                definition: "Dollar and percent change versus the equal-length period before this range.",
                delta: kpis.growth,
                spark: toSpark(series, (p) => p.revenue),
                sparkColor: "var(--color-income)",
                rows: [
                  { label: "This range", value: formatCurrency(kpis.revenue) },
                  { label: "Prior range", value: formatCurrency(priorRevenue), tone: "muted" as const },
                  {
                    label: "Dollar change",
                    value: `${kpis.revenueChange >= 0 ? "+" : "−"}${formatCurrency(Math.abs(kpis.revenueChange))}`,
                    tone: kpis.revenueChange >= 0 ? ("positive" as const) : ("negative" as const),
                  },
                  { label: "Rate", value: formatPct(kpis.growth) },
                  { label: "Compared to", value: priorLabel, tone: "muted" as const },
                ],
              },
            },
            {
              label: "Churn",
              value: `${kpis.churn.toFixed(1)}%`,
              delta: -kpis.churnDelta,
              invert: false,
              tip: {
                title: "Churn",
                definition: "Average monthly customer churn in this range. Lower is healthier.",
                delta: -kpis.churnDelta,
                spark: toSpark(series, (p) => p.churnRate * 100),
                sparkColor: "var(--color-expense)",
                formatSpark: (v: number) => `${v.toFixed(1)}%`,
                rows: [
                  { label: "This range", value: `${kpis.churn.toFixed(1)}%` },
                  { label: "Prior range", value: `${priorChurn.toFixed(1)}%`, tone: "muted" as const },
                  {
                    label: "Change",
                    value: `${kpis.churnDelta >= 0 ? "+" : "−"}${Math.abs(kpis.churnDelta).toFixed(1)} pts`,
                    tone: kpis.churnDelta <= 0 ? ("positive" as const) : ("negative" as const),
                  },
                  { label: "Customers", value: String(kpis.customers), tone: "muted" as const },
                ],
                hint: "Starter plans usually drive most of the movement. Sort the table by churn.",
              },
            },
          ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
      <div className="min-w-0 lg:col-span-8">{chart}</div>
      <div className="relative z-[1] flex flex-col justify-center gap-3 overflow-visible border-t border-border pt-4 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4">
        {kpiItems.map((item) => (
          <KpiRow key={item.label} {...item} />
        ))}
        {period ? (
          <p className="px-2 text-[11px] text-subtle">
            Highlighted {period.fullLabel}: {formatCurrency(period.revenue)} revenue ·{" "}
            {formatCurrency(period.costs)} costs
          </p>
        ) : null}
      </div>
    </div>
  );
}

function KpiRow({
  label,
  value,
  delta,
  invert,
  tip,
}: {
  label: string;
  value: string;
  delta: number;
  invert?: boolean;
  tip: KpiTipData;
}) {
  const good = invert ? delta <= 0 : delta >= 0;
  return (
    <KpiTip data={tip} side="left" className="rounded-xl px-2 py-2">
      <button type="button" className="w-full text-left">
        <KpiLabel>{label}</KpiLabel>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-2xl font-semibold tracking-tight tabular-nums sm:text-[28px]">{value}</p>
          <Badge variant={good ? "positive" : "negative"}>{formatPct(delta)}</Badge>
        </div>
      </button>
      {tip.spark && tip.spark.length > 1 ? (
        <Sparkline
          points={tip.spark}
          color={tip.sparkColor ?? "var(--color-income)"}
          height={40}
          className="mt-2"
          format={tip.formatSpark ?? formatCurrency}
        />
      ) : null}
    </KpiTip>
  );
}

function formatRangeLabel(from: string, to: string) {
  const fmt = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  return `${fmt(from)} – ${fmt(to)}`;
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-card p-5 shadow-border">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ViewSwitch({
  value,
  options,
}: {
  value: string;
  options: string[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1 rounded-full bg-card-2 px-3 text-xs text-muted hover:text-foreground"
        >
          {value}
          <ChevronDown className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((o) => (
          <DropdownMenuItem key={o}>{o}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FiltersBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
}) {
  const account = ACCOUNTS.find((a) => a.id === filters.accountId) ?? ACCOUNTS[0];

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-muted hover:bg-white/5 hover:text-foreground"
          >
            {account?.name}
            <ChevronDown className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {ACCOUNTS.map((a) => (
            <DropdownMenuItem key={a.id} onSelect={() => onChange({ accountId: a.id })}>
              {a.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <span className="hidden text-subtle sm:inline">/</span>

      <RangePicker filters={filters} onChange={onChange} />

      <span className="hidden text-subtle sm:inline">/</span>

      <div className="inline-flex rounded-full bg-card p-0.5 shadow-border">
        {GRAINS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => onChange({ grain: g.id })}
            className={cn(
              "h-9 rounded-full px-3 text-xs sm:text-sm",
              filters.grain === g.id ? "bg-card-2 text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      <span className="hidden text-subtle sm:inline">/</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-muted hover:bg-white/5 hover:text-foreground"
          >
            {filters.year}
            <ChevronDown className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {YEARS.map((y) => (
            <DropdownMenuItem key={y} onSelect={() => onChange({ year: y, grain: "monthly" as Grain })}>
              {y}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function RangePicker({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
}) {
  const label = `${filters.from.slice(5).replace("-", "/")} – ${filters.to.slice(5).replace("-", "/")}`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-muted hover:bg-white/5 hover:text-foreground"
        >
          <Calendar className="size-3.5" />
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">Range</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <p className="mb-2 text-xs font-medium text-muted">Date range</p>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {[
            { id: "30d", label: "Last 30 days" },
            { id: "90d", label: "Last 90 days" },
            { id: "ytd", label: "Year to date" },
            { id: "2024", label: "2024" },
            { id: "2025", label: "2025" },
            { id: "2026", label: "2026" },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              className="h-8 rounded-full bg-card-2 px-2.5 text-[11px] text-muted hover:text-foreground"
              onClick={() => onChange(presetRange(p.id))}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-[11px] text-muted">
            From
            <input
              type="date"
              value={filters.from}
              min="2023-01-01"
              max={filters.to}
              onChange={(e) => onChange({ from: e.target.value })}
              className="mt-1 h-9 w-full rounded-lg bg-card-2 px-2 text-xs text-foreground"
            />
          </label>
          <label className="text-[11px] text-muted">
            To
            <input
              type="date"
              value={filters.to}
              min={filters.from}
              max="2026-12-31"
              onChange={(e) => onChange({ to: e.target.value })}
              className="mt-1 h-9 w-full rounded-lg bg-card-2 px-2 text-xs text-foreground"
            />
          </label>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TxList({ rows }: { rows: ReturnType<typeof getTransactions> }) {
  return (
    <ul className="mt-3 divide-y divide-border">
      {rows.map((tx) => (
        <li key={tx.id} className="flex items-center justify-between gap-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{tx.merchant}</p>
            <p className="text-[11px] text-muted">
              {tx.date} · {tx.category}
            </p>
          </div>
          <p
            className={cn(
              "tabular-nums text-sm",
              tx.direction === "in" ? "text-positive" : "text-foreground",
            )}
          >
            {tx.direction === "in" ? "+" : "−"}
            {formatCurrency(tx.amount)}
          </p>
        </li>
      ))}
    </ul>
  );
}

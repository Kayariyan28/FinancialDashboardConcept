import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { ForecastLines } from "@/components/charts";
import { HoneycombMap } from "@/components/honeycomb-map";
import { KpiLabel, KpiTip, type KpiTipData } from "@/components/kpi-tip";
import { Sparkline, toSpark } from "@/components/sparkline";
import {
  ACCOUNTS,
  DEFAULT_FILTERS,
  getKpis,
  getSeries,
  getTransactions,
  previousRange,
} from "@/lib/data";
import { cn, formatCurrency, formatPct } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });

function DashboardPage() {
  const kpis = getKpis(DEFAULT_FILTERS);
  const series = getSeries(DEFAULT_FILTERS);
  const tx = getTransactions(DEFAULT_FILTERS).slice(0, 6);
  const prev = previousRange(DEFAULT_FILTERS);
  const priorLabel = formatDashRange(prev.from, prev.to);

  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-muted">2024 consolidated workspace</p>
          </div>
          <Link
            to="/"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-card px-4 text-sm shadow-border hover:bg-card-2"
          >
            Open analytics
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 overflow-visible sm:grid-cols-3">
          <KpiCard
            label="Revenue"
            value={formatCurrency(kpis.revenue)}
            delta={kpis.revenueDelta}
            tip={{
              title: "Revenue",
              definition: "Gross billed revenue for the 2024 consolidated workspace.",
              delta: kpis.revenueDelta,
              spark: toSpark(series, (p) => p.revenue),
              sparkColor: "var(--color-income)",
              rows: [
                { label: "This year", value: formatCurrency(kpis.revenue) },
                {
                  label: "Prior year",
                  value: formatCurrency(kpis.revenue - kpis.revenueChange),
                  tone: "muted",
                },
                {
                  label: "Change",
                  value: `${kpis.revenueChange >= 0 ? "+" : "−"}${formatCurrency(Math.abs(kpis.revenueChange))}`,
                  tone: kpis.revenueChange >= 0 ? "positive" : "negative",
                },
                { label: "Compared to", value: priorLabel, tone: "muted" },
              ],
              hint: "Open analytics to filter by week, month, or a custom range.",
            }}
          />
          <KpiCard
            label="Growth"
            value={formatPct(kpis.growth)}
            delta={kpis.growth}
            tip={{
              title: "Growth",
              definition: "Percent change versus the equal-length period before this year.",
              delta: kpis.growth,
              spark: toSpark(series, (p) => p.revenue),
              sparkColor: "var(--color-income)",
              rows: [
                { label: "This year", value: formatCurrency(kpis.revenue) },
                {
                  label: "Dollar change",
                  value: `${kpis.revenueChange >= 0 ? "+" : "−"}${formatCurrency(Math.abs(kpis.revenueChange))}`,
                  tone: kpis.revenueChange >= 0 ? "positive" : "negative",
                },
                { label: "Compared to", value: priorLabel, tone: "muted" },
              ],
            }}
          />
          <KpiCard
            label="Churn"
            value={`${kpis.churn.toFixed(1)}%`}
            delta={-kpis.churnDelta}
            tip={{
              title: "Churn",
              definition: "Average monthly customer churn. Lower is healthier.",
              delta: -kpis.churnDelta,
              spark: toSpark(series, (p) => p.churnRate * 100),
              sparkColor: "var(--color-expense)",
              formatSpark: (v: number) => `${v.toFixed(1)}%`,
              rows: [
                { label: "This year", value: `${kpis.churn.toFixed(1)}%` },
                {
                  label: "Change",
                  value: `${kpis.churnDelta >= 0 ? "+" : "−"}${Math.abs(kpis.churnDelta).toFixed(1)} pts`,
                  tone: kpis.churnDelta <= 0 ? "positive" : "negative",
                },
                { label: "Customers", value: String(kpis.customers), tone: "muted" },
              ],
              hint: "Starter plans usually drive most of the movement.",
            }}
          />
        </div>

        <HoneycombMap seed={2024} />

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
          <section className="rounded-2xl bg-card p-5 shadow-border lg:col-span-3">
            <h2 className="text-sm font-medium">Revenue vs costs</h2>
            <ForecastLines data={series} highlightKey="2024-05" />
          </section>
          <section className="rounded-2xl bg-card p-5 shadow-border lg:col-span-2">
            <h2 className="text-sm font-medium">Accounts</h2>
            <ul className="mt-3 divide-y divide-border">
              {ACCOUNTS.filter((a) => a.id !== "all").map((a) => (
                <li key={a.id} className="flex items-center gap-3 py-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-[11px] text-muted">{a.kind}</p>
                  </div>
                  <Sparkline
                    points={toSpark(series, (p) => p.netWorth * a.multiplier)}
                    color="var(--color-mix-b)"
                    height={28}
                    className="w-[4.5rem] shrink-0"
                    showValue={false}
                    format={formatCurrency}
                  />
                  <p className="w-[5.5rem] shrink-0 text-right tabular-nums text-sm">
                    {formatCurrency(a.balance)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="rounded-2xl bg-card p-5 shadow-border">
          <h2 className="text-sm font-medium">Recent activity</h2>
          <ul className="mt-3 divide-y divide-border">
            {tx.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{row.merchant}</p>
                  <p className="text-[11px] text-muted">
                    {row.date} · {row.category}
                  </p>
                </div>
                <p
                  className={cn(
                    "tabular-nums text-sm",
                    row.direction === "in" ? "text-positive" : "text-foreground",
                  )}
                >
                  {row.direction === "in" ? "+" : "−"}
                  {formatCurrency(row.amount)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}

function KpiCard({
  label,
  value,
  delta,
  tip,
}: {
  label: string;
  value: string;
  delta: number;
  tip: KpiTipData;
}) {
  return (
    <KpiTip data={tip} side="bottom" className="kpi-card rounded-2xl bg-card p-5 shadow-border">
      <button type="button" className="w-full text-left">
        <KpiLabel>{label}</KpiLabel>
        <div className="mt-2 flex items-end justify-between gap-3">
          <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
          <Badge variant={delta >= 0 ? "positive" : "negative"}>{formatPct(delta)}</Badge>
        </div>
      </button>
      {tip.spark && tip.spark.length > 1 ? (
        <Sparkline
          points={tip.spark}
          color={tip.sparkColor ?? "var(--color-income)"}
          height={56}
          className="mt-3"
          format={tip.formatSpark ?? formatCurrency}
        />
      ) : null}
    </KpiTip>
  );
}

function formatDashRange(from: string, to: string) {
  const fmt = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  return `${fmt(from)} – ${fmt(to)}`;
}

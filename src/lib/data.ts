export type Grain = "weekly" | "monthly" | "yearly";
export type TabId =
  | "summary"
  | "balance"
  | "spending"
  | "income"
  | "net-income"
  | "savings"
  | "net-worth";

export const TABS: { id: TabId; label: string }[] = [
  { id: "summary", label: "Summary" },
  { id: "balance", label: "Balance" },
  { id: "spending", label: "Spending" },
  { id: "income", label: "Income" },
  { id: "net-income", label: "Net Income" },
  { id: "savings", label: "Savings" },
  { id: "net-worth", label: "Net Worth" },
];

export const GRAINS: { id: Grain; label: string }[] = [
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly" },
];

export const YEARS = [2023, 2024, 2025, 2026] as const;

export const TODAY = new Date("2026-08-20T12:00:00");

export interface Account {
  id: string;
  name: string;
  kind: string;
  currency: string;
  balance: number;
  multiplier: number;
}

export const ACCOUNTS: Account[] = [
  {
    id: "all",
    name: "All Accounts",
    kind: "Consolidated",
    currency: "USD",
    balance: 384567.45,
    multiplier: 1,
  },
  {
    id: "operating",
    name: "Operating",
    kind: "Checking",
    currency: "USD",
    balance: 184220.1,
    multiplier: 0.48,
  },
  {
    id: "reserve",
    name: "Revenue reserve",
    kind: "Treasury",
    currency: "USD",
    balance: 96400,
    multiplier: 0.25,
  },
  {
    id: "payroll",
    name: "Payroll",
    kind: "Checking",
    currency: "USD",
    balance: 42110.55,
    multiplier: 0.11,
  },
  {
    id: "apac",
    name: "APAC entity",
    kind: "Operating",
    currency: "USD",
    balance: 61836.8,
    multiplier: 0.16,
  },
];

export interface CardAccount {
  id: string;
  name: string;
  last4: string;
  network: "Visa" | "Amex";
  limit: number;
  spent: number;
  color: "steel" | "rose" | "ink";
}

export const CARDS: CardAccount[] = [
  {
    id: "visa-4412",
    name: "Operating Visa",
    last4: "4412",
    network: "Visa",
    limit: 25000,
    spent: 8420,
    color: "steel",
  },
  {
    id: "amex-8891",
    name: "Corporate Amex",
    last4: "8891",
    network: "Amex",
    limit: 40000,
    spent: 12680,
    color: "ink",
  },
  {
    id: "visa-2209",
    name: "APAC travel",
    last4: "2209",
    network: "Visa",
    limit: 12000,
    spent: 2144,
    color: "rose",
  },
];

export const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const Y2024_REVENUE = [
  28540.12, 27890.44, 34120.8, 29410.22, 33800.76, 30210.55, 31880.1, 26840.33,
  33620.18, 28940.9, 32410.4, 36902.65,
];

const Y2024_COSTS = [
  24110.2, 24880.4, 19820.1, 25640.55, 32600.89, 21120.4, 20440.12, 35210.8,
  24880.22, 26110.45, 19940.3, 24188.17,
];

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function scaleYear(base: number[], factor: number, seed: number): number[] {
  const rnd = mulberry32(seed);
  return base.map((v) => Math.round((v * factor * (0.96 + rnd() * 0.08)) * 100) / 100);
}

const YEAR_SERIES: Record<number, { revenue: number[]; costs: number[] }> = {
  2023: {
    revenue: scaleYear(Y2024_REVENUE, 0.92, 23),
    costs: scaleYear(Y2024_COSTS, 0.95, 231),
  },
  2024: { revenue: Y2024_REVENUE, costs: Y2024_COSTS },
  2025: {
    revenue: scaleYear(Y2024_REVENUE, 1.11, 25),
    costs: scaleYear(Y2024_COSTS, 1.06, 251),
  },
  2026: {
    revenue: scaleYear(Y2024_REVENUE, 1.21, 26),
    costs: scaleYear(Y2024_COSTS, 1.12, 261),
  },
};

export interface PeriodPoint {
  key: string;
  label: string;
  fullLabel: string;
  year: number;
  month: number;
  week?: number;
  start: string;
  end: string;
  revenue: number;
  costs: number;
  net: number;
  customers: number;
  churned: number;
  newCustomers: number;
  churnRate: number;
  savings: number;
  netWorth: number;
  isForecast: boolean;
}

export interface Filters {
  grain: Grain;
  year: number;
  accountId: string;
  from: string;
  to: string;
  tab: TabId;
}

export const DEFAULT_FILTERS: Filters = {
  grain: "monthly",
  year: 2024,
  accountId: "all",
  from: "2024-01-01",
  to: "2024-12-31",
  tab: "summary",
};

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function iso(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

function lastDay(y: number, m: number) {
  return new Date(y, m, 0).getDate();
}

function accountMultiplier(accountId: string) {
  return ACCOUNTS.find((a) => a.id === accountId)?.multiplier ?? 1;
}

function monthCustomers(year: number, month: number) {
  const elapsed = (year - 2023) * 12 + month;
  return Math.round(1680 + elapsed * 38 + Math.sin(month / 2) * 40);
}

function buildMonths(): PeriodPoint[] {
  const points: PeriodPoint[] = [];
  let netWorth = 148200;
  for (const year of YEARS) {
    const series = YEAR_SERIES[year];
    if (!series) continue;
    for (let m = 0; m < 12; m++) {
      const month = m + 1;
      const startDate = new Date(year, m, 1);
      const isForecast = startDate > TODAY;
      const revenue = series.revenue[m] ?? 0;
      const costs = series.costs[m] ?? 0;
      const net = revenue - costs;
      const customers = monthCustomers(year, month);
      const rnd = mulberry32(year * 100 + month);
      const churnRate = 0.018 + rnd() * 0.022;
      const churned = Math.round(customers * churnRate);
      const newCustomers = Math.round(customers * (0.03 + rnd() * 0.025));
      const savings = Math.max(0, net * (0.22 + rnd() * 0.1));
      netWorth += net;
      points.push({
        key: `${year}-${pad(month)}`,
        label: MONTH_LABELS[m] ?? "Jan",
        fullLabel: `${MONTH_LABELS[m]} ${year}`,
        year,
        month,
        start: iso(year, month, 1),
        end: iso(year, month, lastDay(year, month)),
        revenue,
        costs,
        net,
        customers,
        churned,
        newCustomers,
        churnRate,
        savings,
        netWorth,
        isForecast,
      });
    }
  }
  return points;
}

const MONTH_POINTS = buildMonths();

function inRange(pointStart: string, pointEnd: string, from: string, to: string) {
  return pointStart <= to && pointEnd >= from;
}

export function getMonthPoints(filters: Filters): PeriodPoint[] {
  const mult = accountMultiplier(filters.accountId);
  return MONTH_POINTS.filter((p) => inRange(p.start, p.end, filters.from, filters.to)).map(
    (p) => ({
      ...p,
      revenue: round2(p.revenue * mult),
      costs: round2(p.costs * mult),
      net: round2(p.net * mult),
      savings: round2(p.savings * mult),
      netWorth: round2(p.netWorth * mult),
      customers: Math.round(p.customers * (0.55 + 0.45 * mult)),
      churned: Math.round(p.churned * (0.55 + 0.45 * mult)),
      newCustomers: Math.round(p.newCustomers * (0.55 + 0.45 * mult)),
    }),
  );
}

function splitMonthToWeeks(month: PeriodPoint): PeriodPoint[] {
  const weights = [0.22, 0.26, 0.24, 0.28];
  const rnd = mulberry32(month.year * 40 + month.month);
  return weights.map((w, i) => {
    const jitter = 0.9 + rnd() * 0.2;
    const revenue = round2(month.revenue * w * jitter);
    const costs = round2(month.costs * w * (1.85 - jitter));
    const startDay = 1 + i * 7;
    const endDay = Math.min(startDay + 6, lastDay(month.year, month.month));
    return {
      ...month,
      key: `${month.key}-W${i + 1}`,
      label: `${month.label} W${i + 1}`,
      fullLabel: `${month.label} ${month.year} · W${i + 1}`,
      week: i + 1,
      start: iso(month.year, month.month, startDay),
      end: iso(month.year, month.month, endDay),
      revenue,
      costs,
      net: round2(revenue - costs),
      savings: round2(month.savings * w),
      churned: Math.round(month.churned * w),
      newCustomers: Math.round(month.newCustomers * w),
    };
  });
}

export function getSeries(filters: Filters): PeriodPoint[] {
  const months = getMonthPoints(filters);
  if (filters.grain === "monthly") return months;
  if (filters.grain === "weekly") return months.flatMap(splitMonthToWeeks);
  const byYear = new Map<number, PeriodPoint[]>();
  for (const m of months) {
    const list = byYear.get(m.year) ?? [];
    list.push(m);
    byYear.set(m.year, list);
  }
  const yearly: PeriodPoint[] = [];
  for (const [year, list] of byYear) {
    yearly.push(sumPoints(list, String(year), String(year), `${year}`));
  }
  return yearly;
}

function sumPoints(list: PeriodPoint[], key: string, label: string, fullLabel: string): PeriodPoint {
  const first = list[0];
  const last = list[list.length - 1];
  if (!first || !last) {
    return {
      key,
      label,
      fullLabel,
      year: 2024,
      month: 1,
      start: "2024-01-01",
      end: "2024-12-31",
      revenue: 0,
      costs: 0,
      net: 0,
      customers: 0,
      churned: 0,
      newCustomers: 0,
      churnRate: 0,
      savings: 0,
      netWorth: 0,
      isForecast: false,
    };
  }
  const revenue = round2(list.reduce((s, p) => s + p.revenue, 0));
  const costs = round2(list.reduce((s, p) => s + p.costs, 0));
  const churned = list.reduce((s, p) => s + p.churned, 0);
  const customers = last.customers;
  return {
    key,
    label,
    fullLabel,
    year: first.year,
    month: first.month,
    start: first.start,
    end: last.end,
    revenue,
    costs,
    net: round2(revenue - costs),
    customers,
    churned,
    newCustomers: list.reduce((s, p) => s + p.newCustomers, 0),
    churnRate: customers + churned === 0 ? 0 : churned / (customers + churned),
    savings: round2(list.reduce((s, p) => s + p.savings, 0)),
    netWorth: last.netWorth,
    isForecast: list.every((p) => p.isForecast),
  };
}

export function previousRange(filters: Filters): { from: string; to: string } {
  const from = new Date(`${filters.from}T00:00:00`);
  const to = new Date(`${filters.to}T00:00:00`);
  const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);
  const prevTo = new Date(from);
  prevTo.setDate(prevTo.getDate() - 1);
  const prevFrom = new Date(prevTo);
  prevFrom.setDate(prevFrom.getDate() - (days - 1));
  return {
    from: prevFrom.toISOString().slice(0, 10),
    to: prevTo.toISOString().slice(0, 10),
  };
}

export interface Kpis {
  revenue: number;
  costs: number;
  net: number;
  growth: number;
  churn: number;
  churnDelta: number;
  customers: number;
  savings: number;
  savingsRate: number;
  netWorth: number;
  txCount: number;
  revenueDelta: number;
  costDelta: number;
  netDelta: number;
  revenueChange: number;
}

export function getKpis(filters: Filters): Kpis {
  const current = getMonthPoints(filters);
  const prev = previousRange(filters);
  const previous = getMonthPoints({ ...filters, from: prev.from, to: prev.to });
  const sum = (list: PeriodPoint[], key: keyof PeriodPoint) =>
    list.reduce((s, p) => s + (p[key] as number), 0);
  const revenue = sum(current, "revenue");
  const costs = sum(current, "costs");
  const prevRevenue = sum(previous, "revenue");
  const prevCosts = sum(previous, "costs");
  const prevNet = sum(previous, "net");
  const net = revenue - costs;
  const churned = sum(current, "churned");
  const prevChurned = sum(previous, "churned");
  const customers = current.at(-1)?.customers ?? 0;
  const prevCustomers = previous.at(-1)?.customers ?? customers;
  const churn = customers + churned === 0 ? 0 : (churned / current.length || 1) / Math.max(customers, 1);
  const monthlyChurn =
    current.length === 0
      ? 0
      : current.reduce((s, p) => s + p.churnRate, 0) / current.length;
  const prevMonthlyChurn =
    previous.length === 0
      ? monthlyChurn
      : previous.reduce((s, p) => s + p.churnRate, 0) / previous.length;
  const savings = sum(current, "savings");
  return {
    revenue,
    costs,
    net,
    growth: prevRevenue === 0 ? 0 : ((revenue - prevRevenue) / prevRevenue) * 100,
    churn: monthlyChurn * 100,
    churnDelta: (monthlyChurn - prevMonthlyChurn) * 100,
    customers,
    savings,
    savingsRate: revenue === 0 ? 0 : (savings / revenue) * 100,
    netWorth: current.at(-1)?.netWorth ?? 0,
    txCount: Math.max(12, Math.round(current.length * 11.2 + churned * 0.04)),
    revenueDelta: prevRevenue === 0 ? 0 : ((revenue - prevRevenue) / prevRevenue) * 100,
    costDelta: prevCosts === 0 ? 0 : ((costs - prevCosts) / prevCosts) * 100,
    netDelta: prevNet === 0 ? 0 : ((net - prevNet) / Math.abs(prevNet)) * 100,
    revenueChange: revenue - prevRevenue,
  };
}

export interface MixSlice {
  id: string;
  label: string;
  value: number;
  share: number;
  color: string;
}

const REVENUE_MIX = [
  { id: "recurring", label: "Recurring", share: 0.44, color: "var(--color-mix-b)" },
  { id: "new", label: "New business", share: 0.37, color: "var(--color-mix-a)" },
  { id: "expansion", label: "Expansion", share: 0.19, color: "var(--color-mix-c)" },
];

const COST_MIX = [
  { id: "payroll", label: "Payroll", share: 0.4, color: "var(--color-cost-1)" },
  { id: "infra", label: "Infrastructure", share: 0.25, color: "var(--color-cost-2)" },
  { id: "marketing", label: "Marketing", share: 0.2, color: "var(--color-cost-3)" },
  { id: "support", label: "Support", share: 0.1, color: "var(--color-cost-4)" },
  { id: "other", label: "Other", share: 0.05, color: "var(--color-cost-5)" },
];

export function getRevenueMix(total: number): MixSlice[] {
  return REVENUE_MIX.map((s) => ({
    ...s,
    value: round2(total * s.share),
  }));
}

export function getCostMix(total: number): MixSlice[] {
  return COST_MIX.map((s) => ({
    ...s,
    value: round2(total * s.share),
  }));
}

export interface SegmentRow {
  id: string;
  name: string;
  revenue: number;
  share: number;
  growth: number;
  churn: number;
  customers: number;
  status: "Healthy" | "Watch" | "Critical";
  spark: { value: number; label: string }[];
}

const SEGMENTS = [
  { id: "enterprise", name: "Enterprise", share: 0.42, growth: 14.2, churn: 0.8 },
  { id: "growth", name: "Growth", share: 0.28, growth: 9.4, churn: 2.1 },
  { id: "starter", name: "Starter", share: 0.18, growth: 3.1, churn: 4.8 },
  { id: "services", name: "Services", share: 0.12, growth: 6.6, churn: 1.5 },
];

export function getSegments(filters: Filters, kpis: Kpis): SegmentRow[] {
  const rnd = mulberry32(filters.year * 9 + filters.from.length);
  const series = getSeries(filters).filter((p) => !p.isForecast);
  return SEGMENTS.map((s) => {
    const growth = s.growth + (rnd() - 0.5) * 4;
    const churn = s.churn + (rnd() - 0.5) * 0.8;
    const status: SegmentRow["status"] =
      churn >= 4 ? "Critical" : churn >= 2.4 ? "Watch" : "Healthy";
    return {
      id: s.id,
      name: s.name,
      revenue: round2(kpis.revenue * s.share),
      share: s.share * 100,
      growth,
      churn,
      customers: Math.round(kpis.customers * s.share),
      status,
      spark: series.map((p, i) => {
        const wobble = 1 + Math.sin(i * 1.37 + s.share * 10) * 0.1;
        return { value: round2(p.revenue * s.share * wobble), label: p.label };
      }),
    };
  });
}

export interface TxRow {
  id: string;
  date: string;
  merchant: string;
  category: string;
  account: string;
  amount: number;
  direction: "in" | "out";
}

const MERCHANTS_OUT = [
  ["AWS", "Infrastructure"],
  ["Linear", "Infrastructure"],
  ["Figma", "Infrastructure"],
  ["Deel payroll", "Payroll"],
  ["Greenhouse", "Payroll"],
  ["Meta ads", "Marketing"],
  ["Iterable", "Marketing"],
  ["Intercom", "Support"],
  ["Notion", "Other"],
  ["WeWork", "Other"],
];
const MERCHANTS_IN = [
  ["Acme Corp", "Enterprise"],
  ["Northwind", "Growth"],
  ["Blue Ocean", "Starter"],
  ["Helios Labs", "Enterprise"],
  ["Kite Studio", "Services"],
];

export function getTransactions(filters: Filters): TxRow[] {
  const months = getMonthPoints(filters);
  const rows: TxRow[] = [];
  let i = 0;
  for (const m of months) {
    const rnd = mulberry32(m.year * 80 + m.month);
    const outN = 4;
    for (let k = 0; k < outN; k++) {
      const [merchant, category] = MERCHANTS_OUT[Math.floor(rnd() * MERCHANTS_OUT.length)] ?? [
        "Vendor",
        "Other",
      ];
      const day = 2 + Math.floor(rnd() * 24);
      rows.push({
        id: `tx-${++i}`,
        date: iso(m.year, m.month, day),
        merchant,
        category,
        account: ACCOUNTS[1 + Math.floor(rnd() * 4)]?.name ?? "Operating",
        amount: round2(m.costs * (0.08 + rnd() * 0.18)),
        direction: "out",
      });
    }
    const [merchant, category] = MERCHANTS_IN[Math.floor(rnd() * MERCHANTS_IN.length)] ?? [
      "Customer",
      "Growth",
    ];
    rows.push({
      id: `tx-${++i}`,
      date: iso(m.year, m.month, 1 + Math.floor(rnd() * 27)),
      merchant,
      category,
      account: "Operating",
      amount: round2(m.revenue * (0.12 + rnd() * 0.2)),
      direction: "in",
    });
  }
  return rows.sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 48);
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  time: string;
}

export function getNotices(kpis: Kpis, series: PeriodPoint[]): Notice[] {
  const worst = [...series].sort((a, b) => a.net - b.net)[0];
  const notices: Notice[] = [
    {
      id: "pace",
      title: "Revenue pace",
      body:
        kpis.growth >= 0
          ? `You are ${kpis.growth.toFixed(1)}% ahead of the prior period.`
          : `Revenue is ${Math.abs(kpis.growth).toFixed(1)}% behind the prior period.`,
      time: "2h",
    },
    {
      id: "churn",
      title: "Churn watch",
      body:
        kpis.churnDelta >= 0
          ? `Monthly churn rose ${kpis.churnDelta.toFixed(1)} pts to ${kpis.churn.toFixed(1)}%.`
          : `Monthly churn improved ${Math.abs(kpis.churnDelta).toFixed(1)} pts to ${kpis.churn.toFixed(1)}%.`,
      time: "1d",
    },
  ];
  if (worst && worst.net < 0) {
    notices.unshift({
      id: "deficit",
      title: `${worst.label} deficit risk`,
      body: `Costs outpaced revenue in ${worst.fullLabel}. Trim discretionary spend or pull revenue forward.`,
      time: "4h",
    });
  }
  return notices.slice(0, 3);
}

export function forecastInsight(series: PeriodPoint[]): string {
  const worst = [...series].filter((p) => p.isForecast || true).sort((a, b) => a.net - b.net)[0];
  if (worst && worst.net < 0) {
    return `Expecting deficit in ${worst.label}. Consider saving more in the prior month or optimizing leisure expenses.`;
  }
  if (worst && worst.net < worst.revenue * 0.08) {
    return `Thin margin in ${worst.label}. Consider saving more in the prior month or optimizing leisure expenses.`;
  }
  return "On track for the period. Net margin stays positive across the selected range.";
}

export function rangeForYear(year: number): { from: string; to: string } {
  if (year === TODAY.getFullYear()) {
    return { from: iso(year, 1, 1), to: iso(year, 12, 31) };
  }
  return { from: iso(year, 1, 1), to: iso(year, 12, 31) };
}

export function presetRange(preset: string): { from: string; to: string; year: number } {
  const y = TODAY.getFullYear();
  const m = TODAY.getMonth() + 1;
  const d = TODAY.getDate();
  if (preset === "30d") {
    const from = new Date(TODAY);
    from.setDate(from.getDate() - 29);
    return { from: from.toISOString().slice(0, 10), to: iso(y, m, d), year: y };
  }
  if (preset === "90d") {
    const from = new Date(TODAY);
    from.setDate(from.getDate() - 89);
    return { from: from.toISOString().slice(0, 10), to: iso(y, m, d), year: y };
  }
  if (preset === "ytd") {
    return { from: iso(y, 1, 1), to: iso(y, m, d), year: y };
  }
  if (preset === "2023" || preset === "2024" || preset === "2025" || preset === "2026") {
    const year = Number(preset);
    return { ...rangeForYear(year), year };
  }
  return { from: "2024-01-01", to: "2024-12-31", year: 2024 };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

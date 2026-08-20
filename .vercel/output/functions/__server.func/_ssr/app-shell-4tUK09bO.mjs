import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as Menu, s as Bell, t as X } from "../_libs/lucide-react.mjs";
import { a as Root2, i as Portal2, n as Item2, o as Separator2, r as Label2, s as Trigger, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { c as signOut, n as authClient, r as cn, t as Wordmark } from "./client-BG5yFBvl.mjs";
import { i as Trigger$1, n as Portal, r as Root2$1, t as Content2$1 } from "../_libs/radix-ui__react-popover.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-4tUK09bO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
function DropdownMenuContent({ className, sideOffset = 8, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset,
		className: cn("z-50 min-w-44 overflow-hidden rounded-xl bg-card p-1 text-foreground shadow-border", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", className),
		...props
	}) });
}
function DropdownMenuItem({ className, inset, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-sm outline-none", "focus:bg-white/5 data-disabled:pointer-events-none data-disabled:opacity-40", inset && "pl-8", className),
		...props
	});
}
function DropdownMenuLabel({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
		className: cn("px-3 py-1.5 text-xs font-medium text-muted", className),
		...props
	});
}
function DropdownMenuSeparator({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
		className: cn("my-1 h-px bg-border", className),
		...props
	});
}
var Popover = Root2$1;
var PopoverTrigger = Trigger$1;
function PopoverContent({ className, align = "center", sideOffset = 8, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2$1, {
		align,
		sideOffset,
		className: cn("z-50 w-72 rounded-xl bg-card p-3 text-foreground shadow-border outline-none", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
		...props
	}) });
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled (default) -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
var TABS = [
	{
		id: "summary",
		label: "Summary"
	},
	{
		id: "balance",
		label: "Balance"
	},
	{
		id: "spending",
		label: "Spending"
	},
	{
		id: "income",
		label: "Income"
	},
	{
		id: "net-income",
		label: "Net Income"
	},
	{
		id: "savings",
		label: "Savings"
	},
	{
		id: "net-worth",
		label: "Net Worth"
	}
];
var GRAINS = [
	{
		id: "weekly",
		label: "Weekly"
	},
	{
		id: "monthly",
		label: "Monthly"
	},
	{
		id: "yearly",
		label: "Yearly"
	}
];
var YEARS = [
	2023,
	2024,
	2025,
	2026
];
var TODAY = /* @__PURE__ */ new Date("2026-08-20T12:00:00");
var ACCOUNTS = [
	{
		id: "all",
		name: "All Accounts",
		kind: "Consolidated",
		currency: "USD",
		balance: 384567.45,
		multiplier: 1
	},
	{
		id: "operating",
		name: "Operating",
		kind: "Checking",
		currency: "USD",
		balance: 184220.1,
		multiplier: .48
	},
	{
		id: "reserve",
		name: "Revenue reserve",
		kind: "Treasury",
		currency: "USD",
		balance: 96400,
		multiplier: .25
	},
	{
		id: "payroll",
		name: "Payroll",
		kind: "Checking",
		currency: "USD",
		balance: 42110.55,
		multiplier: .11
	},
	{
		id: "apac",
		name: "APAC entity",
		kind: "Operating",
		currency: "USD",
		balance: 61836.8,
		multiplier: .16
	}
];
var CARDS = [
	{
		id: "visa-4412",
		name: "Operating Visa",
		last4: "4412",
		network: "Visa",
		limit: 25e3,
		spent: 8420,
		color: "steel"
	},
	{
		id: "amex-8891",
		name: "Corporate Amex",
		last4: "8891",
		network: "Amex",
		limit: 4e4,
		spent: 12680,
		color: "ink"
	},
	{
		id: "visa-2209",
		name: "APAC travel",
		last4: "2209",
		network: "Visa",
		limit: 12e3,
		spent: 2144,
		color: "rose"
	}
];
var MONTH_LABELS = [
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
	"Dec"
];
var Y2024_REVENUE = [
	28540.12,
	27890.44,
	34120.8,
	29410.22,
	33800.76,
	30210.55,
	31880.1,
	26840.33,
	33620.18,
	28940.9,
	32410.4,
	36902.65
];
var Y2024_COSTS = [
	24110.2,
	24880.4,
	19820.1,
	25640.55,
	32600.89,
	21120.4,
	20440.12,
	35210.8,
	24880.22,
	26110.45,
	19940.3,
	24188.17
];
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a += 1831565813;
		let t = a;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function scaleYear(base, factor, seed) {
	const rnd = mulberry32(seed);
	return base.map((v) => Math.round(v * factor * (.96 + rnd() * .08) * 100) / 100);
}
var YEAR_SERIES = {
	2023: {
		revenue: scaleYear(Y2024_REVENUE, .92, 23),
		costs: scaleYear(Y2024_COSTS, .95, 231)
	},
	2024: {
		revenue: Y2024_REVENUE,
		costs: Y2024_COSTS
	},
	2025: {
		revenue: scaleYear(Y2024_REVENUE, 1.11, 25),
		costs: scaleYear(Y2024_COSTS, 1.06, 251)
	},
	2026: {
		revenue: scaleYear(Y2024_REVENUE, 1.21, 26),
		costs: scaleYear(Y2024_COSTS, 1.12, 261)
	}
};
var DEFAULT_FILTERS = {
	grain: "monthly",
	year: 2024,
	accountId: "all",
	from: "2024-01-01",
	to: "2024-12-31",
	tab: "summary"
};
function pad(n) {
	return n.toString().padStart(2, "0");
}
function iso(y, m, d) {
	return `${y}-${pad(m)}-${pad(d)}`;
}
function lastDay(y, m) {
	return new Date(y, m, 0).getDate();
}
function accountMultiplier(accountId) {
	return ACCOUNTS.find((a) => a.id === accountId)?.multiplier ?? 1;
}
function monthCustomers(year, month) {
	const elapsed = (year - 2023) * 12 + month;
	return Math.round(1680 + elapsed * 38 + Math.sin(month / 2) * 40);
}
function buildMonths() {
	const points = [];
	let netWorth = 148200;
	for (const year of YEARS) {
		const series = YEAR_SERIES[year];
		if (!series) continue;
		for (let m = 0; m < 12; m++) {
			const month = m + 1;
			const isForecast = new Date(year, m, 1) > TODAY;
			const revenue = series.revenue[m] ?? 0;
			const costs = series.costs[m] ?? 0;
			const net = revenue - costs;
			const customers = monthCustomers(year, month);
			const rnd = mulberry32(year * 100 + month);
			const churnRate = .018 + rnd() * .022;
			const churned = Math.round(customers * churnRate);
			const newCustomers = Math.round(customers * (.03 + rnd() * .025));
			const savings = Math.max(0, net * (.22 + rnd() * .1));
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
				isForecast
			});
		}
	}
	return points;
}
var MONTH_POINTS = buildMonths();
function inRange(pointStart, pointEnd, from, to) {
	return pointStart <= to && pointEnd >= from;
}
function getMonthPoints(filters) {
	const mult = accountMultiplier(filters.accountId);
	return MONTH_POINTS.filter((p) => inRange(p.start, p.end, filters.from, filters.to)).map((p) => ({
		...p,
		revenue: round2(p.revenue * mult),
		costs: round2(p.costs * mult),
		net: round2(p.net * mult),
		savings: round2(p.savings * mult),
		netWorth: round2(p.netWorth * mult),
		customers: Math.round(p.customers * (.55 + .45 * mult)),
		churned: Math.round(p.churned * (.55 + .45 * mult)),
		newCustomers: Math.round(p.newCustomers * (.55 + .45 * mult))
	}));
}
function splitMonthToWeeks(month) {
	const weights = [
		.22,
		.26,
		.24,
		.28
	];
	const rnd = mulberry32(month.year * 40 + month.month);
	return weights.map((w, i) => {
		const jitter = .9 + rnd() * .2;
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
			newCustomers: Math.round(month.newCustomers * w)
		};
	});
}
function getSeries(filters) {
	const months = getMonthPoints(filters);
	if (filters.grain === "monthly") return months;
	if (filters.grain === "weekly") return months.flatMap(splitMonthToWeeks);
	const byYear = /* @__PURE__ */ new Map();
	for (const m of months) {
		const list = byYear.get(m.year) ?? [];
		list.push(m);
		byYear.set(m.year, list);
	}
	const yearly = [];
	for (const [year, list] of byYear) yearly.push(sumPoints(list, String(year), String(year), `${year}`));
	return yearly;
}
function sumPoints(list, key, label, fullLabel) {
	const first = list[0];
	const last = list[list.length - 1];
	if (!first || !last) return {
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
		isForecast: false
	};
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
		isForecast: list.every((p) => p.isForecast)
	};
}
function previousRange(filters) {
	const from = /* @__PURE__ */ new Date(`${filters.from}T00:00:00`);
	const to = /* @__PURE__ */ new Date(`${filters.to}T00:00:00`);
	const days = Math.max(1, Math.round((to.getTime() - from.getTime()) / 864e5) + 1);
	const prevTo = new Date(from);
	prevTo.setDate(prevTo.getDate() - 1);
	const prevFrom = new Date(prevTo);
	prevFrom.setDate(prevFrom.getDate() - (days - 1));
	return {
		from: prevFrom.toISOString().slice(0, 10),
		to: prevTo.toISOString().slice(0, 10)
	};
}
function getKpis(filters) {
	const current = getMonthPoints(filters);
	const prev = previousRange(filters);
	const previous = getMonthPoints({
		...filters,
		from: prev.from,
		to: prev.to
	});
	const sum = (list, key) => list.reduce((s, p) => s + p[key], 0);
	const revenue = sum(current, "revenue");
	const costs = sum(current, "costs");
	const prevRevenue = sum(previous, "revenue");
	const prevCosts = sum(previous, "costs");
	const prevNet = sum(previous, "net");
	const net = revenue - costs;
	const churned = sum(current, "churned");
	sum(previous, "churned");
	const customers = current.at(-1)?.customers ?? 0;
	previous.at(-1)?.customers;
	customers + churned === 0 || (churned / current.length || 1) / Math.max(customers, 1);
	const monthlyChurn = current.length === 0 ? 0 : current.reduce((s, p) => s + p.churnRate, 0) / current.length;
	const prevMonthlyChurn = previous.length === 0 ? monthlyChurn : previous.reduce((s, p) => s + p.churnRate, 0) / previous.length;
	const savings = sum(current, "savings");
	return {
		revenue,
		costs,
		net,
		growth: prevRevenue === 0 ? 0 : (revenue - prevRevenue) / prevRevenue * 100,
		churn: monthlyChurn * 100,
		churnDelta: (monthlyChurn - prevMonthlyChurn) * 100,
		customers,
		savings,
		savingsRate: revenue === 0 ? 0 : savings / revenue * 100,
		netWorth: current.at(-1)?.netWorth ?? 0,
		txCount: Math.max(12, Math.round(current.length * 11.2 + churned * .04)),
		revenueDelta: prevRevenue === 0 ? 0 : (revenue - prevRevenue) / prevRevenue * 100,
		costDelta: prevCosts === 0 ? 0 : (costs - prevCosts) / prevCosts * 100,
		netDelta: prevNet === 0 ? 0 : (net - prevNet) / Math.abs(prevNet) * 100,
		revenueChange: revenue - prevRevenue
	};
}
var REVENUE_MIX = [
	{
		id: "recurring",
		label: "Recurring",
		share: .44,
		color: "var(--color-mix-b)"
	},
	{
		id: "new",
		label: "New business",
		share: .37,
		color: "var(--color-mix-a)"
	},
	{
		id: "expansion",
		label: "Expansion",
		share: .19,
		color: "var(--color-mix-c)"
	}
];
var COST_MIX = [
	{
		id: "payroll",
		label: "Payroll",
		share: .4,
		color: "var(--color-cost-1)"
	},
	{
		id: "infra",
		label: "Infrastructure",
		share: .25,
		color: "var(--color-cost-2)"
	},
	{
		id: "marketing",
		label: "Marketing",
		share: .2,
		color: "var(--color-cost-3)"
	},
	{
		id: "support",
		label: "Support",
		share: .1,
		color: "var(--color-cost-4)"
	},
	{
		id: "other",
		label: "Other",
		share: .05,
		color: "var(--color-cost-5)"
	}
];
function getRevenueMix(total) {
	return REVENUE_MIX.map((s) => ({
		...s,
		value: round2(total * s.share)
	}));
}
function getCostMix(total) {
	return COST_MIX.map((s) => ({
		...s,
		value: round2(total * s.share)
	}));
}
var SEGMENTS = [
	{
		id: "enterprise",
		name: "Enterprise",
		share: .42,
		growth: 14.2,
		churn: .8
	},
	{
		id: "growth",
		name: "Growth",
		share: .28,
		growth: 9.4,
		churn: 2.1
	},
	{
		id: "starter",
		name: "Starter",
		share: .18,
		growth: 3.1,
		churn: 4.8
	},
	{
		id: "services",
		name: "Services",
		share: .12,
		growth: 6.6,
		churn: 1.5
	}
];
function getSegments(filters, kpis) {
	const rnd = mulberry32(filters.year * 9 + filters.from.length);
	return SEGMENTS.map((s) => {
		const growth = s.growth + (rnd() - .5) * 4;
		const churn = s.churn + (rnd() - .5) * .8;
		const status = churn >= 4 ? "Critical" : churn >= 2.4 ? "Watch" : "Healthy";
		return {
			id: s.id,
			name: s.name,
			revenue: round2(kpis.revenue * s.share),
			share: s.share * 100,
			growth,
			churn,
			customers: Math.round(kpis.customers * s.share),
			status
		};
	});
}
var MERCHANTS_OUT = [
	["AWS", "Infrastructure"],
	["Linear", "Infrastructure"],
	["Figma", "Infrastructure"],
	["Deel payroll", "Payroll"],
	["Greenhouse", "Payroll"],
	["Meta ads", "Marketing"],
	["Iterable", "Marketing"],
	["Intercom", "Support"],
	["Notion", "Other"],
	["WeWork", "Other"]
];
var MERCHANTS_IN = [
	["Acme Corp", "Enterprise"],
	["Northwind", "Growth"],
	["Blue Ocean", "Starter"],
	["Helios Labs", "Enterprise"],
	["Kite Studio", "Services"]
];
function getTransactions(filters) {
	const months = getMonthPoints(filters);
	const rows = [];
	let i = 0;
	for (const m of months) {
		const rnd = mulberry32(m.year * 80 + m.month);
		const outN = 4;
		for (let k = 0; k < outN; k++) {
			const [merchant, category] = MERCHANTS_OUT[Math.floor(rnd() * MERCHANTS_OUT.length)] ?? ["Vendor", "Other"];
			const day = 2 + Math.floor(rnd() * 24);
			rows.push({
				id: `tx-${++i}`,
				date: iso(m.year, m.month, day),
				merchant,
				category,
				account: ACCOUNTS[1 + Math.floor(rnd() * 4)]?.name ?? "Operating",
				amount: round2(m.costs * (.08 + rnd() * .18)),
				direction: "out"
			});
		}
		const [merchant, category] = MERCHANTS_IN[Math.floor(rnd() * MERCHANTS_IN.length)] ?? ["Customer", "Growth"];
		rows.push({
			id: `tx-${++i}`,
			date: iso(m.year, m.month, 1 + Math.floor(rnd() * 27)),
			merchant,
			category,
			account: "Operating",
			amount: round2(m.revenue * (.12 + rnd() * .2)),
			direction: "in"
		});
	}
	return rows.sort((a, b) => a.date < b.date ? 1 : -1).slice(0, 48);
}
function getNotices(kpis, series) {
	const worst = [...series].sort((a, b) => a.net - b.net)[0];
	const notices = [{
		id: "pace",
		title: "Revenue pace",
		body: kpis.growth >= 0 ? `You are ${kpis.growth.toFixed(1)}% ahead of the prior period.` : `Revenue is ${Math.abs(kpis.growth).toFixed(1)}% behind the prior period.`,
		time: "2h"
	}, {
		id: "churn",
		title: "Churn watch",
		body: kpis.churnDelta >= 0 ? `Monthly churn rose ${kpis.churnDelta.toFixed(1)} pts to ${kpis.churn.toFixed(1)}%.` : `Monthly churn improved ${Math.abs(kpis.churnDelta).toFixed(1)} pts to ${kpis.churn.toFixed(1)}%.`,
		time: "1d"
	}];
	if (worst && worst.net < 0) notices.unshift({
		id: "deficit",
		title: `${worst.label} deficit risk`,
		body: `Costs outpaced revenue in ${worst.fullLabel}. Trim discretionary spend or pull revenue forward.`,
		time: "4h"
	});
	return notices.slice(0, 3);
}
function forecastInsight(series) {
	const worst = [...series].filter((p) => p.isForecast || true).sort((a, b) => a.net - b.net)[0];
	if (worst && worst.net < 0) return `Expecting deficit in ${worst.label}. Consider saving more in the prior month or optimizing leisure expenses.`;
	if (worst && worst.net < worst.revenue * .08) return `Thin margin in ${worst.label}. Consider saving more in the prior month or optimizing leisure expenses.`;
	return "On track for the period. Net margin stays positive across the selected range.";
}
function rangeForYear(year) {
	if (year === TODAY.getFullYear()) return {
		from: iso(year, 1, 1),
		to: iso(year, 12, 31)
	};
	return {
		from: iso(year, 1, 1),
		to: iso(year, 12, 31)
	};
}
function presetRange(preset) {
	const y = TODAY.getFullYear();
	const m = TODAY.getMonth() + 1;
	const d = TODAY.getDate();
	if (preset === "30d") {
		const from = new Date(TODAY);
		from.setDate(from.getDate() - 29);
		return {
			from: from.toISOString().slice(0, 10),
			to: iso(y, m, d),
			year: y
		};
	}
	if (preset === "90d") {
		const from = new Date(TODAY);
		from.setDate(from.getDate() - 89);
		return {
			from: from.toISOString().slice(0, 10),
			to: iso(y, m, d),
			year: y
		};
	}
	if (preset === "ytd") return {
		from: iso(y, 1, 1),
		to: iso(y, m, d),
		year: y
	};
	if (preset === "2023" || preset === "2024" || preset === "2025" || preset === "2026") {
		const year = Number(preset);
		return {
			...rangeForYear(year),
			year
		};
	}
	return {
		from: "2024-01-01",
		to: "2024-12-31",
		year: 2024
	};
}
function round2(n) {
	return Math.round(n * 100) / 100;
}
var NAV = [
	{
		to: "/dashboard",
		label: "Dashboard"
	},
	{
		to: "/accounts",
		label: "Accounts"
	},
	{
		to: "/cards",
		label: "Cards"
	},
	{
		to: "/",
		label: "Analytics"
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1400px] px-3 pt-3 pb-8 sm:px-5 lg:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "relative flex h-14 items-center justify-between rounded-2xl bg-header px-3 shadow-border sm:h-16 sm:px-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "relative z-10 shrink-0",
							"aria-label": "Monex home",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 md:flex",
							children: NAV.map((item) => {
								const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(`${item.to}/`);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: item.to,
									className: cn("rounded-full px-4 py-2 text-sm transition-colors duration-150", active ? "bg-card-2 text-foreground" : "text-muted hover:text-foreground"),
									children: item.label
								}, item.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10 flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoticesBell, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountChip, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-white/5 hover:text-foreground md:hidden",
									onClick: () => setOpen(true),
									"aria-label": "Open menu",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
								})
							]
						})
					]
				}),
				open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "fixed inset-0 z-50 md:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "absolute inset-0 bg-black/60",
						"aria-label": "Close menu",
						onClick: () => setOpen(false)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col gap-2 bg-header p-4 shadow-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "inline-flex size-11 items-center justify-center rounded-full hover:bg-white/5",
								onClick: () => setOpen(false),
								"aria-label": "Close menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "mt-4 flex flex-col gap-1",
							children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								onClick: () => setOpen(false),
								className: "rounded-xl px-4 py-3 text-base hover:bg-white/5",
								children: item.label
							}, item.to))
						})]
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children
				})
			]
		})
	});
}
function NoticesBell() {
	const notices = (0, import_react.useMemo)(() => {
		return getNotices(getKpis(DEFAULT_FILTERS), getSeries(DEFAULT_FILTERS));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "relative inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-white/5 hover:text-foreground",
			"aria-label": "Notifications",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-2.5 right-2.5 size-1.5 rounded-full bg-expense" })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
		align: "end",
		className: "w-80 p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-2 py-1.5 text-xs font-medium text-muted",
			children: "Notifications"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "flex flex-col",
			children: notices.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-lg px-2 py-2 hover:bg-white/4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: n.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] text-subtle",
						children: n.time
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs leading-relaxed text-muted",
					children: n.body
				})]
			}, n.id))
		})]
	})] });
}
function AccountChip() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-11 animate-pulse rounded-full bg-white/5 md:h-11 md:w-36" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/login",
		className: "flex h-11 items-center gap-2.5 rounded-full py-1 pr-3 pl-1 hover:bg-white/5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid size-8 place-items-center rounded-full bg-card-2 text-xs font-semibold",
			children: "MX"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "hidden leading-tight text-left md:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-[11px] text-muted",
				children: "Account"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-sm font-medium",
				children: "Sign in"
			})]
		})]
	});
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex h-11 items-center gap-2.5 rounded-full py-1 pr-3 pl-1 hover:bg-white/5",
			children: [user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "size-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-8 place-items-center rounded-full bg-card-2 text-xs font-semibold",
				children: label.charAt(0).toUpperCase()
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "hidden leading-tight text-left md:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-[11px] text-muted",
					children: "Account"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block max-w-28 truncate text-sm font-medium",
					children: label
				})]
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: user.primaryEmail ?? label }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				onSelect: () => void signOut(),
				children: "Sign out"
			})
		]
	})] });
}
//#endregion
export { rangeForYear as C, presetRange as S, getKpis as _, DropdownMenu as a, getSeries as b, DropdownMenuTrigger as c, PopoverContent as d, PopoverTrigger as f, getCostMix as g, forecastInsight as h, DEFAULT_FILTERS as i, GRAINS as l, YEARS as m, AppShell as n, DropdownMenuContent as o, TABS as p, CARDS as r, DropdownMenuItem as s, ACCOUNTS as t, Popover as u, getRevenueMix as v, getTransactions as x, getSegments as y };

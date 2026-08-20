import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { c as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { i as formatCurrency, o as formatPct, r as cn } from "./client-BG5yFBvl.mjs";
import { _ as getKpis, b as getSeries, i as DEFAULT_FILTERS, n as AppShell, t as ACCOUNTS, x as getTransactions } from "./app-shell-4tUK09bO.mjs";
import { t as Badge } from "./badge-obu36FI0.mjs";
import { r as ForecastLines } from "./charts-CDlam85u.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-CK_v1Bbh.js
var import_jsx_runtime = require_jsx_runtime();
function DashboardPage() {
	const kpis = getKpis(DEFAULT_FILTERS);
	const series = getSeries(DEFAULT_FILTERS);
	const tx = getTransactions(DEFAULT_FILTERS).slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Dashboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "2024 consolidated workspace"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "inline-flex h-10 items-center gap-1.5 rounded-full bg-card px-4 text-sm shadow-border hover:bg-card-2",
					children: ["Open analytics", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-3.5" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Revenue",
						value: formatCurrency(kpis.revenue),
						delta: kpis.revenueDelta
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Growth",
						value: formatPct(kpis.growth),
						delta: kpis.growth
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Churn",
						value: `${kpis.churn.toFixed(1)}%`,
						delta: -kpis.churnDelta
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-3 lg:grid-cols-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-card p-5 shadow-border lg:col-span-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Revenue vs costs"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForecastLines, {
						data: series,
						highlightKey: "2024-05"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-card p-5 shadow-border lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Accounts"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 divide-y divide-border",
						children: ACCOUNTS.filter((a) => a.id !== "all").map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: a.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted",
								children: a.kind
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "tabular-nums text-sm",
								children: formatCurrency(a.balance)
							})]
						}, a.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-card p-5 shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Recent activity"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-border",
					children: tx.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: row.merchant
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted",
								children: [
									row.date,
									" · ",
									row.category
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: cn("tabular-nums text-sm", row.direction === "in" ? "text-positive" : "text-foreground"),
							children: [row.direction === "in" ? "+" : "−", formatCurrency(row.amount)]
						})]
					}, row.id))
				})]
			})
		]
	}) });
}
function KpiCard({ label, value, delta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-card p-5 shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-2xl font-semibold tracking-tight tabular-nums",
				children: value
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: delta >= 0 ? "positive" : "negative",
				children: formatPct(delta)
			})]
		})]
	});
}
//#endregion
export { DashboardPage as component };

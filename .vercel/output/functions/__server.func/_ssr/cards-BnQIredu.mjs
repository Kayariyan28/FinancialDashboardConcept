import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as formatCurrency, r as cn } from "./client-BG5yFBvl.mjs";
import { n as AppShell, r as CARDS } from "./app-shell-4tUK09bO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cards-BnQIredu.js
var import_jsx_runtime = require_jsx_runtime();
function CardsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold tracking-tight",
			children: "Cards"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted",
			children: "Corporate spend for the current period"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-3 md:grid-cols-3",
			children: CARDS.map((card) => {
				const used = card.spent / card.limit;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: cn("relative overflow-hidden rounded-2xl p-5", card.color === "steel" && "bg-income/20", card.color === "rose" && "bg-expense/20", card.color === "ink" && "bg-card-2"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wider text-muted",
							children: card.network
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-6 text-lg font-medium",
							children: card.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-mono text-sm tracking-widest text-muted",
							children: ["•••• ", card.last4]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-1.5 flex justify-between text-xs text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatCurrency(card.spent) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatCurrency(card.limit) })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-1.5 overflow-hidden rounded-full bg-white/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-foreground/80",
									style: { width: `${Math.min(100, used * 100)}%` }
								})
							})]
						})
					]
				}, card.id);
			})
		})]
	}) });
}
//#endregion
export { CardsPage as component };

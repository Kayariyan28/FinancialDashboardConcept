import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as formatCurrency } from "./client-BG5yFBvl.mjs";
import { n as AppShell, t as ACCOUNTS } from "./app-shell-4tUK09bO.mjs";
import { t as Badge } from "./badge-obu36FI0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/accounts-BP5jxAWC.js
var import_jsx_runtime = require_jsx_runtime();
function AccountsPage() {
	const listed = ACCOUNTS.filter((a) => a.id !== "all");
	const total = listed.reduce((s, a) => s + a.balance, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold tracking-tight",
			children: "Accounts"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-sm text-muted",
			children: [
				"Consolidated cash ",
				formatCurrency(total),
				" across ",
				listed.length,
				" books"
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-3 md:grid-cols-2",
			children: listed.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-2xl bg-card p-5 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-medium",
							children: a.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: a.kind
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: a.currency })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-2xl font-semibold tracking-tight tabular-nums",
						children: formatCurrency(a.balance)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-subtle",
						children: [Math.round(a.multiplier * 100), "% of consolidated revenue"]
					})
				]
			}, a.id))
		})]
	}) });
}
//#endregion
export { AccountsPage as component };

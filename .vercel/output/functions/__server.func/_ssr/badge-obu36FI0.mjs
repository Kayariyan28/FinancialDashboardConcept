import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn } from "./client-BG5yFBvl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-obu36FI0.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums", {
	variants: { variant: {
		default: "bg-white/8 text-muted",
		positive: "bg-positive/15 text-positive",
		negative: "bg-negative/15 text-negative",
		warning: "bg-warning/15 text-warning"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };

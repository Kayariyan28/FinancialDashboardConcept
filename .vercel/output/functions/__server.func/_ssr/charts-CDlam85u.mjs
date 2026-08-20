import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as formatCurrency } from "./client-BG5yFBvl.mjs";
import { a as YAxis, c as Line, d as Bar, f as Pie, h as Tooltip, i as LineChart, l as CartesianGrid, m as ResponsiveContainer, n as PieChart, o as XAxis, p as Cell, r as BarChart, s as Area, t as AreaChart, u as ReferenceLine } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/charts-CDlam85u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClientChart({ children, className }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children
		})
	});
}
function useNarrow(breakpoint = 640) {
	const [narrow, setNarrow] = (0, import_react.useState)(() => typeof window === "undefined" ? true : window.innerWidth <= breakpoint);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
		const apply = () => setNarrow(mq.matches);
		apply();
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, [breakpoint]);
	return narrow;
}
function tickInterval(count, narrow) {
	const max = narrow ? 4 : 12;
	if (count <= max) return 0;
	return Math.ceil(count / max) - 1;
}
function ChartTooltip({ active, label, payload, names }) {
	if (!active || !payload?.length) return null;
	const title = (payload[0]?.payload)?.fullLabel ?? label ?? "";
	const seen = /* @__PURE__ */ new Set();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-44 rounded-xl bg-card-2 px-3 py-2.5 shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-1.5 text-xs font-medium text-muted",
			children: title
		}), payload.map((row) => {
			const key = String(row.dataKey ?? row.name);
			if (seen.has(key)) return null;
			seen.add(key);
			const name = names?.[key] ?? row.name ?? key;
			const raw = key === "costsNeg" ? Math.abs(row.value ?? 0) : row.value ?? 0;
			const color = key === "costsNeg" || key === "costs" || key === "churned" ? "var(--color-expense)" : key === "revenue" || key === "net" ? "var(--color-income)" : row.color ?? "var(--color-foreground)";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-6 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "size-1.5 rounded-full",
						style: { background: color }
					}), name]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums text-foreground",
					children: formatCurrency(raw)
				})]
			}, key);
		})]
	});
}
function DivergingBars({ data, activeKey, onActive }) {
	const chartData = (0, import_react.useMemo)(() => data.map((d) => ({
		...d,
		costsNeg: -d.costs
	})), [data]);
	const narrow = useNarrow();
	const activeIndex = Math.max(0, chartData.findIndex((d) => d.key === activeKey));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientChart, {
		className: "h-[260px] w-full sm:h-[300px]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
			data: chartData,
			margin: {
				top: 8,
				right: 4,
				left: 0,
				bottom: 4
			},
			barCategoryGap: "28%",
			onMouseMove: (state) => {
				const idx = state?.activeTooltipIndex;
				if (typeof idx === "number" && chartData[idx]) onActive(chartData[idx].key);
			},
			onClick: (state) => {
				const idx = state?.activeTooltipIndex;
				if (typeof idx === "number" && chartData[idx]) onActive(chartData[idx].key);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pattern", {
					id: "hatchIn",
					width: "7",
					height: "7",
					patternUnits: "userSpaceOnUse",
					patternTransform: "rotate(40)",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: "7",
						height: "7",
						fill: "#16161a"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: "3",
						height: "7",
						fill: "#2c2c34"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pattern", {
					id: "hatchOut",
					width: "7",
					height: "7",
					patternUnits: "userSpaceOnUse",
					patternTransform: "rotate(40)",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: "7",
						height: "7",
						fill: "#16161a"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
						width: "3",
						height: "7",
						fill: "#3a3036"
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					vertical: false,
					stroke: "rgba(255,255,255,0.05)",
					strokeDasharray: "3 6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "label",
					tickLine: false,
					axisLine: false,
					tick: {
						fill: "var(--color-subtle)",
						fontSize: 11
					},
					interval: tickInterval(chartData.length, narrow),
					minTickGap: 12
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					tickLine: false,
					axisLine: false,
					tick: {
						fill: "var(--color-subtle)",
						fontSize: 11
					},
					tickFormatter: (v) => `$${Math.abs(v / 1e3).toFixed(0)}k`,
					width: 40
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
					cursor: { fill: "rgba(255,255,255,0.03)" },
					content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { names: {
						revenue: "Revenue",
						costsNeg: "Costs",
						costs: "Costs"
					} })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
					y: 0,
					stroke: "rgba(255,255,255,0.12)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: "revenue",
					radius: [
						6,
						6,
						0,
						0
					],
					maxBarSize: 36,
					cursor: "pointer",
					children: chartData.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: i === activeIndex ? "var(--color-income)" : "url(#hatchIn)" }, d.key))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: "costsNeg",
					radius: [
						0,
						0,
						6,
						6
					],
					maxBarSize: 36,
					cursor: "pointer",
					children: chartData.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: i === activeIndex ? "var(--color-expense)" : "url(#hatchOut)" }, d.key))
				})
			]
		})
	});
}
function ForecastLines({ data, highlightKey }) {
	const highlight = data.find((d) => d.key === highlightKey) ?? data[Math.floor(data.length / 2)];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientChart, {
		className: "h-[180px] w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
			data,
			margin: {
				top: 16,
				right: 12,
				left: 0,
				bottom: 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					vertical: false,
					stroke: "rgba(255,255,255,0.05)",
					strokeDasharray: "3 6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "label",
					hide: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					hide: true,
					domain: ["auto", "auto"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { names: {
					revenue: "Revenue",
					costs: "Costs"
				} }) }),
				highlight ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
					x: highlight.label,
					stroke: "rgba(255,255,255,0.2)",
					strokeDasharray: "3 3",
					label: {
						value: highlight.label,
						position: "top",
						fill: "var(--color-muted)",
						fontSize: 11
					}
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "revenue",
					stroke: "var(--color-income)",
					strokeWidth: 2,
					dot: {
						r: 3,
						fill: "var(--color-income)",
						strokeWidth: 0
					},
					activeDot: { r: 5 }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "costs",
					stroke: "var(--color-expense)",
					strokeWidth: 2,
					dot: {
						r: 3,
						fill: "var(--color-expense)",
						strokeWidth: 0
					},
					activeDot: { r: 5 }
				})
			]
		})
	});
}
function CostDonut({ slices, totalLabel, totalValue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-auto h-[168px] w-[168px] shrink-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientChart, {
			className: "h-full w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
				data: slices,
				dataKey: "value",
				nameKey: "label",
				innerRadius: 54,
				outerRadius: 76,
				paddingAngle: 3,
				stroke: "none",
				startAngle: 90,
				endAngle: -270,
				children: slices.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: s.color }, s.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
				if (!active || !payload?.length) return null;
				const slice = payload[0]?.payload;
				if (!slice) return null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-card-2 px-3 py-2 text-xs shadow-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: slice.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "tabular-nums",
						children: [
							formatCurrency(slice.value),
							" · ",
							Math.round(slice.share * 100),
							"%"
						]
					})]
				});
			} })] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 grid place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-2xl font-semibold tabular-nums tracking-tight",
					children: totalValue
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: totalLabel
				})]
			})
		})]
	});
}
function NetArea({ data }) {
	const narrow = useNarrow();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientChart, {
		className: "h-[260px] w-full sm:h-[300px]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
			data,
			margin: {
				top: 8,
				right: 8,
				left: 0,
				bottom: 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "netFill",
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "var(--color-income)",
						stopOpacity: .35
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "var(--color-income)",
						stopOpacity: 0
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					vertical: false,
					stroke: "rgba(255,255,255,0.05)",
					strokeDasharray: "3 6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "label",
					tickLine: false,
					axisLine: false,
					tick: {
						fill: "var(--color-subtle)",
						fontSize: 11
					},
					interval: tickInterval(data.length, narrow)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					tickLine: false,
					axisLine: false,
					tick: {
						fill: "var(--color-subtle)",
						fontSize: 11
					},
					tickFormatter: (v) => formatCurrency(v, true),
					width: 48
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { names: {
					net: "Net income",
					netWorth: "Net worth"
				} }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "net",
					stroke: "var(--color-income)",
					fill: "url(#netFill)",
					strokeWidth: 2
				})
			]
		})
	});
}
function WorthArea({ data }) {
	const narrow = useNarrow();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientChart, {
		className: "h-[260px] w-full sm:h-[300px]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
			data,
			margin: {
				top: 8,
				right: 8,
				left: 0,
				bottom: 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "worthFill",
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "var(--color-mix-b)",
						stopOpacity: .3
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "var(--color-mix-b)",
						stopOpacity: 0
					})]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					vertical: false,
					stroke: "rgba(255,255,255,0.05)",
					strokeDasharray: "3 6"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "label",
					tickLine: false,
					axisLine: false,
					tick: {
						fill: "var(--color-subtle)",
						fontSize: 11
					},
					interval: tickInterval(data.length, narrow)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					tickLine: false,
					axisLine: false,
					tick: {
						fill: "var(--color-subtle)",
						fontSize: 11
					},
					tickFormatter: (v) => formatCurrency(v, true),
					width: 52
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { names: {
					netWorth: "Net worth",
					savings: "Savings"
				} }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
					type: "monotone",
					dataKey: "netWorth",
					stroke: "var(--color-mix-b)",
					fill: "url(#worthFill)",
					strokeWidth: 2
				})
			]
		})
	});
}
function MixBar({ slices }) {
	const total = slices.reduce((s, x) => s + x.value, 0) || 1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-2 overflow-hidden rounded-full",
		children: slices.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full",
			style: {
				width: `${s.value / total * 100}%`,
				background: s.color
			}
		}, s.id))
	});
}
//#endregion
export { NetArea as a, MixBar as i, DivergingBars as n, WorthArea as o, ForecastLines as r, CostDonut as t };

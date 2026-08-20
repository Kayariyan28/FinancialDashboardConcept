import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as ChevronDown, l as ArrowUpDown, o as Calendar, r as Sparkles } from "../_libs/lucide-react.mjs";
import { a as formatNumber, i as formatCurrency, o as formatPct, r as cn } from "./client-BG5yFBvl.mjs";
import { C as rangeForYear, S as presetRange, _ as getKpis, a as DropdownMenu, b as getSeries, c as DropdownMenuTrigger, d as PopoverContent, f as PopoverTrigger, g as getCostMix, h as forecastInsight, i as DEFAULT_FILTERS, l as GRAINS, m as YEARS, n as AppShell, o as DropdownMenuContent, p as TABS, s as DropdownMenuItem, t as ACCOUNTS, u as Popover, v as getRevenueMix, x as getTransactions, y as getSegments } from "./app-shell-4tUK09bO.mjs";
import { t as Badge } from "./badge-obu36FI0.mjs";
import { a as NetArea, i as MixBar, n as DivergingBars, o as WorthArea, r as ForecastLines, t as CostDonut } from "./charts-CDlam85u.mjs";
import { i as getSortedRowModel, n as useReactTable, r as getCoreRowModel, t as flexRender } from "../_libs/@tanstack/react-table+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-jndmWTS2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var columns = [
	{
		accessorKey: "name",
		header: "Segment",
		cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: row.original.name
		})
	},
	{
		accessorKey: "revenue",
		header: "Revenue",
		cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums",
			children: formatCurrency(row.original.revenue)
		})
	},
	{
		accessorKey: "share",
		header: "Share",
		cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "tabular-nums text-muted",
			children: [row.original.share.toFixed(0), "%"]
		})
	},
	{
		accessorKey: "growth",
		header: "Growth",
		cell: ({ row }) => {
			const v = row.original.growth;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("tabular-nums", v >= 0 ? "text-positive" : "text-negative"),
				children: formatPct(v)
			});
		}
	},
	{
		accessorKey: "churn",
		header: "Churn",
		cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "tabular-nums text-muted",
			children: [row.original.churn.toFixed(1), "%"]
		})
	},
	{
		accessorKey: "customers",
		header: "Customers",
		cell: ({ row }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums",
			children: formatNumber(row.original.customers)
		})
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const s = row.original.status;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: s === "Healthy" ? "positive" : s === "Watch" ? "warning" : "negative",
				children: s
			});
		}
	}
];
function BreakdownTable({ rows }) {
	const [sorting, setSorting] = (0, import_react.useState)([{
		id: "revenue",
		desc: true
	}]);
	const data = (0, import_react.useMemo)(() => rows, [rows]);
	const table = useReactTable({
		data,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-2xl bg-card shadow-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[640px] text-left text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: table.getHeaderGroups().map((hg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-b border-border",
				children: hg.headers.map((header) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "px-4 py-3 font-medium text-muted",
					children: header.isPlaceholder ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "inline-flex items-center gap-1.5 hover:text-foreground",
						onClick: header.column.getToggleSortingHandler(),
						children: [flexRender(header.column.columnDef.header, header.getContext()), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "size-3 opacity-50" })]
					})
				}, header.id))
			}, hg.id)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: table.getRowModel().rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-b border-border/60 last:border-0 hover:bg-white/[0.03]",
				children: row.getVisibleCells().map((cell) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "px-4 py-3",
					children: flexRender(cell.column.columnDef.cell, cell.getContext())
				}, cell.id))
			}, row.id)) })]
		})
	});
}
function AnalyticsView() {
	const [filters, setFilters] = (0, import_react.useState)(DEFAULT_FILTERS);
	const series = (0, import_react.useMemo)(() => getSeries(filters), [filters]);
	const kpis = (0, import_react.useMemo)(() => getKpis(filters), [filters]);
	const defaultKey = series.find((p) => p.label === "May")?.key ?? series[Math.floor(series.length / 2)]?.key ?? null;
	const [activeKey, setActiveKey] = (0, import_react.useState)(defaultKey);
	const active = series.find((p) => p.key === activeKey) ?? series[0];
	const revenueMix = getRevenueMix(kpis.revenue);
	const costMix = getCostMix(kpis.costs);
	const segments = getSegments(filters, kpis);
	const insight = forecastInsight(series);
	const tx = getTransactions(filters);
	const patch = (next) => {
		setFilters((f) => {
			const merged = {
				...f,
				...next
			};
			if (next.year != null && next.from == null) {
				const range = rangeForYear(next.year);
				merged.from = range.from;
				merged.to = range.to;
			}
			return merged;
		});
		setActiveKey(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight sm:text-[28px]",
					children: "Financial analytics"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiltersBar, {
					filters,
					onChange: patch
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
				children: TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => patch({ tab: tab.id }),
					className: cn("relative shrink-0 px-3 py-2 text-sm transition-colors duration-150", filters.tab === tab.id ? "text-foreground" : "text-muted hover:text-foreground"),
					children: [tab.label, filters.tab === tab.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-2 -bottom-0.5 h-px bg-foreground" }) : null]
				}, tab.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MainPanel, {
				tab: filters.tab,
				series,
				kpis,
				activeKey: activeKey ?? defaultKey,
				onActive: (key) => setActiveKey(key),
				period: active
			}),
			filters.tab === "summary" || filters.tab === "income" || filters.tab === "spending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-3 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Revenue mix",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewSwitch, {
							value: "Categories",
							options: ["Categories", "Sources"]
						}),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-3xl font-semibold tracking-tight tabular-nums",
								children: formatCurrency(kpis.revenue)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixBar, { slices: revenueMix })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 grid grid-cols-3 gap-3",
								children: revenueMix.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "flex items-center gap-1.5 text-xs text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "size-1.5 rounded-full",
											style: { background: s.color }
										}), s.label]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-medium tabular-nums",
										children: formatCurrency(s.value, true)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-subtle",
										children: [Math.round(s.share * 100), "%"]
									})
								] }, s.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Cost analysis",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ViewSwitch, {
							value: "Categories",
							options: ["Categories", "Transactions"]
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CostDonut, {
								slices: costMix,
								totalLabel: "Total",
								totalValue: String(kpis.txCount)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "flex min-w-0 flex-1 flex-col gap-1.5 text-xs",
								children: costMix.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 text-muted",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "size-1.5 rounded-full",
											style: { background: s.color }
										}), s.label]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums",
										children: [Math.round(s.share * 100), "%"]
									})]
								}, s.id))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Financial forecast",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center gap-3 text-[11px] text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-income" }), " Revenue"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-expense" }), " Costs"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForecastLines, {
								data: series,
								highlightKey: activeKey ?? defaultKey
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 flex items-start gap-2 text-xs leading-relaxed text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mt-0.5 size-3.5 shrink-0 text-warning" }), insight]
							})
						]
					})
				]
			}) : null,
			filters.tab === "spending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Recent transactions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TxList, { rows: tx.slice(0, 8) })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium text-muted",
					children: "Segment breakdown"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "hidden text-xs text-subtle sm:block",
					children: "Click column headers to sort"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreakdownTable, { rows: segments })] })
		]
	});
}
function MainPanel({ tab, series, kpis, activeKey, onActive, period }) {
	const chart = tab === "net-income" || tab === "savings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetArea, { data: series }) : tab === "net-worth" || tab === "balance" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorthArea, { data: series }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DivergingBars, {
		data: series,
		activeKey,
		onActive
	});
	const kpiItems = tab === "spending" ? [
		{
			label: "Total costs",
			value: formatCurrency(kpis.costs),
			delta: kpis.costDelta,
			invert: true
		},
		{
			label: "Cost change",
			value: formatPct(kpis.costDelta),
			delta: kpis.costDelta,
			invert: true
		},
		{
			label: "Transactions",
			value: String(kpis.txCount),
			delta: kpis.growth
		}
	] : tab === "net-worth" || tab === "balance" ? [
		{
			label: "Net worth",
			value: formatCurrency(kpis.netWorth),
			delta: kpis.netDelta
		},
		{
			label: "Savings",
			value: formatCurrency(kpis.savings),
			delta: kpis.savingsRate
		},
		{
			label: "Savings rate",
			value: formatPct(kpis.savingsRate),
			delta: kpis.savingsRate
		}
	] : [
		{
			label: "Revenue",
			value: formatCurrency(kpis.revenue),
			delta: kpis.revenueDelta
		},
		{
			label: "Growth",
			value: `${kpis.revenueChange >= 0 ? "+" : "−"}${formatCurrency(Math.abs(kpis.revenueChange))}`,
			delta: kpis.growth
		},
		{
			label: "Churn",
			value: `${kpis.churn.toFixed(1)}%`,
			delta: -kpis.churnDelta,
			invert: false
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-w-0 lg:col-span-8",
			children: chart
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col justify-center gap-6 border-t border-border pt-4 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6",
			children: [kpiItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiRow, { ...item }, item.label)), period ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-[11px] text-subtle",
				children: [
					"Highlighted ",
					period.fullLabel,
					": ",
					formatCurrency(period.revenue),
					" revenue ·",
					" ",
					formatCurrency(period.costs),
					" costs"
				]
			}) : null]
		})]
	});
}
function KpiRow({ label, value, delta, invert }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-1 flex items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-2xl font-semibold tracking-tight tabular-nums sm:text-[28px]",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: (invert ? delta <= 0 : delta >= 0) ? "positive" : "negative",
			children: formatPct(delta)
		})]
	})] });
}
function Panel({ title, action, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-card p-5 shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-medium",
				children: title
			}), action]
		}), children]
	});
}
function ViewSwitch({ value, options }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "inline-flex h-8 items-center gap-1 rounded-full bg-card-2 px-3 text-xs text-muted hover:text-foreground",
			children: [value, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
		align: "end",
		children: options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, { children: o }, o))
	})] });
}
function FiltersBar({ filters, onChange }) {
	const account = ACCOUNTS.find((a) => a.id === filters.accountId) ?? ACCOUNTS[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-2 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-muted hover:bg-white/5 hover:text-foreground",
					children: [account?.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
				align: "end",
				children: ACCOUNTS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
					onSelect: () => onChange({ accountId: a.id }),
					children: a.name
				}, a.id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden text-subtle sm:inline",
				children: "/"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RangePicker, {
				filters,
				onChange
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden text-subtle sm:inline",
				children: "/"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "inline-flex rounded-full bg-card p-0.5 shadow-border",
				children: GRAINS.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onChange({ grain: g.id }),
					className: cn("h-9 rounded-full px-3 text-xs sm:text-sm", filters.grain === g.id ? "bg-card-2 text-foreground" : "text-muted hover:text-foreground"),
					children: g.label
				}, g.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden text-subtle sm:inline",
				children: "/"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-muted hover:bg-white/5 hover:text-foreground",
					children: [filters.year, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-3.5" })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
				align: "end",
				children: YEARS.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
					onSelect: () => onChange({
						year: y,
						grain: "monthly"
					}),
					children: y
				}, y))
			})] })
		]
	});
}
function RangePicker({ filters, onChange }) {
	const label = `${filters.from.slice(5).replace("-", "/")} – ${filters.to.slice(5).replace("-", "/")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-muted hover:bg-white/5 hover:text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden sm:inline",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sm:hidden",
					children: "Range"
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
		align: "end",
		className: "w-72",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-xs font-medium text-muted",
				children: "Date range"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 flex flex-wrap gap-1.5",
				children: [
					{
						id: "30d",
						label: "Last 30 days"
					},
					{
						id: "90d",
						label: "Last 90 days"
					},
					{
						id: "ytd",
						label: "Year to date"
					},
					{
						id: "2024",
						label: "2024"
					},
					{
						id: "2025",
						label: "2025"
					},
					{
						id: "2026",
						label: "2026"
					}
				].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-8 rounded-full bg-card-2 px-2.5 text-[11px] text-muted hover:text-foreground",
					onClick: () => onChange(presetRange(p.id)),
					children: p.label
				}, p.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-[11px] text-muted",
					children: ["From", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: filters.from,
						min: "2023-01-01",
						max: filters.to,
						onChange: (e) => onChange({ from: e.target.value }),
						className: "mt-1 h-9 w-full rounded-lg bg-card-2 px-2 text-xs text-foreground"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-[11px] text-muted",
					children: ["To", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "date",
						value: filters.to,
						min: filters.from,
						max: "2026-12-31",
						onChange: (e) => onChange({ to: e.target.value }),
						className: "mt-1 h-9 w-full rounded-lg bg-card-2 px-2 text-xs text-foreground"
					})]
				})]
			})
		]
	})] });
}
function TxList({ rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-3 divide-y divide-border",
		children: rows.map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex items-center justify-between gap-3 py-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-medium",
					children: tx.merchant
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-muted",
					children: [
						tx.date,
						" · ",
						tx.category
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: cn("tabular-nums text-sm", tx.direction === "in" ? "text-positive" : "text-foreground"),
				children: [tx.direction === "in" ? "+" : "−", formatCurrency(tx.amount)]
			})]
		}, tx.id))
	});
}
function AnalyticsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnalyticsView, {}) });
}
//#endregion
export { AnalyticsPage as component };

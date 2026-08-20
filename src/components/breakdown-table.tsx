import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type ColumnDef,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkline } from "@/components/sparkline";
import type { SegmentRow } from "@/lib/data";
import { cn, formatCurrency, formatNumber, formatPct } from "@/lib/utils";

const columns: ColumnDef<SegmentRow>[] = [
  {
    accessorKey: "name",
    header: "Segment",
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatCurrency(row.original.revenue)}</span>
    ),
  },
  {
    accessorKey: "share",
    header: "Share",
    cell: ({ row }) => (
      <span className="tabular-nums text-muted">{row.original.share.toFixed(0)}%</span>
    ),
  },
  {
    accessorKey: "growth",
    header: "Growth",
    cell: ({ row }) => {
      const v = row.original.growth;
      return (
        <span className={cn("tabular-nums", v >= 0 ? "text-positive" : "text-negative")}>
          {formatPct(v)}
        </span>
      );
    },
  },
  {
    id: "trend",
    header: "Trend",
    accessorFn: (row) => row.spark.at(-1)?.value ?? 0,
    cell: ({ row }) => (
      <Sparkline
        points={row.original.spark}
        color="var(--color-income)"
        height={28}
        className="w-[6.5rem]"
        showValue={false}
        format={formatCurrency}
      />
    ),
  },
  {
    accessorKey: "churn",
    header: "Churn",
    cell: ({ row }) => (
      <span className="tabular-nums text-muted">{row.original.churn.toFixed(1)}%</span>
    ),
  },
  {
    accessorKey: "customers",
    header: "Customers",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatNumber(row.original.customers)}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const s = row.original.status;
      const variant = s === "Healthy" ? "positive" : s === "Watch" ? "warning" : "negative";
      return <Badge variant={variant}>{s}</Badge>;
    },
  },
];

export function BreakdownTable({ rows }: { rows: SegmentRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "revenue", desc: true }]);
  const data = useMemo(() => rows, [rows]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-2xl bg-card shadow-border">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-border">
              {hg.headers.map((header) => (
                <th key={header.id} className="px-4 py-3 font-medium text-muted">
                  {header.isPlaceholder ? null : (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 hover:text-foreground"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <ArrowUpDown className="size-3 opacity-50" />
                    </button>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border/60 last:border-0 hover:bg-white/[0.03]"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

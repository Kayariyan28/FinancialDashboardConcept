import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { ACCOUNTS } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/accounts")({ component: AccountsPage });

function AccountsPage() {
  const listed = ACCOUNTS.filter((a) => a.id !== "all");
  const total = listed.reduce((s, a) => s + a.balance, 0);

  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
          <p className="mt-1 text-sm text-muted">
            Consolidated cash {formatCurrency(total)} across {listed.length} books
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {listed.map((a) => (
            <article
              key={a.id}
              className="rounded-2xl bg-card p-5 shadow-border"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium">{a.name}</h2>
                  <p className="text-xs text-muted">{a.kind}</p>
                </div>
                <Badge>{a.currency}</Badge>
              </div>
              <p className="mt-6 text-2xl font-semibold tracking-tight tabular-nums">
                {formatCurrency(a.balance)}
              </p>
              <p className="mt-1 text-xs text-subtle">
                {Math.round(a.multiplier * 100)}% of consolidated revenue
              </p>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

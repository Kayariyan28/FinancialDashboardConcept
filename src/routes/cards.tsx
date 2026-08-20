import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { CARDS } from "@/lib/data";
import { cn, formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/cards")({ component: CardsPage });

function CardsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Cards</h1>
          <p className="mt-1 text-sm text-muted">Corporate spend for the current period</p>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {CARDS.map((card) => {
            const used = card.spent / card.limit;
            return (
              <article
                key={card.id}
                className={cn(
                  "relative overflow-hidden rounded-2xl p-5",
                  card.color === "steel" && "bg-income/20",
                  card.color === "rose" && "bg-expense/20",
                  card.color === "ink" && "bg-card-2",
                )}
              >
                <p className="text-xs uppercase tracking-wider text-muted">{card.network}</p>
                <h2 className="mt-6 text-lg font-medium">{card.name}</h2>
                <p className="mt-1 font-mono text-sm tracking-widest text-muted">
                  •••• {card.last4}
                </p>
                <div className="mt-8">
                  <div className="mb-1.5 flex justify-between text-xs text-muted">
                    <span>{formatCurrency(card.spent)}</span>
                    <span>{formatCurrency(card.limit)}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-foreground/80"
                      style={{ width: `${Math.min(100, used * 100)}%` }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

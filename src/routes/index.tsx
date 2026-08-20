import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsView } from "@/components/analytics-view";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/")({ component: AnalyticsPage });

function AnalyticsPage() {
  return (
    <AppShell>
      <AnalyticsView />
    </AppShell>
  );
}

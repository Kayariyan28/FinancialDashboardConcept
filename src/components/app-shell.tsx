import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Menu, X } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { Wordmark } from "@/components/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { authEnabled, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";
import { DEFAULT_FILTERS, getKpis, getNotices, getSeries } from "@/lib/data";

const NAV = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/accounts", label: "Accounts" },
  { to: "/cards", label: "Cards" },
  { to: "/", label: "Analytics" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-[1400px] px-3 pt-3 pb-8 sm:px-5 lg:px-6">
        <header className="relative flex h-14 items-center justify-between rounded-2xl bg-header px-3 shadow-border sm:h-16 sm:px-4">
          <Link to="/" className="relative z-10 shrink-0" aria-label="RevMoney home">
            <Wordmark />
          </Link>

          <nav className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition-colors duration-150",
                    active
                      ? "bg-card-2 text-foreground"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative z-10 flex items-center gap-1">
            <NoticesBell />
            <AccountChip />
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-white/5 hover:text-foreground md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </header>

        {open ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-y-0 right-0 flex w-[min(100%,20rem)] flex-col gap-2 bg-header p-4 shadow-border">
              <div className="flex items-center justify-between">
                <Wordmark />
                <button
                  type="button"
                  className="inline-flex size-11 items-center justify-center rounded-full hover:bg-white/5"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>
              <nav className="mt-4 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-base hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        ) : null}

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function NoticesBell() {
  const notices = useMemo(() => {
    const kpis = getKpis(DEFAULT_FILTERS);
    const series = getSeries(DEFAULT_FILTERS);
    return getNotices(kpis, series);
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative inline-flex size-11 items-center justify-center rounded-full text-muted hover:bg-white/5 hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-expense" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-2">
        <p className="px-2 py-1.5 text-xs font-medium text-muted">Notifications</p>
        <ul className="flex flex-col">
          {notices.map((n) => (
            <li key={n.id} className="rounded-lg px-2 py-2 hover:bg-white/4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium">{n.title}</p>
                <span className="text-[11px] text-subtle">{n.time}</span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-muted">{n.body}</p>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

function AccountChip() {
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return <div className="size-11 animate-pulse rounded-full bg-white/5 md:h-11 md:w-36" />;
  }

  if (!user) {
    return (
      <Link
        to="/login"
        className="flex h-11 items-center gap-2.5 rounded-full py-1 pr-3 pl-1 hover:bg-white/5"
      >
        <span className="grid size-8 place-items-center rounded-full bg-card-2 text-xs font-semibold">
          MX
        </span>
        <span className="hidden leading-tight text-left md:block">
          <span className="block text-[11px] text-muted">Account</span>
          <span className="block text-sm font-medium">Sign in</span>
        </span>
      </Link>
    );
  }

  const label = user.displayName ?? user.primaryEmail ?? "Account";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-11 items-center gap-2.5 rounded-full py-1 pr-3 pl-1 hover:bg-white/5"
        >
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt=""
              className="size-8 rounded-full object-cover"
            />
          ) : (
            <span className="grid size-8 place-items-center rounded-full bg-card-2 text-xs font-semibold">
              {label.charAt(0).toUpperCase()}
            </span>
          )}
          <span className="hidden leading-tight text-left md:block">
            <span className="block text-[11px] text-muted">Account</span>
            <span className="block max-w-28 truncate text-sm font-medium">{label}</span>
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{user.primaryEmail ?? label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {authEnabled ? (
          <DropdownMenuItem onSelect={() => void signOut()}>Sign out</DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

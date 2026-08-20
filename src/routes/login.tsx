import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Wordmark } from "@/components/logo";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-background px-6 text-foreground">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex justify-center">
          <Wordmark />
        </Link>
        <div className="rounded-2xl bg-card p-6 shadow-border">
          <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted">
            Open your workspace to save views. Sample analytics stay available without an account.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            {authEnabled ? (
              GROK_PROVIDERS.map((p) => (
                <button
                  key={p.providerId}
                  type="button"
                  onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-card-2 text-sm font-medium hover:bg-white/8"
                >
                  Continue with {p.label}
                </button>
              ))
            ) : (
              <p className="text-sm text-muted">Sign-in is disabled.</p>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-subtle">
          <Link to="/" className="hover:text-foreground">
            Continue with sample data
          </Link>
        </p>
      </div>
    </main>
  );
}

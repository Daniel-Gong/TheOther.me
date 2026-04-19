import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, type SignInPersistence } from "../context/AuthContext";

export function LoginPage() {
  const { user, ready, signInEmail, signInGoogle, signInApple } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const persistence: SignInPersistence = staySignedIn ? "local" : "session";

  if (!ready) {
    return (
      <div className="login-page">
        <div className="login-card card">
          <p className="muted">Loading…</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signInEmail(email.trim(), password, persistence);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setError(null);
    setBusy(true);
    try {
      await signInGoogle(persistence);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function onApple() {
    setError(null);
    setBusy(true);
    try {
      await signInApple(persistence);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Apple sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card card">
        <h1>Sign in</h1>
        <p className="muted">Use the same account as the Oria iOS app. Choose how long this browser should remember you.</p>
        <label className="login-stay-row">
          <input
            type="checkbox"
            checked={staySignedIn}
            onChange={(e) => setStaySignedIn(e.target.checked)}
            disabled={busy}
          />
          <span>Remember this browser after I close it (uses device storage; not the same as “silent” Chrome login)</span>
        </label>
        <form className="stack" onSubmit={(e) => void onSubmit(e)}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" className="btn primary" disabled={busy}>
            {busy ? "Signing in…" : "Sign in with email"}
          </button>
        </form>
        <div className="divider">or</div>
        <div className="login-oauth-row">
          <button type="button" className="btn secondary" disabled={busy} onClick={() => void onGoogle()}>
            Continue with Google
          </button>
          <button type="button" className="btn secondary" disabled={busy} onClick={() => void onApple()}>
            Continue with Apple
          </button>
        </div>
        <p className="muted small login-hint">
          If you land on the app already signed in, this device kept a past Oria web session. Use <strong>Sign out</strong> in
          the header to switch accounts, or clear site data for oria.me in Chrome settings.
        </p>
        <p className="muted small login-footer-link">
          <a href="https://oria.me/">Back to oria.me</a>
        </p>
      </div>
    </div>
  );
}

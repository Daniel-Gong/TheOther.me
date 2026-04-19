import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/notes", label: "Notes" },
  { to: "/moments", label: "Moments" },
  { to: "/insights", label: "Insights" },
  { to: "/memories", label: "Memories" },
  { to: "/profile", label: "Profile" },
];

export function Shell({ children }: { children: ReactNode }) {
  const { user, logOut } = useAuth();
  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-brand">
          <span className="shell-logo">Oria</span>
          <span className="shell-sub">App</span>
        </div>
        <nav className="shell-nav">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="shell-user">
          <span className="muted small">{user?.email ?? user?.uid}</span>
          <button type="button" className="btn ghost" onClick={() => void logOut()}>
            Sign out
          </button>
        </div>
      </header>
      <main className="shell-main">{children}</main>
    </div>
  );
}

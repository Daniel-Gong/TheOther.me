import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function HomePage() {
  const { user } = useAuth();
  return (
    <div className="page page-wide">
      <header className="page-hero">
        <p className="eyebrow">Signed in</p>
        <h1 className="page-title">Welcome back</h1>
        <p className="page-lede muted">
          You are <strong>{user?.email ?? user?.uid}</strong>. Everything here mirrors your Oria iOS app — notes, moments,
          insights, and memories in one calm surface.
        </p>
      </header>
      <ul className="tile-grid">
        <li>
          <Link className="tile" to="/notes">
            <h2>Notes</h2>
            <p>Write and edit notes stored in Firestore.</p>
          </Link>
        </li>
        <li>
          <Link className="tile" to="/moments">
            <h2>Moments</h2>
            <p>Browse your posts and captions.</p>
          </Link>
        </li>
        <li>
          <Link className="tile" to="/insights">
            <h2>Insights</h2>
            <p>Read cached insight documents by category.</p>
          </Link>
        </li>
        <li>
          <Link className="tile" to="/memories">
            <h2>Memories</h2>
            <p>Long-term memories (same limits as the app).</p>
          </Link>
        </li>
        <li>
          <Link className="tile" to="/profile">
            <h2>Profile</h2>
            <p>Edit profile fields stored under your user.</p>
          </Link>
        </li>
      </ul>
    </div>
  );
}

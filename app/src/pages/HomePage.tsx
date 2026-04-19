import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function HomePage() {
  const { user } = useAuth();
  return (
    <div className="page">
      <h1>Welcome</h1>
      <p className="muted">
        Signed in as <strong>{user?.email ?? user?.uid}</strong>. Open a section below — data syncs with your iPhone app.
      </p>
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

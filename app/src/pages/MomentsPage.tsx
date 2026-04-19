import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { getDb } from "../firebase";

type MomentRow = {
  id: string;
  cardType: string;
  caption: string | null;
  visibility: string;
  timestampMs: number;
};

export function MomentsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<MomentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(getDb(), "users", user.uid, "moments"),
        orderBy("timestamp", "desc"),
        limit(40),
      );
      const snap = await getDocs(q);
      const list: MomentRow[] = [];
      for (const d of snap.docs) {
        const data = d.data();
        const ts = data["timestamp"];
        let ms = Date.now();
        if (ts && typeof ts.toMillis === "function") {
          ms = ts.toMillis();
        } else if (typeof ts === "number") {
          ms = ts;
        }
        list.push({
          id: (data["id"] as string) || d.id,
          cardType: (data["cardType"] as string) || "?",
          caption: (data["caption"] as string) ?? null,
          visibility: (data["visibility"] as string) || "public",
          timestampMs: ms,
        });
      }
      setRows(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load moments");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="page">
      <h1>Your moments</h1>
      <p className="muted">Posts under your account (same data as the iOS app).</p>
      {error ? <p className="error">{error}</p> : null}
      {loading ? <p className="muted">Loading…</p> : null}
      {!loading && rows.length === 0 ? <p className="muted">No moments yet.</p> : null}
      <ul className="stack gap">
        {rows.map((m) => (
          <li key={m.id} className="card">
            <div className="row spread">
              <strong>{m.cardType}</strong>
              <span className="muted small">{new Date(m.timestampMs).toLocaleString()}</span>
            </div>
            <p className="muted small">{m.visibility}</p>
            {m.caption ? <p>{m.caption}</p> : <p className="muted">No caption</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

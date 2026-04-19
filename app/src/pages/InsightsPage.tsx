import { useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { getDb } from "../firebase";

const INSIGHT_LABELS: Record<string, string> = {
  lifeHighlights: "Life highlights",
  hiddenPatterns: "Correlations",
  futureSimulation: "Future simulation",
  anomaly: "Anomalies",
  workLifeBalance: "Work-life balance",
  emotionAnalysis: "Emotions",
  goalKeeper: "Goals",
  workout: "Workout",
  sleepAnalysis: "Sleep",
  diet: "Diet",
  music: "Music",
  screenTime: "Screen time",
  personality: "Personality",
};

type InsightRow = { id: string; json: string };

export function InsightsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<InsightRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const snap = await getDocs(collection(getDb(), "users", user.uid, "insights"));
      const list: InsightRow[] = snap.docs.map((d) => ({
        id: d.id,
        json: JSON.stringify(d.data(), null, 2),
      }));
      list.sort((a, b) => a.id.localeCompare(b.id));
      setRows(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load insights");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="page">
      <h1>Insights</h1>
      <p className="muted">Cached insight documents from Firestore (read-only here).</p>
      {error ? <p className="error">{error}</p> : null}
      {loading ? <p className="muted">Loading…</p> : null}
      {!loading && rows.length === 0 ? <p className="muted">No insight documents yet.</p> : null}
      <div className="stack gap">
        {rows.map((r) => (
          <details key={r.id} className="card">
            <summary>
              <strong>{INSIGHT_LABELS[r.id] ?? r.id}</strong>
              <span className="muted small"> ({r.id})</span>
            </summary>
            <pre className="json-pre">{r.json}</pre>
          </details>
        ))}
      </div>
    </div>
  );
}

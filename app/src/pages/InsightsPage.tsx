import { useCallback, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { InsightDocumentBody } from "../components/InsightDocumentBody";
import { useAuth } from "../context/AuthContext";
import { getDb } from "../firebase";
import { stripFirestoreTimestamps } from "../lib/firestoreSerialize";

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

type InsightRow = { id: string; data: Record<string, unknown> };

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
      const list: InsightRow[] = snap.docs.map((d) => {
        const raw = d.data() as Record<string, unknown>;
        const normalized = stripFirestoreTimestamps(raw) as Record<string, unknown>;
        return { id: d.id, data: normalized };
      });
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
    <div className="page page-wide">
      <header className="page-hero">
        <p className="eyebrow">Your data</p>
        <h1 className="page-title">Insights</h1>
        <p className="page-lede muted">Cached insight documents from Firestore, shown the same spirit as the iOS app — not raw dumps.</p>
      </header>
      {error ? <p className="error">{error}</p> : null}
      {loading ? <p className="muted">Loading…</p> : null}
      {!loading && rows.length === 0 ? <p className="muted">No insight documents yet.</p> : null}
      <div className="insight-page-stack">
        {rows.map((r) => (
          <details key={r.id} className="insight-disclosure editorial-card">
            <summary className="insight-disclosure-summary">
              <span className="insight-disclosure-title">{INSIGHT_LABELS[r.id] ?? r.id}</span>
              <span className="insight-disclosure-id muted small">{r.id}</span>
            </summary>
            <div className="insight-disclosure-body">
              <InsightDocumentBody categoryId={r.id} data={r.data} />
              <details className="insight-raw-wrap">
                <summary className="muted small">Technical JSON</summary>
                <pre className="json-pre">{JSON.stringify(r.data, null, 2)}</pre>
              </details>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

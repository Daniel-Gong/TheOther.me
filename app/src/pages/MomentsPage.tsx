import { useCallback, useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { MomentPostCard, normalizeCardData, type MomentComment, type MomentPostModel } from "../components/MomentPostCard";
import { stripFirestoreTimestamps } from "../lib/firestoreSerialize";
import { useAuth } from "../context/AuthContext";
import { getDb } from "../firebase";

function parseTimestampMs(ts: unknown): number {
  if (ts && typeof ts === "object" && "toMillis" in ts && typeof (ts as { toMillis: () => number }).toMillis === "function") {
    return (ts as { toMillis: () => number }).toMillis();
  }
  if (typeof ts === "number") {
    return ts;
  }
  return Date.now();
}

function commentFromFirestore(docId: string, raw: Record<string, unknown>): MomentComment | null {
  const data = stripFirestoreTimestamps(raw) as Record<string, unknown>;
  const id = typeof data.id === "string" ? data.id : docId;
  const text = typeof data.text === "string" ? data.text : "";
  const userId = typeof data.userId === "string" ? data.userId : "";
  const ts = data.timestamp;
  const timestampMs = typeof ts === "number" ? ts : Date.now();
  const parentCommentId = typeof data.parentCommentId === "string" ? data.parentCommentId : null;
  const likeCount = typeof data.likeCount === "number" ? data.likeCount : 0;
  if (!text) {
    return null;
  }
  return { id, userId, text, timestampMs, parentCommentId, likeCount };
}

async function fetchCommentsForPost(userId: string, momentDocId: string): Promise<MomentComment[]> {
  const commentsRef = collection(getDb(), "users", userId, "moments", momentDocId, "comments");
  const snap = await getDocs(query(commentsRef, orderBy("timestamp", "asc")));
  const list: MomentComment[] = [];
  for (const d of snap.docs) {
    const row = commentFromFirestore(d.id, d.data() as Record<string, unknown>);
    if (row) {
      list.push(row);
    }
  }
  return list;
}

const COMMENT_FETCH_CONCURRENCY = 6;

export function MomentsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<MomentPostModel[]>([]);
  const [commentsByDoc, setCommentsByDoc] = useState<Record<string, MomentComment[] | "loading">>({});
  const [commentErrors, setCommentErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    setError(null);
    setCommentsByDoc({});
    setCommentErrors({});
    try {
      const q = query(
        collection(getDb(), "users", user.uid, "moments"),
        orderBy("timestamp", "desc"),
        limit(40),
      );
      const snap = await getDocs(q);
      const list: MomentPostModel[] = [];
      for (const d of snap.docs) {
        const data = d.data();
        const ts = data["timestamp"];
        const ms = parseTimestampMs(ts);
        list.push({
          docId: d.id,
          cardType: (data["cardType"] as string) || "?",
          caption: (data["caption"] as string) ?? null,
          reflection: (data["reflection"] as string) ?? null,
          visibility: (data["visibility"] as string) || "public",
          timestampMs: ms,
          likeCount: typeof data["likeCount"] === "number" ? data["likeCount"] : 0,
          commentCount: typeof data["commentCount"] === "number" ? data["commentCount"] : 0,
          cardData: normalizeCardData(data["cardData"]),
        });
      }
      setRows(list);

      const initialComments: Record<string, MomentComment[] | "loading"> = {};
      for (const p of list) {
        initialComments[p.docId] = "loading";
      }
      setCommentsByDoc(initialComments);
      setCommentErrors({});

      for (let i = 0; i < list.length; i += COMMENT_FETCH_CONCURRENCY) {
        const chunk = list.slice(i, i + COMMENT_FETCH_CONCURRENCY);
        await Promise.all(
          chunk.map(async (p) => {
            try {
              const items = await fetchCommentsForPost(user.uid, p.docId);
              setCommentsByDoc((prev) => ({ ...prev, [p.docId]: items }));
            } catch {
              setCommentsByDoc((prev) => ({ ...prev, [p.docId]: [] }));
              setCommentErrors((prev) => ({ ...prev, [p.docId]: "Could not load comments" }));
            }
          }),
        );
      }
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
    <div className="page page-wide">
      <header className="page-hero">
        <p className="eyebrow">Social</p>
        <h1 className="page-title">Moments</h1>
        <p className="page-lede muted">Posts synced from your account — photos, videos, and conversation.</p>
      </header>
      {error ? <p className="error">{error}</p> : null}
      {loading ? <p className="muted">Loading…</p> : null}
      {!loading && rows.length === 0 ? <p className="muted">No moments yet.</p> : null}
      <div className="moments-feed">
        {rows.map((m) => (
          <MomentPostCard
            key={m.docId}
            post={m}
            comments={commentsByDoc[m.docId] ?? "loading"}
            commentsError={commentErrors[m.docId] ?? null}
          />
        ))}
      </div>
    </div>
  );
}

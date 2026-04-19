import { useMemo, useState } from "react";
import { stripFirestoreTimestamps } from "../lib/firestoreSerialize";

export type MomentComment = {
  id: string;
  userId: string;
  text: string;
  timestampMs: number;
  parentCommentId?: string | null;
  likeCount: number;
};

export type MomentPostModel = {
  docId: string;
  cardType: string;
  caption: string | null;
  reflection: string | null;
  visibility: string;
  timestampMs: number;
  likeCount: number;
  commentCount: number;
  cardData: Record<string, unknown>;
};

function cardTypeLabel(cardType: string): string {
  const map: Record<string, string> = {
    sleep: "Sleep",
    workout: "Workout",
    note: "Note",
    summary: "Day summary",
    location: "Location",
    photo: "Photo",
    insight: "Insight",
    videoOfDay: "Video",
  };
  return map[cardType] ?? cardType;
}

function extractMedia(cardType: string, cardData: Record<string, unknown>) {
  if (cardType === "photo") {
    const raw = cardData["imageURLs"];
    const urls =
      Array.isArray(raw) && raw.every((x): x is string => typeof x === "string")
        ? (raw as string[]).filter((u) => /^https?:\/\//i.test(u))
        : [];
    if (urls.length > 0) {
      return { kind: "images" as const, urls };
    }
  }
  if (cardType === "videoOfDay") {
    const url = typeof cardData["videoURL"] === "string" ? cardData["videoURL"] : "";
    if (/^https?:\/\//i.test(url)) {
      return { kind: "video" as const, url };
    }
  }
  const shared =
    typeof cardData["sharedSummaryImageUrl"] === "string" ? cardData["sharedSummaryImageUrl"] : "";
  if (/^https?:\/\//i.test(shared)) {
    return { kind: "images" as const, urls: [shared] };
  }
  return { kind: "none" as const };
}

function formatTime(ms: number) {
  return new Date(ms).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function MomentPostCard({
  post,
  comments,
  commentsError,
}: {
  post: MomentPostModel;
  comments: MomentComment[] | "loading";
  commentsError: string | null;
}) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const media = useMemo(() => extractMedia(post.cardType, post.cardData), [post.cardType, post.cardData]);

  return (
    <article className="moment-card">
      <header className="moment-card-head">
        <div className="moment-badges">
          <span className="moment-type-pill">{cardTypeLabel(post.cardType)}</span>
          <span className={`moment-vis-pill ${post.visibility === "friends" ? "friends" : ""}`}>
            {post.visibility === "friends" ? "Friends" : "Public"}
          </span>
        </div>
        <time className="moment-time" dateTime={new Date(post.timestampMs).toISOString()}>
          {formatTime(post.timestampMs)}
        </time>
      </header>

      {media.kind === "images" ? (
        <div className={`moment-media moment-media--${media.urls.length === 1 ? "single" : "grid"}`}>
          {media.urls.map((url) => (
            <button
              key={url}
              type="button"
              className="moment-image-btn"
              onClick={() => setLightbox(url)}
              aria-label="View larger"
            >
              <img src={url} alt="" className="moment-image" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      ) : null}
      {media.kind === "video" ? (
        <div className="moment-media moment-media--video">
          <video className="moment-video" controls playsInline preload="metadata" src={media.url} />
        </div>
      ) : null}

      {post.caption ? <p className="moment-caption">{post.caption}</p> : null}
      {post.reflection ? <blockquote className="moment-reflection">{post.reflection}</blockquote> : null}

      <footer className="moment-card-foot">
        <span className="muted small">
          {post.likeCount} {post.likeCount === 1 ? "like" : "likes"}
        </span>
        <span className="muted small">
          {post.commentCount} {post.commentCount === 1 ? "comment" : "comments"}
        </span>
      </footer>

      <div className="moment-comments">
        <h3 className="moment-comments-title">Comments</h3>
        {comments === "loading" ? <p className="muted small">Loading comments…</p> : null}
        {commentsError ? <p className="error small">{commentsError}</p> : null}
        {comments !== "loading" && comments.length === 0 && !commentsError ? (
          <p className="muted small">No comments yet.</p>
        ) : null}
        {comments !== "loading" ? (
          <ul className="moment-comment-list">
            {comments.map((c) => (
              <li key={c.id} className={`moment-comment ${c.parentCommentId ? "reply" : ""}`}>
                <div className="moment-comment-meta">
                  <span className="moment-comment-user">{shortUid(c.userId)}</span>
                  <time className="muted small" dateTime={new Date(c.timestampMs).toISOString()}>
                    {formatTime(c.timestampMs)}
                  </time>
                  {c.likeCount > 0 ? <span className="muted small">{c.likeCount} ♥</span> : null}
                </div>
                <p className="moment-comment-text">{c.text}</p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {lightbox ? (
        <button
          type="button"
          className="moment-lightbox"
          onClick={() => setLightbox(null)}
          aria-label="Close image"
        >
          <img src={lightbox} alt="" />
        </button>
      ) : null}
    </article>
  );
}

function shortUid(uid: string) {
  if (uid.length <= 10) {
    return uid;
  }
  return `${uid.slice(0, 4)}…${uid.slice(-4)}`;
}

/** Normalize raw Firestore `cardData` for the card component. */
export function normalizeCardData(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const stripped = stripFirestoreTimestamps(raw);
  return typeof stripped === "object" && stripped !== null && !Array.isArray(stripped)
    ? (stripped as Record<string, unknown>)
    : {};
}

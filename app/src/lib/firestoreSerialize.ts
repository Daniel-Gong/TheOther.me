import type { Timestamp } from "firebase/firestore";

function isFirestoreTimestamp(v: unknown): v is Timestamp {
  return (
    typeof v === "object" &&
    v !== null &&
    "toMillis" in v &&
    typeof (v as Timestamp).toMillis === "function"
  );
}

/** Recursively convert Firestore Timestamps to epoch ms for JSON display and React rendering. */
export function stripFirestoreTimestamps<T>(value: T): unknown {
  if (value === null || value === undefined) {
    return value;
  }
  if (isFirestoreTimestamp(value)) {
    return value.toMillis();
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  if (Array.isArray(value)) {
    return value.map((item) => stripFirestoreTimestamps(item));
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      out[key] = stripFirestoreTimestamps(obj[key]);
    }
    return out;
  }
  return value;
}

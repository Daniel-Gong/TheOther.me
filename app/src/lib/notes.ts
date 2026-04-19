import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  type Firestore,
} from "firebase/firestore";

export type NoteDoc = {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  timezone: string | null;
  source: { service: string; sourceId?: string | null; confidence?: number | null };
  completeness: number | null;
  quality: string | null;
  title: string | null;
  content: string;
  tags: string[] | null;
  mood: string | null;
  noteType: string;
  createdAt: string;
  updatedAt: string | null;
};

function nowIso(): string {
  return new Date().toISOString();
}

function todayLocalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function notesCollection(db: Firestore, uid: string) {
  return collection(db, "users", uid, "notes");
}

export async function listNotes(db: Firestore, uid: string): Promise<NoteDoc[]> {
  const q = query(notesCollection(db, uid), orderBy("date", "desc"), limit(80));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<NoteDoc, "id">) }));
}

export async function createNote(
  db: Firestore,
  uid: string,
  input: { title: string | null; content: string; tags?: string[] },
): Promise<string> {
  const id = crypto.randomUUID();
  const now = nowIso();
  const date = todayLocalDate();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  await setDoc(doc(notesCollection(db, uid), id), {
    id,
    date,
    startTime: now,
    endTime: null,
    timezone: tz,
    source: { service: "web", sourceId: "user_created" },
    completeness: 100,
    quality: "high",
    title: input.title?.trim() ? input.title.trim() : null,
    content: input.content,
    tags: input.tags?.length ? input.tags : null,
    mood: null,
    noteType: "memo",
    createdAt: now,
  });
  return id;
}

export async function updateNote(
  db: Firestore,
  uid: string,
  id: string,
  input: { title: string | null; content: string; tags?: string[] },
): Promise<void> {
  const now = nowIso();
  await updateDoc(doc(notesCollection(db, uid), id), {
    content: input.content,
    title: input.title?.trim() ? input.title.trim() : null,
    tags: input.tags?.length ? input.tags : null,
    updatedAt: now,
  });
}

export async function deleteNote(db: Firestore, uid: string, id: string): Promise<void> {
  await deleteDoc(doc(notesCollection(db, uid), id));
}

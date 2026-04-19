import type { ReactNode } from "react";

function formatAnyDate(value: unknown): string | null {
  if (value == null) {
    return null;
  }
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  }
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  }
  if (typeof value === "object" && value !== null && "_seconds" in value) {
    const sec = (value as { _seconds: number })._seconds;
    const d = new Date(sec * 1000);
    return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  }
  return null;
}

function pickStr(data: Record<string, unknown>, key: string): string | null {
  const v = data[key];
  return typeof v === "string" && v.trim() ? v : null;
}

function pickStrArray(data: Record<string, unknown>, key: string): string[] {
  const v = data[key];
  if (!Array.isArray(v)) {
    return [];
  }
  return v.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
}

function pickObjArray(data: Record<string, unknown>, key: string): Record<string, unknown>[] {
  const v = data[key];
  if (!Array.isArray(v)) {
    return [];
  }
  return v.filter((x): x is Record<string, unknown> => x !== null && typeof x === "object" && !Array.isArray(x));
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="insight-section">
      <h3 className="insight-section-title">{title}</h3>
      {children}
    </section>
  );
}

function Prose({ text }: { text: string }) {
  return <p className="insight-prose">{text}</p>;
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <ul className="insight-bullets">
      {items.map((t, idx) => (
        <li key={idx}>{t}</li>
      ))}
    </ul>
  );
}

function SummaryImage({ url }: { url: string }) {
  return (
    <div className="insight-hero-image-wrap">
      <img src={url} alt="" className="insight-hero-image" loading="lazy" decoding="async" />
    </div>
  );
}

function MetaStrip({ data }: { data: Record<string, unknown> }) {
  const generated = formatAnyDate(data.generatedAt);
  const start = formatAnyDate(data.dataRangeStart);
  const end = formatAnyDate(data.dataRangeEnd);
  if (!generated && !start && !end) {
    return null;
  }
  return (
    <div className="insight-meta-strip">
      {generated ? <span>Updated {generated}</span> : null}
      {start && end ? (
        <span className="insight-meta-sep">
          Data window · {start} — {end}
        </span>
      ) : null}
    </div>
  );
}

function HighlightCards({ items }: { items: Record<string, unknown>[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <div className="insight-highlight-grid">
      {items.map((h, i) => {
        const title = typeof h.title === "string" ? h.title : "Highlight";
        const desc = typeof h.description === "string" ? h.description : "";
        const emoji = typeof h.emoji === "string" ? h.emoji : "";
        const date = typeof h.date === "string" ? h.date : null;
        return (
          <article key={(h.id as string) ?? `${i}`} className="insight-highlight-card">
            <div className="insight-highlight-top">
              {emoji ? <span className="insight-highlight-emoji">{emoji}</span> : null}
              {date ? <span className="insight-highlight-date">{date}</span> : null}
            </div>
            <h4>{title}</h4>
            {desc ? <p>{desc}</p> : null}
          </article>
        );
      })}
    </div>
  );
}

function AchievementChips({ items }: { items: Record<string, unknown>[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <div className="insight-chip-row">
      {items.map((a, i) => {
        const title = typeof a.title === "string" ? a.title : `Achievement ${i + 1}`;
        const desc = typeof a.description === "string" ? a.description : "";
        return (
          <div key={i} className="insight-chip" title={desc}>
            {title}
          </div>
        );
      })}
    </div>
  );
}

function PatternCards({ patterns }: { patterns: Record<string, unknown>[] }) {
  if (patterns.length === 0) {
    return null;
  }
  const top = patterns.slice(0, 6);
  return (
    <div className="insight-pattern-stack">
      {top.map((p, i) => {
        const title = typeof p.title === "string" ? p.title : "Pattern";
        const desc = typeof p.description === "string" ? p.description : "";
        const interpretation = typeof p.interpretation === "string" ? p.interpretation : "";
        const conf = typeof p.confidence === "number" ? Math.round(p.confidence) : null;
        return (
          <article key={(p.id as string) ?? `${i}`} className="insight-pattern-card">
            <div className="insight-pattern-head">
              <h4>{title}</h4>
              {conf !== null ? <span className="insight-pill">{conf}% confidence</span> : null}
            </div>
            {desc ? <p className="muted small">{desc}</p> : null}
            {interpretation ? <p className="insight-prose muted small">{interpretation}</p> : null}
          </article>
        );
      })}
    </div>
  );
}

function ScenarioCards({ scenarios }: { scenarios: Record<string, unknown>[] }) {
  if (scenarios.length === 0) {
    return null;
  }
  return (
    <div className="insight-scenario-stack">
      {scenarios.map((s, i) => {
        const title = typeof s.title === "string" ? s.title : "Scenario";
        const horizon = typeof s.horizon === "string" ? s.horizon : "";
        const narrative = typeof s.narrative === "string" ? s.narrative : "";
        const band = typeof s.confidenceBand === "string" ? s.confidenceBand : "";
        const signals = pickStrArray(s, "supportingSignals");
        return (
          <article key={i} className="insight-scenario-card">
            <div className="insight-scenario-head">
              <h4>{title}</h4>
              {horizon ? <span className="insight-pill subtle">{horizon}</span> : null}
            </div>
            {band ? <p className="muted small">{band}</p> : null}
            {narrative ? <Prose text={narrative} /> : null}
            {signals.length > 0 ? (
              <div>
                <p className="insight-mini-label">Signals</p>
                <BulletList items={signals} />
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function BranchCards({ branches }: { branches: Record<string, unknown>[] }) {
  if (branches.length === 0) {
    return null;
  }
  return (
    <div className="insight-branch-stack">
      {branches.map((b, i) => {
        const prompt = typeof b.decisionPrompt === "string" ? b.decisionPrompt : "Decision point";
        const st = typeof b.shortTermOutlook === "string" ? b.shortTermOutlook : "";
        const lt = typeof b.longTermOutlook === "string" ? b.longTermOutlook : "";
        const tradeoffs = pickStrArray(b, "tradeoffs");
        return (
          <article key={(b.id as string) ?? `${i}`} className="insight-branch-card">
            <h4>{prompt}</h4>
            {st ? (
              <p>
                <span className="insight-mini-label">Near term</span> {st}
              </p>
            ) : null}
            {lt ? (
              <p>
                <span className="insight-mini-label">Longer horizon</span> {lt}
              </p>
            ) : null}
            {tradeoffs.length > 0 ? (
              <div>
                <p className="insight-mini-label">Tradeoffs</p>
                <BulletList items={tradeoffs} />
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function TraitMeters({ traits }: { traits: Record<string, unknown>[] }) {
  if (traits.length === 0) {
    return null;
  }
  return (
    <div className="insight-trait-grid">
      {traits.slice(0, 8).map((t, i) => {
        const name = typeof t.name === "string" ? t.name : typeof t.trait === "string" ? t.trait : "Trait";
        const score = typeof t.score === "number" ? t.score : typeof t.value === "number" ? t.value : null;
        const pct = score !== null ? Math.min(100, Math.max(0, score)) : 50;
        return (
          <div key={i} className="insight-trait">
            <div className="insight-trait-label">
              <span>{name}</span>
              {score !== null ? <span className="muted small">{Math.round(score)}</span> : null}
            </div>
            <div className="insight-trait-bar">
              <div className="insight-trait-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function anomalySeverityLabel(v: unknown): string {
  if (typeof v === "string") {
    return v;
  }
  if (v && typeof v === "object" && "rawValue" in v && typeof (v as { rawValue: string }).rawValue === "string") {
    return (v as { rawValue: string }).rawValue;
  }
  return "";
}

function AnomalyList({ anomalies }: { anomalies: Record<string, unknown>[] }) {
  if (anomalies.length === 0) {
    return null;
  }
  return (
    <ul className="insight-anomaly-list">
      {anomalies.slice(0, 12).map((a, i) => {
        const typeRaw = typeof a.type === "string" ? a.type : "";
        const title = typeRaw ? typeRaw.replace(/_/g, " ") : "Anomaly";
        const detail = typeof a.description === "string" ? a.description : "";
        const severity = anomalySeverityLabel(a.severity);
        return (
          <li key={i} className="insight-anomaly-item">
            <div className="insight-anomaly-head">
              <strong>{title}</strong>
              {severity ? <span className="insight-pill warn">{severity}</span> : null}
            </div>
            {detail ? <p className="muted small">{detail}</p> : null}
          </li>
        );
      })}
    </ul>
  );
}

function StatGrid({ pairs }: { pairs: { label: string; value: string }[] }) {
  if (pairs.length === 0) {
    return null;
  }
  return (
    <dl className="insight-stat-grid">
      {pairs.map(({ label, value }) => (
        <div key={label} className="insight-stat-cell">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function renderLifeHighlights(data: Record<string, unknown>) {
  const summary = pickStr(data, "weekSummary");
  const img = pickStr(data, "summaryImageUrl") ?? pickStr(data, "summaryImageURL");
  const highlights = pickObjArray(data, "highlights");
  const achievements = pickObjArray(data, "achievements");
  return (
    <>
      {img ? <SummaryImage url={img} /> : null}
      {summary ? (
        <Section title="Week in focus">
          <Prose text={summary} />
        </Section>
      ) : null}
      {highlights.length > 0 ? (
        <Section title="Highlights">
          <HighlightCards items={highlights} />
        </Section>
      ) : null}
      {achievements.length > 0 ? (
        <Section title="Achievements">
          <AchievementChips items={achievements} />
        </Section>
      ) : null}
    </>
  );
}

function renderWorkout(data: Record<string, unknown>) {
  const insights = pickStrArray(data, "insights");
  const recs = pickStrArray(data, "recommendations");
  const img = pickStr(data, "summaryImageUrl");
  const zone = pickStr(data, "dominantZone");
  const intensity = typeof data.intensityScore === "number" ? data.intensityScore : null;
  const pairs: { label: string; value: string }[] = [];
  if (intensity !== null) {
    pairs.push({ label: "Intensity", value: `${Math.round(intensity)}` });
  }
  if (zone) {
    pairs.push({ label: "Dominant zone", value: zone });
  }
  if (typeof data.totalDurationMins === "number") {
    pairs.push({ label: "Total duration", value: `${Math.round(data.totalDurationMins)} min` });
  }
  if (typeof data.totalCalories === "number") {
    pairs.push({ label: "Calories", value: `${Math.round(data.totalCalories)}` });
  }
  if (typeof data.avgHeartRate === "number") {
    pairs.push({ label: "Avg HR", value: `${Math.round(data.avgHeartRate)} bpm` });
  }
  const recent = pickObjArray(data, "recentWorkouts").slice(0, 4);
  return (
    <>
      {img ? <SummaryImage url={img} /> : null}
      <StatGrid pairs={pairs} />
      {insights.length > 0 ? (
        <Section title="Takeaways">
          <BulletList items={insights} />
        </Section>
      ) : null}
      {recs.length > 0 ? (
        <Section title="Recommendations">
          <BulletList items={recs} />
        </Section>
      ) : null}
      {recent.length > 0 ? (
        <Section title="Recent sessions">
          <div className="insight-mini-table">
            {recent.map((w, i) => (
              <div key={i} className="insight-mini-row">
                <span>{pickStr(w, "title") ?? pickStr(w, "name") ?? "Workout"}</span>
                <span className="muted small">
                  {[pickStr(w, "date"), typeof w.durationMinutes === "number" ? `${w.durationMinutes} min` : ""]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}

function renderSleep(data: Record<string, unknown>) {
  const insights = pickStrArray(data, "insights");
  const recs = pickStrArray(data, "recommendations");
  const img = pickStr(data, "summaryImageUrl");
  const last = data.lastNight as Record<string, unknown> | undefined;
  const score =
    last && typeof last.sleepScore === "number"
      ? last.sleepScore
      : last && typeof last.score === "number"
        ? last.score
        : null;
  const duration =
    last && typeof last.durationHours === "number"
      ? `${last.durationHours.toFixed(1)} h`
      : last && typeof last.totalSleepHours === "number"
        ? `${last.totalSleepHours.toFixed(1)} h`
        : null;
  return (
    <>
      {img ? <SummaryImage url={img} /> : null}
      <StatGrid
        pairs={[
          ...(score !== null ? [{ label: "Last night score", value: `${Math.round(score)}` }] : []),
          ...(duration ? [{ label: "Sleep duration", value: duration }] : []),
        ]}
      />
      {insights.length > 0 ? (
        <Section title="Takeaways">
          <BulletList items={insights} />
        </Section>
      ) : null}
      {recs.length > 0 ? (
        <Section title="Recommendations">
          <BulletList items={recs} />
        </Section>
      ) : null}
    </>
  );
}

function renderMusic(data: Record<string, unknown>) {
  const summary = pickStr(data, "summary");
  const img = pickStr(data, "previewImageUrl") ?? pickStr(data, "summaryImageUrl");
  const artists = pickObjArray(data, "topArtists").slice(0, 5);
  const tracks = pickObjArray(data, "topTracks").slice(0, 5);
  const genres = pickObjArray(data, "topGenres").slice(0, 5);
  const score = typeof data.insightScore === "number" ? Math.round(data.insightScore) : null;
  return (
    <>
      {img ? <SummaryImage url={img} /> : null}
      {score !== null ? (
        <p className="insight-score-line">
          Listening signal <strong>{score}</strong>
        </p>
      ) : null}
      {summary ? (
        <Section title="Summary">
          <Prose text={summary} />
        </Section>
      ) : null}
      {artists.length > 0 ? (
        <Section title="Top artists">
          <ol className="insight-ranked">
            {artists.map((a, i) => (
              <li key={i}>
                {pickStr(a, "name") ?? pickStr(a, "artist") ?? "Artist"}
                {typeof a.playCount === "number" ? <span className="muted small"> · {a.playCount} plays</span> : null}
              </li>
            ))}
          </ol>
        </Section>
      ) : null}
      {tracks.length > 0 ? (
        <Section title="Top tracks">
          <ol className="insight-ranked">
            {tracks.map((t, i) => (
              <li key={i}>
                {pickStr(t, "title") ?? "Track"}
                {pickStr(t, "artist") ? <span className="muted small"> — {pickStr(t, "artist")}</span> : null}
              </li>
            ))}
          </ol>
        </Section>
      ) : null}
      {genres.length > 0 ? (
        <Section title="Genres">
          <div className="insight-chip-row">
            {genres.map((g, i) => (
              <div key={i} className="insight-chip">
                {pickStr(g, "name") ?? pickStr(g, "genre") ?? "Genre"}
                {typeof g.percent === "number" ? ` · ${Math.round(g.percent)}%` : null}
              </div>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}

function renderHiddenPatterns(data: Record<string, unknown>) {
  const summary = pickStr(data, "summary");
  const img = pickStr(data, "summaryImageUrl");
  const insights = pickStrArray(data, "insights");
  const top = pickObjArray(data, "topPatterns");
  const all = pickObjArray(data, "allPatterns");
  const patterns = top.length > 0 ? top : all;
  return (
    <>
      {img ? <SummaryImage url={img} /> : null}
      {summary ? (
        <Section title="Summary">
          <Prose text={summary} />
        </Section>
      ) : null}
      {patterns.length > 0 ? (
        <Section title="Patterns">
          <PatternCards patterns={patterns} />
        </Section>
      ) : null}
      {insights.length > 0 ? (
        <Section title="Takeaways">
          <BulletList items={insights} />
        </Section>
      ) : null}
    </>
  );
}

function renderFutureSimulation(data: Record<string, unknown>) {
  const summary = pickStr(data, "summary");
  const img = pickStr(data, "summaryImageUrl");
  const baseline = pickStr(data, "baselineNarrative");
  const scenarios = pickObjArray(data, "projectedScenarios");
  const branches = pickObjArray(data, "branchPoints");
  const sources = pickStrArray(data, "dataSourcesUsed");
  return (
    <>
      {img ? <SummaryImage url={img} /> : null}
      {summary ? (
        <Section title="Overview">
          <Prose text={summary} />
        </Section>
      ) : null}
      {baseline ? (
        <Section title="Baseline narrative">
          <Prose text={baseline} />
        </Section>
      ) : null}
      {scenarios.length > 0 ? (
        <Section title="Projected scenarios">
          <ScenarioCards scenarios={scenarios} />
        </Section>
      ) : null}
      {branches.length > 0 ? (
        <Section title="Branch points">
          <BranchCards branches={branches} />
        </Section>
      ) : null}
      {sources.length > 0 ? (
        <Section title="Data sources">
          <div className="insight-chip-row">
            {sources.map((s) => (
              <span key={s} className="insight-pill subtle">
                {s}
              </span>
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}

function renderEmotion(data: Record<string, unknown>) {
  const img = pickStr(data, "summaryImageUrl");
  const highlights = pickObjArray(data, "emotionHighlights");
  const insights = pickStrArray(data, "insights");
  const current = data.currentMood as Record<string, unknown> | undefined;
  const moodLabel =
    current && typeof current.mood === "string"
      ? current.mood
      : current && pickStr(current, "label") !== null
        ? pickStr(current, "label")!
        : null;
  const moodNote = current && typeof current.note === "string" ? current.note : null;
  return (
    <>
      {img ? <SummaryImage url={img} /> : null}
      {moodLabel ? (
        <Section title="Current mood">
          <p className="insight-score-line">
            <strong>{moodLabel}</strong>
            {moodNote ? <span className="muted"> — {moodNote}</span> : null}
          </p>
        </Section>
      ) : null}
      {highlights.length > 0 ? (
        <Section title="Highlights">
          <ul className="insight-bullets">
            {highlights.map((h, i) => (
              <li key={i}>{typeof h.text === "string" ? h.text : JSON.stringify(h)}</li>
            ))}
          </ul>
        </Section>
      ) : null}
      {insights.length > 0 ? (
        <Section title="Takeaways">
          <BulletList items={insights} />
        </Section>
      ) : null}
    </>
  );
}

function renderPersonality(data: Record<string, unknown>) {
  const summary = pickStr(data, "summary");
  const img = pickStr(data, "summaryImageUrl");
  const traits = pickObjArray(data, "traits");
  const interests = pickObjArray(data, "interests");
  const habits = pickObjArray(data, "habits");
  return (
    <>
      {img ? <SummaryImage url={img} /> : null}
      {summary ? (
        <Section title="Summary">
          <Prose text={summary} />
        </Section>
      ) : null}
      {traits.length > 0 ? (
        <Section title="Traits">
          <TraitMeters traits={traits} />
        </Section>
      ) : null}
      {interests.length > 0 ? (
        <Section title="Interests">
          <div className="insight-chip-row">
            {interests.map((x, i) => (
              <div key={i} className="insight-chip">
                {pickStr(x, "name") ?? pickStr(x, "title") ?? "Interest"}
              </div>
            ))}
          </div>
        </Section>
      ) : null}
      {habits.length > 0 ? (
        <Section title="Habits">
          <BulletList items={habits.map((h) => pickStr(h, "description") ?? pickStr(h, "name") ?? "").filter(Boolean)} />
        </Section>
      ) : null}
    </>
  );
}

function renderGoalKeeper(data: Record<string, unknown>) {
  const img = pickStr(data, "summaryImageUrl");
  const recs = pickStrArray(data, "recommendations");
  const streaks = data.streaks as Record<string, unknown> | undefined;
  const current = streaks && typeof streaks.currentStreak === "number" ? streaks.currentStreak : null;
  const best = streaks && typeof streaks.longestStreak === "number" ? streaks.longestStreak : null;
  return (
    <>
      {img ? <SummaryImage url={img} /> : null}
      <StatGrid
        pairs={[
          ...(current !== null ? [{ label: "Current streak", value: `${current} days` }] : []),
          ...(best !== null ? [{ label: "Best streak", value: `${best} days` }] : []),
        ]}
      />
      {recs.length > 0 ? (
        <Section title="Recommendations">
          <BulletList items={recs} />
        </Section>
      ) : null}
    </>
  );
}

function renderAnomaly(data: Record<string, unknown>) {
  const img = pickStr(data, "summaryImageUrl");
  const anomalies = pickObjArray(data, "anomalies");
  return (
    <>
      {img ? <SummaryImage url={img} /> : null}
      <AnomalyList anomalies={anomalies} />
    </>
  );
}

function renderWorkLife(data: Record<string, unknown>) {
  const img = pickStr(data, "summaryImageUrl");
  const recs = pickStrArray(data, "recommendations");
  const balance = data.balanceScore as Record<string, unknown> | undefined;
  const score =
    balance && typeof balance.overall === "number"
      ? balance.overall
      : balance && typeof balance.score === "number"
        ? balance.score
        : null;
  return (
    <>
      {img ? <SummaryImage url={img} /> : null}
      {score !== null ? (
        <p className="insight-score-line">
          Balance score <strong>{Math.round(score)}</strong>
        </p>
      ) : null}
      {recs.length > 0 ? (
        <Section title="Recommendations">
          <BulletList items={recs} />
        </Section>
      ) : null}
    </>
  );
}

function renderDietFallback(data: Record<string, unknown>) {
  const summary = pickStr(data, "summary") ?? pickStr(data, "overview") ?? pickStr(data, "narrative");
  const img = pickStr(data, "summaryImageUrl") ?? pickStr(data, "previewImageUrl");
  const insights = pickStrArray(data, "insights");
  return (
    <>
      {img ? <SummaryImage url={img} /> : null}
      {summary ? (
        <Section title="Summary">
          <Prose text={summary} />
        </Section>
      ) : null}
      {insights.length > 0 ? (
        <Section title="Notes">
          <BulletList items={insights} />
        </Section>
      ) : null}
    </>
  );
}

function renderGenericFallback(data: Record<string, unknown>) {
  const summary =
    pickStr(data, "summary") ??
    pickStr(data, "weekSummary") ??
    pickStr(data, "overview") ??
    pickStr(data, "narrative");
  const img =
    pickStr(data, "summaryImageUrl") ?? pickStr(data, "summaryImageURL") ?? pickStr(data, "previewImageUrl");
  const bullets = [...pickStrArray(data, "insights"), ...pickStrArray(data, "recommendations")];
  const unique = [...new Set(bullets)];
  return (
    <>
      {img ? <SummaryImage url={img} /> : null}
      {summary ? (
        <Section title="Summary">
          <Prose text={summary} />
        </Section>
      ) : null}
      {unique.length > 0 ? (
        <Section title="Highlights">
          <BulletList items={unique} />
        </Section>
      ) : null}
    </>
  );
}

export function InsightDocumentBody({ categoryId, data }: { categoryId: string; data: Record<string, unknown> }) {
  let inner: ReactNode;
  switch (categoryId) {
    case "lifeHighlights":
      inner = renderLifeHighlights(data);
      break;
    case "workout":
      inner = renderWorkout(data);
      break;
    case "sleepAnalysis":
      inner = renderSleep(data);
      break;
    case "music":
      inner = renderMusic(data);
      break;
    case "hiddenPatterns":
      inner = renderHiddenPatterns(data);
      break;
    case "futureSimulation":
      inner = renderFutureSimulation(data);
      break;
    case "emotionAnalysis":
      inner = renderEmotion(data);
      break;
    case "personality":
      inner = renderPersonality(data);
      break;
    case "goalKeeper":
      inner = renderGoalKeeper(data);
      break;
    case "anomaly":
      inner = renderAnomaly(data);
      break;
    case "workLifeBalance":
      inner = renderWorkLife(data);
      break;
    case "diet":
      inner = renderDietFallback(data);
      break;
    default:
      inner = renderGenericFallback(data);
  }

  return (
    <div className="insight-body">
      <MetaStrip data={data} />
      {inner}
    </div>
  );
}

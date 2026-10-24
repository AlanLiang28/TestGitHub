import { useEffect, useState } from "react";

type Entry = { created_at: string; mood: number; note: string };
type TrendPoint = { day: string; avg_mood: string };

const moodEmoji = ["", "😞", "😕", "😐", "🙂", "😄"];

export default function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [mood, setMood] = useState(3);
  const [note, setNote] = useState("");
  const [insight, setInsight] = useState("");
  const [thinking, setThinking] = useState(false);

  async function loadData() {
    const [e, t] = await Promise.all([
      fetch("/api/entries").then((r) => r.json()),
      fetch("/api/trend").then((r) => r.json()),
    ]);
    setEntries(e);
    setTrend(t);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function save() {
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood, note }),
    });
    setNote("");
    loadData();
  }

  async function getInsights() {
    setThinking(true);
    setInsight("");
    const res = await fetch("/api/insights").then((r) => r.json());
    setInsight(res.insight);
    setThinking(false);
  }

  const card = { background: "#f5f5f5", color: "#111", padding: 16, borderRadius: 8, marginBottom: 20 };

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>Mood Journal</h1>

      {/* New entry */}
      <div style={card}>
        <p>How are you feeling?</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {[1, 2, 3, 4, 5].map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              style={{ fontSize: 28, padding: 6, border: mood === m ? "3px solid #4caf50" : "3px solid transparent" }}
            >
              {moodEmoji[m]}
            </button>
          ))}
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What happened today?"
          rows={3}
          style={{ width: "100%", boxSizing: "border-box", padding: 8 }}
        />
        <button onClick={save} style={{ marginTop: 8 }}>Save entry</button>
      </div>

      {/* Trend from Tiger Data */}
      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Last 14 days</h3>
        {trend.length === 0 && <p>No data yet.</p>}
        {trend.map((t) => (
          <div key={t.day} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ width: 70 }}>{new Date(t.day).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
            <div style={{ height: 14, width: `${(Number(t.avg_mood) / 5) * 100}%`, background: "#4caf50", borderRadius: 4 }} />
            <span>{t.avg_mood}</span>
          </div>
        ))}
      </div>

      {/* Gemini insights */}
      <div style={card}>
        <button onClick={getInsights} disabled={thinking}>
          {thinking ? "Thinking..." : "✨ Get AI insights"}
        </button>
        {insight && <p style={{ whiteSpace: "pre-wrap" }}>{insight}</p>}
      </div>

      {/* Recent entries */}
      <h3>Recent entries</h3>
      {entries.map((e) => (
        <div key={e.created_at} style={{ borderBottom: "1px solid #ddd", padding: "8px 0" }}>
          <span style={{ fontSize: 20 }}>{moodEmoji[e.mood]}</span>{" "}
          <small>{new Date(e.created_at).toLocaleString()}</small>
          <div>{e.note}</div>
        </div>
      ))}
    </div>
  );
}
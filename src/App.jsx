import { useState, useEffect, useRef, useCallback } from "react";

// ── Design tokens ──────────────────────────────────────────────────────────
const COLORS = {
  bg: "#0d0f0e",
  surface: "#151918",
  card: "#1a1f1d",
  border: "#2a3330",
  accent: "#c8f54a",       // neon lime – the ONE unforgettable colour
  accentDim: "#8aad2f",
  teal: "#2dc897",
  coral: "#ff6b47",
  blue: "#4a9eff",
  amber: "#ffb830",
  text: "#f0f5f2",
  textSec: "#7a9990",
  textMut: "#3d5550",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const css = `
  ${FONTS}
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: ${COLORS.bg}; color: ${COLORS.text}; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }
  
  .app { display: flex; flex-direction: column; height: 100dvh; max-width: 430px; margin: 0 auto; overflow: hidden; position: relative; }
  
  /* Header */
  .topbar { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 10px; flex-shrink: 0; }
  .logo { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 2px; color: ${COLORS.accent}; }
  .logo span { color: ${COLORS.textSec}; }
  .level-pill { background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 20px; padding: 5px 12px; font-size: 12px; font-weight: 500; color: ${COLORS.teal}; cursor: pointer; display: flex; align-items: center; gap: 5px; }
  
  /* Screens */
  .screen { flex: 1; overflow-y: auto; padding: 0 16px 16px; }
  
  /* Nav */
  .nav { display: flex; background: ${COLORS.surface}; border-top: 1px solid ${COLORS.border}; flex-shrink: 0; }
  .nav-btn { flex: 1; padding: 10px 4px 14px; display: flex; flex-direction: column; align-items: center; gap: 3px; border: none; background: transparent; cursor: pointer; color: ${COLORS.textMut}; font-size: 10px; font-family: 'DM Sans', sans-serif; transition: color .15s; }
  .nav-btn.active { color: ${COLORS.accent}; }
  .nav-btn svg { width: 22px; height: 22px; stroke-width: 1.8; }

  /* Cards */
  .card { background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 14px; padding: 14px 16px; margin-bottom: 10px; }
  .card-accent { border-color: ${COLORS.accent}33; }

  /* Section label */
  .sec-label { font-size: 10px; font-weight: 600; letter-spacing: .12em; color: ${COLORS.textMut}; text-transform: uppercase; margin: 18px 0 8px; }

  /* Chips */
  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip { padding: 6px 13px; border-radius: 20px; border: 1px solid ${COLORS.border}; font-size: 13px; color: ${COLORS.textSec}; background: transparent; cursor: pointer; transition: all .15s; font-family: 'DM Sans', sans-serif; }
  .chip.on { background: ${COLORS.accent}18; border-color: ${COLORS.accent}; color: ${COLORS.accent}; }
  .chip.coral.on { background: ${COLORS.coral}18; border-color: ${COLORS.coral}; color: ${COLORS.coral}; }
  .chip.blue.on { background: ${COLORS.blue}18; border-color: ${COLORS.blue}; color: ${COLORS.blue}; }
  .chip.amber.on { background: ${COLORS.amber}18; border-color: ${COLORS.amber}; color: ${COLORS.amber}; }

  /* Sliders */
  .slider-wrap { margin: 6px 0 14px; }
  .slider-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .slider-row label { font-size: 13px; color: ${COLORS.textSec}; flex: 1; }
  .slider-row .val { font-size: 13px; font-weight: 600; color: ${COLORS.text}; min-width: 38px; text-align: right; }
  input[type=range] { flex: 1.5; -webkit-appearance: none; height: 3px; border-radius: 2px; background: ${COLORS.border}; outline: none; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: ${COLORS.accent}; cursor: pointer; }

  /* Level selector */
  .level-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .level-card { border: 1px solid ${COLORS.border}; border-radius: 12px; padding: 12px; cursor: pointer; transition: all .15s; background: transparent; text-align: left; font-family: 'DM Sans', sans-serif; }
  .level-card.active { border-color: ${COLORS.accent}; background: ${COLORS.accent}0d; }
  .level-card h4 { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 1px; color: ${COLORS.text}; margin-bottom: 2px; }
  .level-card p { font-size: 11px; color: ${COLORS.textSec}; }

  /* Big generate button */
  .gen-btn { width: 100%; padding: 15px; background: ${COLORS.accent}; border: none; border-radius: 12px; color: ${COLORS.bg}; font-size: 16px; font-weight: 700; font-family: 'Bebas Neue', sans-serif; letter-spacing: 2px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 8px; transition: opacity .15s; }
  .gen-btn:active { opacity: .85; }
  .gen-btn:disabled { opacity: .4; cursor: not-allowed; }

  /* WOD blocks */
  .wod-phase { border-radius: 12px; border: 1px solid ${COLORS.border}; margin-bottom: 10px; overflow: hidden; }
  .wod-phase-head { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: ${COLORS.surface}; }
  .phase-badge { font-size: 10px; font-weight: 700; letter-spacing: .1em; padding: 3px 8px; border-radius: 5px; }
  .phase-badge.warmup { background: ${COLORS.teal}22; color: ${COLORS.teal}; }
  .phase-badge.strength { background: ${COLORS.blue}22; color: ${COLORS.blue}; }
  .phase-badge.wod { background: ${COLORS.coral}22; color: ${COLORS.coral}; }
  .phase-badge.cooldown { background: ${COLORS.textMut}33; color: ${COLORS.textSec}; }
  .wod-phase-head h3 { font-size: 14px; font-weight: 500; color: ${COLORS.text}; flex: 1; }
  .wod-phase-head .dur { font-size: 12px; color: ${COLORS.textSec}; }
  .wod-phase-body { padding: 6px 14px 12px; }
  .ex-row { display: flex; justify-content: space-between; align-items: baseline; padding: 6px 0; border-bottom: 1px solid ${COLORS.border}; }
  .ex-row:last-child { border-bottom: none; }
  .ex-name { font-size: 13px; color: ${COLORS.text}; }
  .ex-detail { font-size: 12px; color: ${COLORS.textSec}; }

  /* WOD banner */
  .wod-banner { border-radius: 12px; padding: 12px 16px; margin-bottom: 10px; border: 1px solid ${COLORS.coral}44; background: ${COLORS.coral}0d; }
  .wod-banner-type { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 2px; color: ${COLORS.coral}; }
  .wod-banner-sub { font-size: 12px; color: ${COLORS.textSec}; margin-top: 2px; }

  /* Action buttons */
  .btn-row { display: flex; gap: 8px; margin-top: 12px; }
  .btn { flex: 1; padding: 11px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; font-family: 'DM Sans', sans-serif; transition: opacity .15s; }
  .btn:active { opacity: .8; }
  .btn-outline { background: transparent; border: 1px solid ${COLORS.border}; color: ${COLORS.text}; }
  .btn-green { background: ${COLORS.teal}; border: none; color: ${COLORS.bg}; font-weight: 700; }
  .btn-accent { background: ${COLORS.accent}; border: none; color: ${COLORS.bg}; font-weight: 700; }
  .btn-danger { background: transparent; border: 1px solid ${COLORS.coral}66; color: ${COLORS.coral}; }

  /* Stats grid */
  .stats-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; margin-bottom: 10px; }
  .stat-card { background: ${COLORS.surface}; border-radius: 10px; padding: 12px; }
  .stat-card .lbl { font-size: 11px; color: ${COLORS.textSec}; margin-bottom: 4px; }
  .stat-card .num { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 1px; color: ${COLORS.accent}; }
  .stat-card .unit { font-size: 12px; color: ${COLORS.textSec}; margin-left: 3px; }

  /* Timer */
  .timer-wrap { text-align: center; padding: 24px 16px 8px; }
  .timer-ring { position: relative; display: inline-flex; align-items: center; justify-content: center; }
  .timer-display { font-family: 'Bebas Neue', sans-serif; font-size: 72px; letter-spacing: 4px; color: ${COLORS.text}; line-height: 1; }
  .timer-sub { font-size: 13px; color: ${COLORS.textSec}; margin-top: 6px; }
  .timer-controls { display: flex; justify-content: center; gap: 12px; margin-top: 16px; }
  .timer-btn { width: 52px; height: 52px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 22px; transition: opacity .15s; }
  .timer-btn:active { opacity: .8; }
  .timer-btn.play { background: ${COLORS.accent}; color: ${COLORS.bg}; }
  .timer-btn.reset { background: ${COLORS.card}; border: 1px solid ${COLORS.border}; color: ${COLORS.textSec}; }
  .timer-btn.stop { background: ${COLORS.coral}22; border: 1px solid ${COLORS.coral}44; color: ${COLORS.coral}; }
  .round-display { font-family: 'Bebas Neue', sans-serif; font-size: 16px; letter-spacing: 2px; color: ${COLORS.textSec}; text-align: center; margin-top: 8px; }
  .round-display span { color: ${COLORS.accent}; }

  /* History */
  .hist-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid ${COLORS.border}; cursor: pointer; }
  .hist-item:last-child { border-bottom: none; }
  .hist-dot { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: 'Bebas Neue', sans-serif; font-size: 14px; letter-spacing: 1px; flex-shrink: 0; }
  .hist-info { flex: 1; min-width: 0; }
  .hist-title { font-size: 14px; font-weight: 500; color: ${COLORS.text}; }
  .hist-meta { font-size: 12px; color: ${COLORS.textSec}; margin-top: 2px; }
  .hist-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
  .tag { font-size: 10px; padding: 2px 6px; border-radius: 4px; border: 1px solid ${COLORS.border}; color: ${COLORS.textSec}; }
  .score-badge { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 1px; color: ${COLORS.accent}; }

  /* Profile / 1RM */
  .rm-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 8px; }
  .rm-item { background: ${COLORS.surface}; border-radius: 10px; padding: 10px 12px; border: 1px solid ${COLORS.border}; }
  .rm-item label { font-size: 11px; color: ${COLORS.textSec}; display: block; margin-bottom: 5px; }
  .rm-item input { width: 100%; background: transparent; border: none; outline: none; font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1px; color: ${COLORS.text}; }
  .rm-item .unit { font-size: 11px; color: ${COLORS.textMut}; }

  /* Loading */
  .loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 24px; gap: 20px; }
  .spinner { width: 36px; height: 36px; border: 3px solid ${COLORS.border}; border-top-color: ${COLORS.accent}; border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading p { font-size: 14px; color: ${COLORS.textSec}; text-align: center; }
  .loading-steps { font-size: 12px; color: ${COLORS.textMut}; }

  /* Score input */
  .score-input-wrap { background: ${COLORS.surface}; border: 1px solid ${COLORS.accent}33; border-radius: 12px; padding: 16px; margin-top: 12px; }
  .score-input-wrap h4 { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 1px; color: ${COLORS.accent}; margin-bottom: 10px; }
  .score-input-wrap input { width: 100%; background: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 8px; padding: 10px 12px; font-size: 14px; color: ${COLORS.text}; outline: none; font-family: 'DM Sans', sans-serif; }
  .score-input-wrap input:focus { border-color: ${COLORS.accent}; }

  /* Empty state */
  .empty { text-align: center; padding: 60px 24px; color: ${COLORS.textSec}; }
  .empty svg { opacity: .3; margin-bottom: 16px; }
  .empty p { font-size: 14px; }

  /* Modal overlay */
  .modal-overlay { position: absolute; inset: 0; background: ${COLORS.bg}cc; display: flex; align-items: flex-end; z-index: 100; }
  .modal-sheet { background: ${COLORS.surface}; border-top: 1px solid ${COLORS.border}; border-radius: 20px 20px 0 0; padding: 20px 16px 32px; width: 100%; max-height: 85dvh; overflow-y: auto; }
  .modal-handle { width: 36px; height: 4px; background: ${COLORS.border}; border-radius: 2px; margin: 0 auto 16px; }
  .modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 2px; color: ${COLORS.text}; margin-bottom: 16px; }

  /* Notification toast */
  .toast { position: absolute; top: 70px; left: 50%; transform: translateX(-50%); background: ${COLORS.teal}; color: ${COLORS.bg}; font-size: 13px; font-weight: 600; padding: 8px 18px; border-radius: 20px; white-space: nowrap; z-index: 200; animation: fadeInOut 2.5s forwards; }
  @keyframes fadeInOut { 0%{opacity:0;transform:translateX(-50%) translateY(-8px)} 15%{opacity:1;transform:translateX(-50%) translateY(0)} 75%{opacity:1} 100%{opacity:0} }
`;

// ── Helpers ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "wod_history_v2";
const RM_KEY = "wod_1rm_v1";
const PREFS_KEY = "wod_prefs_v1";

const loadJSON = (key, def) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } };
const saveJSON = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

const fmtDate = (iso) => { const d = new Date(iso); return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }); };
const fmtTime = (s) => { const m = Math.floor(s / 60); const ss = s % 60; return `${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`; };

const LEVEL_DEFS = {
  beginner:     { label: "Beginner",     desc: "Débutant, formes à apprendre",    factor: 0.5  },
  intermediate: { label: "Intermediate", desc: "1–2 ans de CrossFit",              factor: 0.75 },
  rx:           { label: "RX",           desc: "Rx complet, bonne technique",      factor: 1.0  },
  elite:        { label: "Elite",        desc: "Compétition, full charge",         factor: 1.25 },
};

const MUSCLE_GROUPS = ["Tout le corps", "Haut du corps", "Bas du corps", "Core / Abs", "Postérieure", "Épaules / Bras"];
const WOD_TYPES = ["AMRAP", "EMOM", "For Time", "Tabata", "Chipper"];
const PHASE_COLORS = { warmup: COLORS.teal, strength: COLORS.blue, wod: COLORS.coral, cooldown: COLORS.textSec };

// ── API Call ───────────────────────────────────────────────────────────────
async function generateWODFromAI({ level, muscles, wodType, forceRatio, cardioRatio, duration, oneRMs }) {
  const rmText = Object.entries(oneRMs).filter(([,v]) => v > 0).map(([k,v]) => `${k}: ${v}kg`).join(", ");
  const prompt = `Tu es un coach CrossFit expert. Génère un entraînement complet structuré en JSON strict (pas de markdown, pas de texte avant/après).

Paramètres:
- Niveau: ${LEVEL_DEFS[level].label}
- Durée totale: ${duration} min
- Focus musculaire: ${muscles.join(", ")}
- Type de WOD: ${wodType}
- Intensité force: ${forceRatio}% | Intensité cardio: ${cardioRatio}%
- 1RM disponibles: ${rmText || "non renseignés, utiliser des % génériques"}

Format JSON attendu:
{
  "title": "Nom accrocheur du WOD (max 4 mots)",
  "warmup": {
    "duration": 10,
    "exercises": [
      {"name": "Nom exercice", "detail": "durée ou reps"}
    ]
  },
  "strength": {
    "duration": 20,
    "focus": "Description focus force",
    "exercises": [
      {"name": "Nom exercice", "sets": "5", "reps": "5", "load": "75% 1RM squat ou 60kg selon niveau"}
    ]
  },
  "wod": {
    "type": "${wodType}",
    "duration": 20,
    "format": "Description format (ex: AMRAP 20 min / EMOM 15 min x 3 mouvements)",
    "rx_load": "charges RX",
    "scaled_load": "charges adaptées niveau",
    "exercises": [
      {"name": "Nom exercice", "reps": "10", "load": "charge ou bodyweight"}
    ]
  },
  "cooldown": {
    "duration": 5,
    "exercises": [
      {"name": "Etirement", "detail": "durée"}
    ]
  },
  "coaching_tip": "1 conseil technique clé pour ce WOD"
}

Adapte TOUTES les charges au niveau ${LEVEL_DEFS[level].label}. Partie force en % du 1RM. WOD en charges absolues adaptées au niveau. Sois créatif et varié.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const text = data.content?.find(b => b.type === "text")?.text || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ── Icons ──────────────────────────────────────────────────────────────────
const IconBolt = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconBarbell = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 5v14M18 5v14M2 9h4M18 9h4M2 15h4M18 15h4M6 9h12v6H6z" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconHistory = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3M3.05 11a9 9 0 1 0 .5-3M3 4v4h4" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconUser = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/></svg>;
const IconTimer = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 3h6M12 3v2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const IconPlay = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
const IconPause = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6zm8-14v14h4V5z"/></svg>;
const IconReset = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 4v6h6M3.51 15a9 9 0 1 0 .49-5.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("generate");
  const [level, setLevel] = useState(() => loadJSON(PREFS_KEY, {}).level || "rx");
  const [muscles, setMuscles] = useState(() => loadJSON(PREFS_KEY, {}).muscles || ["Tout le corps"]);
  const [wodType, setWodType] = useState(() => loadJSON(PREFS_KEY, {}).wodType || "AMRAP");
  const [forceRatio, setForceRatio] = useState(() => loadJSON(PREFS_KEY, {}).forceRatio ?? 50);
  const [cardioRatio, setCardioRatio] = useState(() => loadJSON(PREFS_KEY, {}).cardioRatio ?? 50);
  const [duration, setDuration] = useState(() => loadJSON(PREFS_KEY, {}).duration ?? 60);
  const [oneRMs, setOneRMs] = useState(() => loadJSON(RM_KEY, { "Back Squat": 0, "Deadlift": 0, "Clean": 0, "Snatch": 0, "Press": 0, "Bench Press": 0, "Front Squat": 0, "Push Jerk": 0 }));
  const [history, setHistory] = useState(() => loadJSON(STORAGE_KEY, []));
  const [currentWOD, setCurrentWOD] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [scoreInput, setScoreInput] = useState("");
  const [toast, setToast] = useState(null);
  const [timerSecs, setTimerSecs] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerRounds, setTimerRounds] = useState(0);
  const timerRef = useRef(null);

  // Save prefs
  useEffect(() => { saveJSON(PREFS_KEY, { level, muscles, wodType, forceRatio, cardioRatio, duration }); }, [level, muscles, wodType, forceRatio, cardioRatio, duration]);
  useEffect(() => { saveJSON(RM_KEY, oneRMs); }, [oneRMs]);
  useEffect(() => { saveJSON(STORAGE_KEY, history); }, [history]);

  // Timer
  useEffect(() => {
    if (timerRunning) { timerRef.current = setInterval(() => setTimerSecs(s => s + 1), 1000); }
    else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  const toggleMuscle = (m) => setMuscles(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const handleGenerate = async () => {
    setLoading(true);
    setCurrentWOD(null);
    const msgs = ["Analyse de tes paramètres...", "Sélection des exercices...", "Calcul des charges...", "Finalisation du WOD..."];
    let i = 0;
    setLoadingMsg(msgs[0]);
    const iv = setInterval(() => { i = (i + 1) % msgs.length; setLoadingMsg(msgs[i]); }, 1400);
    try {
      const wod = await generateWODFromAI({ level, muscles, wodType, forceRatio, cardioRatio, duration, oneRMs });
      wod._id = Date.now();
      wod._date = new Date().toISOString();
      wod._level = level;
      wod._muscles = muscles;
      wod._forceRatio = forceRatio;
      wod._cardioRatio = cardioRatio;
      wod._score = "";
      setCurrentWOD(wod);
      setScoreInput("");
      setTab("wod");
    } catch (e) {
      showToast("Erreur API — réessaie");
    } finally {
      clearInterval(iv);
      setLoading(false);
    }
  };

  const saveWOD = () => {
    if (!currentWOD) return;
    const wod = { ...currentWOD, _score: scoreInput };
    setHistory(h => [wod, ...h.filter(x => x._id !== wod._id)]);
    showToast("WOD sauvegardé ✓");
  };

  const deleteFromHistory = (id) => setHistory(h => h.filter(x => x._id !== id));

  const replayWOD = (wod) => { setCurrentWOD({ ...wod, _id: Date.now(), _date: new Date().toISOString(), _score: "" }); setScoreInput(""); setTab("wod"); };

  // ── Screens ──────────────────────────────────────────────────────────────
  const GenerateScreen = () => (
    <div className="screen">
      <p className="sec-label">Niveau</p>
      <div className="level-grid">
        {Object.entries(LEVEL_DEFS).map(([k, v]) => (
          <button key={k} className={`level-card ${level === k ? "active" : ""}`} onClick={() => setLevel(k)}>
            <h4>{v.label}</h4>
            <p>{v.desc}</p>
          </button>
        ))}
      </div>

      <p className="sec-label">Focus musculaire</p>
      <div className="chips">
        {MUSCLE_GROUPS.map(m => (
          <button key={m} className={`chip ${muscles.includes(m) ? "on" : ""}`} onClick={() => toggleMuscle(m)}>{m}</button>
        ))}
      </div>

      <p className="sec-label">Type de WOD</p>
      <div className="chips">
        {WOD_TYPES.map(t => (
          <button key={t} className={`chip coral ${wodType === t ? "on" : ""}`} onClick={() => setWodType(t)}>{t}</button>
        ))}
      </div>

      <p className="sec-label">Paramètres</p>
      <div className="card">
        <div className="slider-row">
          <label>Force</label>
          <input type="range" min={0} max={100} step={10} value={forceRatio} onChange={e => setForceRatio(+e.target.value)} />
          <span className="val">{forceRatio}%</span>
        </div>
        <div className="slider-row">
          <label>Cardio</label>
          <input type="range" min={0} max={100} step={10} value={cardioRatio} onChange={e => setCardioRatio(+e.target.value)} />
          <span className="val">{cardioRatio}%</span>
        </div>
        <div className="slider-row">
          <label>Durée</label>
          <input type="range" min={30} max={90} step={15} value={duration} onChange={e => setDuration(+e.target.value)} />
          <span className="val">{duration} min</span>
        </div>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
          <p>{loadingMsg}</p>
        </div>
      ) : (
        <button className="gen-btn" onClick={handleGenerate} disabled={muscles.length === 0}>
          ⚡ GÉNÉRER MON WOD
        </button>
      )}
    </div>
  );

  const WODScreen = () => {
    if (!currentWOD) return (
      <div className="screen">
        <div className="empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={COLORS.textSec} strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round"/></svg>
          <p>Génère ton premier WOD<br/>depuis l'onglet ⚡</p>
        </div>
      </div>
    );
    const w = currentWOD;
    return (
      <div className="screen">
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "10px 0 4px" }}>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: 28, letterSpacing: 2, color: COLORS.text }}>{w.title}</span>
          <span style={{ fontSize: 12, color: COLORS.textSec }}>{LEVEL_DEFS[w._level]?.label}</span>
        </div>
        <div style={{ fontSize: 12, color: COLORS.textSec, marginBottom: 12 }}>
          {fmtDate(w._date)} · {duration} min · {(w._muscles || []).join(", ")}
        </div>

        <div className="stats-grid">
          <div className="stat-card"><div className="lbl">Force</div><div><span className="num">{w._forceRatio}</span><span className="unit">%</span></div></div>
          <div className="stat-card"><div className="lbl">Cardio</div><div><span className="num">{w._cardioRatio}</span><span className="unit">%</span></div></div>
        </div>

        {/* Warmup */}
        <div className="wod-phase">
          <div className="wod-phase-head">
            <span className="phase-badge warmup">WARM-UP</span>
            <h3>Échauffement</h3>
            <span className="dur">{w.warmup?.duration} min</span>
          </div>
          <div className="wod-phase-body">
            {w.warmup?.exercises?.map((e, i) => (
              <div key={i} className="ex-row"><span className="ex-name">{e.name}</span><span className="ex-detail">{e.detail}</span></div>
            ))}
          </div>
        </div>

        {/* Strength */}
        <div className="wod-phase">
          <div className="wod-phase-head">
            <span className="phase-badge strength">FORCE</span>
            <h3>{w.strength?.focus || "Partie force"}</h3>
            <span className="dur">{w.strength?.duration} min</span>
          </div>
          <div className="wod-phase-body">
            {w.strength?.exercises?.map((e, i) => (
              <div key={i} className="ex-row">
                <span className="ex-name">{e.name}</span>
                <span className="ex-detail">{e.sets}×{e.reps} · {e.load}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WOD */}
        <div className="wod-banner">
          <div className="wod-banner-type">{w.wod?.format || w.wod?.type}</div>
          <div className="wod-banner-sub">RX: {w.wod?.rx_load} · Scaled: {w.wod?.scaled_load}</div>
        </div>
        <div className="wod-phase">
          <div className="wod-phase-head">
            <span className="phase-badge wod">WOD</span>
            <h3>{w.wod?.type}</h3>
            <span className="dur">{w.wod?.duration} min</span>
          </div>
          <div className="wod-phase-body">
            {w.wod?.exercises?.map((e, i) => (
              <div key={i} className="ex-row">
                <span className="ex-name">{e.name}</span>
                <span className="ex-detail">{e.reps}{e.load && e.load !== "bodyweight" ? ` · ${e.load}` : ""}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cooldown */}
        <div className="wod-phase">
          <div className="wod-phase-head">
            <span className="phase-badge cooldown">COOL-DOWN</span>
            <h3>Récupération</h3>
            <span className="dur">{w.cooldown?.duration} min</span>
          </div>
          <div className="wod-phase-body">
            {w.cooldown?.exercises?.map((e, i) => (
              <div key={i} className="ex-row"><span className="ex-name">{e.name}</span><span className="ex-detail">{e.detail}</span></div>
            ))}
          </div>
        </div>

        {/* Coaching tip */}
        {w.coaching_tip && (
          <div className="card card-accent" style={{ marginTop: 4 }}>
            <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 600, letterSpacing: ".1em", marginBottom: 6 }}>COACH TIP</div>
            <div style={{ fontSize: 13, color: COLORS.textSec, lineHeight: 1.6 }}>{w.coaching_tip}</div>
          </div>
        )}

        {/* Score */}
        <div className="score-input-wrap">
          <h4>Ton score</h4>
          <input placeholder="Ex: 8 rounds + 14 reps / 23:47 / 185kg..." value={scoreInput} onChange={e => setScoreInput(e.target.value)} />
        </div>

        <div className="btn-row">
          <button className="btn btn-outline" onClick={() => setShowTimer(true)}>⏱ Timer</button>
          <button className="btn btn-outline" onClick={() => { setTab("generate"); }}>🔄 Regénérer</button>
          <button className="btn btn-green" onClick={saveWOD}>💾 Sauver</button>
        </div>
      </div>
    );
  };

  const TimerScreen = () => {
    const wodDuration = currentWOD?.wod?.duration || 20;
    const totalSecs = wodDuration * 60;
    const remaining = Math.max(0, totalSecs - timerSecs);
    const pct = Math.min(1, timerSecs / totalSecs);
    const r = 80, circ = 2 * Math.PI * r;

    return (
      <div className="screen">
        <p className="sec-label">Timer WOD</p>
        <div className="timer-wrap">
          <div className="timer-ring">
            <svg width={196} height={196} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
              <circle cx={98} cy={98} r={r} fill="none" stroke={COLORS.border} strokeWidth={6} />
              <circle cx={98} cy={98} r={r} fill="none" stroke={COLORS.accent} strokeWidth={6}
                strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset .5s" }} />
            </svg>
            <div style={{ width: 196, height: 196, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="timer-display">{fmtTime(remaining)}</div>
              <div className="timer-sub">{fmtTime(timerSecs)} écoulé</div>
            </div>
          </div>
          <div className="round-display">ROUND <span>{timerRounds + 1}</span></div>
          <div className="timer-controls">
            <button className="timer-btn reset" onClick={() => { setTimerSecs(0); setTimerRunning(false); setTimerRounds(0); }}><IconReset /></button>
            <button className="timer-btn play" onClick={() => setTimerRunning(r => !r)}>
              {timerRunning ? <IconPause /> : <IconPlay />}
            </button>
            <button className="timer-btn stop" onClick={() => { setTimerRounds(r => r + 1); showToast(`Round ${timerRounds + 1} terminé!`); }}>+1</button>
          </div>
        </div>

        <p className="sec-label">Exercices du WOD</p>
        {currentWOD?.wod?.exercises?.map((e, i) => (
          <div key={i} className="ex-row" style={{ padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
            <span className="ex-name">{e.name}</span>
            <span className="ex-detail">{e.reps}{e.load && e.load !== "bodyweight" ? ` · ${e.load}` : ""}</span>
          </div>
        ))}
      </div>
    );
  };

  const HistoryScreen = () => (
    <div className="screen">
      {history.length === 0 ? (
        <div className="empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={COLORS.textSec} strokeWidth="1.5"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 3h6M12 3v2" strokeLinecap="round"/></svg>
          <p>Aucun WOD sauvegardé<br/>pour l'instant</p>
        </div>
      ) : (
        <div className="card" style={{ marginTop: 10 }}>
          {history.map(wod => (
            <div key={wod._id} className="hist-item">
              <div className="hist-dot" style={{ background: COLORS.coral + "22", color: COLORS.coral }}>{wod.wod?.type?.slice(0,2) || "WD"}</div>
              <div className="hist-info" onClick={() => replayWOD(wod)}>
                <div className="hist-title">{wod.title} · {wod.wod?.type}</div>
                <div className="hist-meta">{fmtDate(wod._date)} · {LEVEL_DEFS[wod._level]?.label}</div>
                <div className="hist-tags">
                  {(wod._muscles || []).slice(0,2).map(m => <span key={m} className="tag">{m}</span>)}
                  {wod._score && <span className="tag" style={{ color: COLORS.accent, borderColor: COLORS.accent + "44" }}>{wod._score}</span>}
                </div>
              </div>
              <button style={{ background: "transparent", border: "none", color: COLORS.textMut, cursor: "pointer", padding: 4 }} onClick={() => deleteFromHistory(wod._id)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ProfileScreen = () => (
    <div className="screen">
      <p className="sec-label">Mes 1RM (kg)</p>
      <div className="rm-grid">
        {Object.entries(oneRMs).map(([k, v]) => (
          <div key={k} className="rm-item">
            <label>{k}</label>
            <input type="number" value={v || ""} placeholder="0" onChange={e => setOneRMs(r => ({ ...r, [k]: +e.target.value }))} />
            <span className="unit">kg</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        <button className="btn btn-outline" style={{ width: "100%" }} onClick={() => { saveJSON(RM_KEY, oneRMs); showToast("1RM sauvegardés ✓"); }}>
          💾 Sauvegarder les 1RM
        </button>
      </div>

      <p className="sec-label" style={{ marginTop: 24 }}>Niveau par défaut</p>
      <div className="level-grid">
        {Object.entries(LEVEL_DEFS).map(([k, v]) => (
          <button key={k} className={`level-card ${level === k ? "active" : ""}`} onClick={() => setLevel(k)}>
            <h4>{v.label}</h4>
            <p>{v.desc}</p>
          </button>
        ))}
      </div>

      <p className="sec-label" style={{ marginTop: 24 }}>Statistiques</p>
      <div className="stats-grid">
        <div className="stat-card"><div className="lbl">WODs sauvegardés</div><div><span className="num">{history.length}</span></div></div>
        <div className="stat-card"><div className="lbl">Dernier niveau</div><div style={{ fontSize: 14, fontWeight: 500, color: COLORS.teal, marginTop: 4 }}>{LEVEL_DEFS[level]?.label}</div></div>
      </div>
    </div>
  );

  const tabs = [
    { id: "generate", label: "Générer", icon: <IconBolt /> },
    { id: "wod",      label: "Mon WOD", icon: <IconBarbell /> },
    { id: "timer",    label: "Timer",   icon: <IconTimer /> },
    { id: "history",  label: "Historique", icon: <IconHistory /> },
    { id: "profile",  label: "Profil",  icon: <IconUser /> },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {toast && <div className="toast">{toast}</div>}

        <div className="topbar">
          <div className="logo">WOD<span>GEN</span></div>
          <button className="level-pill" onClick={() => setShowLevelModal(true)}>
            ⚡ {LEVEL_DEFS[level]?.label}
          </button>
        </div>

        {tab === "generate" && <GenerateScreen />}
        {tab === "wod"      && <WODScreen />}
        {tab === "timer"    && <TimerScreen />}
        {tab === "history"  && <HistoryScreen />}
        {tab === "profile"  && <ProfileScreen />}

        <nav className="nav">
          {tabs.map(t => (
            <button key={t.id} className={`nav-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        {showLevelModal && (
          <div className="modal-overlay" onClick={() => setShowLevelModal(false)}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()}>
              <div className="modal-handle" />
              <div className="modal-title">CHOISIR SON NIVEAU</div>
              <div className="level-grid">
                {Object.entries(LEVEL_DEFS).map(([k, v]) => (
                  <button key={k} className={`level-card ${level === k ? "active" : ""}`} onClick={() => { setLevel(k); setShowLevelModal(false); }}>
                    <h4>{v.label}</h4>
                    <p>{v.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

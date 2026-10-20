// Each category has one fixed colour and icon, so the donut, chips and rows agree.
export const CATEGORY_STYLE = {
    Food: { color: "#c8f135", icon: "🍔" },
    Transport: { color: "#ff775f", icon: "🚕" },
    Shopping: { color: "#111111", icon: "🛍" },
    Bills: { color: "#ffd23f", icon: "🧾" },
    Entertainment: { color: "#8fb8ff", icon: "🎬" },
    Health: { color: "#c9a7ff", icon: "💊" },
    Other: { color: "#bdb8ac", icon: "📦" },
  };
  
  export const DEFAULT_CATEGORIES = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Other",
  ];
  
  const FALLBACK_COLORS = ["#c8f135", "#ff775f", "#ffd23f", "#8fb8ff", "#c9a7ff", "#bdb8ac"];
  
  export function colorFor(name = "") {
    if (CATEGORY_STYLE[name]) return CATEGORY_STYLE[name].color;
    // Custom categories get a stable colour from their name.
    let hash = 0;
    for (const char of String(name)) {
      hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
    }
    return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
  }
  
  export function iconFor(name = "") {
    return CATEGORY_STYLE[name]?.icon ?? "🧾";
  }
  
  // The API may return "2026-10-14" or a full ISO timestamp. Keep only the day.
  export function parseExpenseDate(value) {
    return new Date(`${String(value).slice(0, 10)}T00:00:00`);
  }
  
  // "Oct 4" (the stylesheet uppercases it).
  export function formatDayMonth(value) {
    const date = parseExpenseDate(value);
    return `${date.toLocaleDateString("en-US", { month: "short" })} ${date.getDate()}`;
  }
  
  // Local date as YYYY-MM-DD (en-CA gives this format), for <input type="date">.
  export function todayISO() {
    return new Date().toLocaleDateString("en-CA");
  }
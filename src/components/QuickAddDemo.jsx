import { useEffect, useState } from "react";
import { formatDayMonth } from "../lib/expense";
import { formatRupees } from "../lib/format";
import { parseQuickAdd } from "../lib/quickAdd";

const SAMPLES = [
  "Coffee 180 food today",
  "Uber 240 yesterday",
  "Electricity bill 1850 on monday",
  "Movie tickets 640 entertainment",
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// A live demo of quick add. Sample lines type themselves out until the visitor
// clicks in and types their own. Nothing is saved anywhere.
export default function QuickAddDemo({ onChange }) {
  const [reduced] = useState(prefersReducedMotion);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [shown, setShown] = useState(() => (reduced ? SAMPLES[0] : ""));
  const [touched, setTouched] = useState(false);
  const [text, setText] = useState("");

  // Type out the current sample, hold it, then move to the next one.
  useEffect(() => {
    if (touched || reduced) return undefined;
    const full = SAMPLES[sampleIndex];
    if (shown.length < full.length) {
      const timer = setTimeout(() => setShown(full.slice(0, shown.length + 1)), 55);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setShown("");
      setSampleIndex((index) => (index + 1) % SAMPLES.length);
    }, 2200);
    return () => clearTimeout(timer);
  }, [shown, sampleIndex, touched, reduced]);

  const value = touched ? text : shown;
  const parsed = parseQuickAdd(value);

  useEffect(() => {
    onChange?.(parsed, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleFocus = () => {
    if (!touched) {
      setText(shown);
      setTouched(true);
    }
  };

  const handleChange = (event) => {
    setText(event.target.value);
    setTouched(true);
  };

  const restart = () => {
    setTouched(false);
    setText("");
    setSampleIndex(0);
    setShown(reduced ? SAMPLES[0] : "");
  };

  return (
    <div className="lp-demo">
      <p className="lp-demo-label" id="lp-demo-label">Try quick add</p>
      <div className="lp-demo-field">
        <input
          type="text"
          aria-labelledby="lp-demo-label"
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Type an expense, like coffee 180"
          maxLength={80}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="lp-demo-chips" aria-live="polite">
        {parsed.ok ? (
          <>
            <span className="lp-chip">{parsed.title}</span>
            <span className="lp-chip lp-chip-amount">{formatRupees(parsed.amount)}</span>
            <span className="lp-chip lp-chip-category">{parsed.category}</span>
            <span className="lp-chip">{formatDayMonth(parsed.date)}</span>
          </>
        ) : (
          <span className="lp-demo-hint">Add an amount, like “lunch 250”.</span>
        )}
      </div>

      <div className="lp-demo-foot">
        <p className="lp-demo-note">Demo only. Nothing you type here is saved.</p>
        {touched && (
          <button type="button" className="lp-demo-reset" onClick={restart}>
            Show examples
          </button>
        )}
      </div>
    </div>
  );
}
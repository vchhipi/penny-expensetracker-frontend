// import { useEffect, useRef, useState } from "react";
// import { api } from "../api/client";
// import { DEFAULT_CATEGORIES, todayISO } from "../lib/expense";

// const EMPTY_FORM = {
//   title: "",
//   amount: "",
//   category: DEFAULT_CATEGORIES[0],
//   date: todayISO(),
// };

// export default function AddExpenseModal({ open, onClose, onSaved }) {
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [error, setError] = useState("");
//   const [busy, setBusy] = useState(false);
//   const titleInput = useRef(null);

//   // Start fresh every time the dialog opens, and focus the first field.
//   useEffect(() => {
//     if (!open) return;
//     setForm({ ...EMPTY_FORM, date: todayISO() });
//     setError("");
//     titleInput.current?.focus();
//   }, [open]);

//   // Escape closes the dialog.
//   useEffect(() => {
//     if (!open) return undefined;
//     const onKey = (event) => {
//       if (event.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [open, onClose]);

//   if (!open) return null;

//   const update = (field) => (event) =>
//     setForm((current) => ({ ...current, [field]: event.target.value }));

//   const submit = async (event) => {
//     event.preventDefault();

//     const amount = Number(form.amount);

//     if (!form.title.trim()) {
//       setError("Give it a short name, like “Lunch”.");
//       return;
//     }

//     if (!(amount > 0)) {
//       setError("Enter an amount greater than zero.");
//       return;
//     }

//     setBusy(true);
//     setError("");

//     try {
//       await api.post("/expenses", {
//         title: form.title.trim(),
//         amount,
//         category: form.category,
//         expense_date: form.date,
//       });
//       onSaved();
//     } catch (err) {
//       setError(err.response?.data?.message || "Could not save. Please try again.");
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <div
//       className="ex-modal-backdrop"
//       onMouseDown={(event) => {
//         if (event.target === event.currentTarget) onClose();
//       }}
//     >
//       <div
//         className="ex-modal"
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="ex-modal-title"
//       >
//         <div className="ex-modal-head">
//           <h2 id="ex-modal-title">Add an expense</h2>
//           <button
//             type="button"
//             className="ex-icon-btn"
//             onClick={onClose}
//             aria-label="Close"
//           >
//             ×
//           </button>
//         </div>

//         <form className="ex-form" onSubmit={submit} noValidate>
//           <label className="ex-field">
//             <span>What was it?</span>
//             <input
//               ref={titleInput}
//               value={form.title}
//               maxLength={100}
//               placeholder="e.g. Lunch with Riya"
//               autoComplete="off"
//               onChange={update("title")}
//             />
//           </label>

//           <div className="ex-form-row">
//             <label className="ex-field">
//               <span>Amount (₹)</span>
//               <input
//                 type="number"
//                 inputMode="decimal"
//                 min="0"
//                 step="0.01"
//                 placeholder="0"
//                 value={form.amount}
//                 onChange={update("amount")}
//               />
//             </label>

//             <label className="ex-field">
//               <span>Date</span>
//               <input
//                 type="date"
//                 max={todayISO()}
//                 value={form.date}
//                 onChange={update("date")}
//               />
//             </label>
//           </div>

//           <fieldset className="ex-field ex-chips">
//             <legend>Category</legend>
//             <div className="ex-chip-group">
//               {DEFAULT_CATEGORIES.map((category) => (
//                 <button
//                   key={category}
//                   type="button"
//                   aria-pressed={form.category === category}
//                   className={form.category === category ? "is-picked" : ""}
//                   onClick={() =>
//                     setForm((current) => ({ ...current, category }))
//                   }
//                 >
//                   {category}
//                 </button>
//               ))}
//             </div>
//           </fieldset>

//           {error && (
//             <p className="ex-error" role="alert">
//               {error}
//             </p>
//           )}

//           <div className="ex-modal-actions">
//             <button type="button" className="ex-ghost" onClick={onClose}>
//               Cancel
//             </button>
//             <button type="submit" className="ex-primary" disabled={busy}>
//               {busy ? "Saving…" : "Save expense"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }




import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";
import { DEFAULT_CATEGORIES, todayISO } from "../lib/expense";

const EMPTY_FORM = {
  title: "",
  amount: "",
  category: DEFAULT_CATEGORIES[0],
  date: todayISO(),
};

function matchCategory(aiCategory) {
  if (!aiCategory) return DEFAULT_CATEGORIES[0];

  const value = aiCategory.toLowerCase();

  const aliases = {
    "food & dining": "Food",
    food: "Food",
    groceries: "Food",
    "travel & transport": "Transport",
    transportation: "Transport",
    transport: "Transport",
    shopping: "Shopping",
    bills: "Bills",
    utilities: "Bills",
    entertainment: "Entertainment",
    health: "Health",
    healthcare: "Health",
    other: "Other",
  };

  const match = aliases[value];

  if (match && DEFAULT_CATEGORIES.includes(match)) {
    return match;
  }

  return (
    DEFAULT_CATEGORIES.find(
      (category) => category.toLowerCase() === value
    ) || "Other"
  );
}

export default function AddExpenseModal({ open, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [quickText, setQuickText] = useState("");
  const [parsing, setParsing] = useState(false);
  const titleInput = useRef(null);

  useEffect(() => {
    if (!open) return;

    setForm({ ...EMPTY_FORM, date: todayISO() });
    setError("");
    setQuickText("");
    setParsing(false);
    titleInput.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape" && !busy && !parsing) {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, busy, parsing]);

  if (!open) return null;

  const update = (field) => (event) =>
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));

  const parseWithAI = async () => {
    const text = quickText.trim();

    if (!text) {
      setError("Describe your expense first.");
      return;
    }

    setParsing(true);
    setError("");

    try {
      const { data } = await api.post("/expenses/parse", { text });
      const expense = data.expense;

      setForm((current) => ({
        ...current,
        title: expense.title || current.title,
        amount:
          expense.amount != null
            ? String(expense.amount)
            : current.amount,
        category: matchCategory(expense.category),
        date: expense.expense_date || current.date,
      }));

      if (expense.missing_fields?.length) {
        setError(
          `AI filled what it could. Please complete: ${expense.missing_fields.join(", ")}.`
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't parse that expense. You can enter the details manually."
      );
    } finally {
      setParsing(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();

    const amount = Number(form.amount);

    if (!form.title.trim()) {
      setError("Give it a short name, like “Lunch”.");
      return;
    }

    if (!(amount > 0) || !Number.isFinite(amount)) {
      setError("Enter an amount greater than zero.");
      return;
    }

    if (!form.date) {
      setError("Choose an expense date.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      await api.post("/expenses", {
        title: form.title.trim(),
        amount,
        category: form.category,
        expense_date: form.date,
      });

      onSaved();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="ex-modal-backdrop"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !busy &&
          !parsing
        ) {
          onClose();
        }
      }}
    >
      {/* <div
        className="ex-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ex-modal-title"
      > */}


<div
        className="ex-modal"
        
        role="dialog"
        aria-modal="true"
        aria-labelledby="ex-modal-title"
      >

        <div className="ex-modal-head">
          <h2 id="ex-modal-title">Add an expense</h2>
          <button
            type="button"
            className="ex-icon-btn"
            onClick={onClose}
            aria-label="Close"
            disabled={busy || parsing}
          >
            ×
          </button>
        </div>

        <form className="ex-form" onSubmit={submit} noValidate>
          {/* AI Quick Add */}
          <section className="ex-ai-quick-add" aria-label="Quick Add with AI">
            <div className="ex-ai-heading">
              <span aria-hidden="true"></span>
              <strong>Quick Add with AI</strong>
              <span className="ex-ai-tag"></span>
            </div>

            <p className="ex-ai-description">
              Describe what you spent, in your own words.
            </p>

            <textarea
              className="ex-ai-input"
              rows={2}
              maxLength={500}
              value={quickText}
              onChange={(event) => setQuickText(event.target.value)}
              placeholder="e.g. Spent ₹350 on dinner yesterday"
              disabled={parsing || busy}
            />

            <button
              className="ex-ai-button"
              type="button"
              color ="#000000"
              onClick={parseWithAI}
              disabled={parsing || busy || !quickText.trim()}
            >
              {parsing ? "Understanding expense…" : "✳ Parse expense"}
              {!parsing && <span aria-hidden="true"> ↗</span>}
            </button>
          </section>

          <div className="ex-manual-divider">
            <span>OR ENTER MANUALLY</span>
          </div>

          <label className="ex-field">
            <span>What was it?</span>
            <input
              ref={titleInput}
              value={form.title}
              maxLength={100}
              placeholder="e.g. Lunch with Riya"
              autoComplete="off"
              onChange={update("title")}
              disabled={busy}
            />
          </label>

          <div className="ex-form-row">
            <label className="ex-field">
              <span>Amount (₹)</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                placeholder="0"
                value={form.amount}
                onChange={update("amount")}
                disabled={busy}
              />
            </label>

            <label className="ex-field">
              <span>Date</span>
              <input
                type="date"
                max={todayISO()}
                value={form.date}
                onChange={update("date")}
                disabled={busy}
              />
            </label>
          </div>

          <fieldset className="ex-field ex-chips">
            <legend>Category</legend>
            <div className="ex-chip-group">
              {DEFAULT_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  aria-pressed={form.category === category}
                  className={
                    form.category === category ? "is-picked" : ""
                  }
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      category,
                    }))
                  }
                  disabled={busy}
                >
                  {category}
                </button>
              ))}
            </div>
          </fieldset>

          {error && (
            <p className="ex-error" role="alert">
              {error}
            </p>
          )}

          <div className="ex-modal-actions">
            <button
              type="button"
              className="ex-ghost"
              onClick={onClose}
              disabled={busy || parsing}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="ex-primary"
              disabled={busy || parsing}
            >
              {busy ? "Saving…" : "Save expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

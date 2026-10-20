// import { formatRupees } from "../lib/format";
// import { colorFor, formatDayMonth } from "../lib/expense";

// export default function ExpenseRow({ expense, onDelete }) {
//   const category = expense.category || "Other";
//   const amount = Number(expense.amount || 0);

//   return (
//     <article className="ex-row">
//       <span
//         className="ex-row-chip"
//         style={{ background: colorFor(category) }}
//         aria-hidden="true"
//       >
//         {category.charAt(0).toUpperCase()}
//       </span>

//       <div className="ex-row-main">
//         <p className="ex-row-title">{expense.title}</p>
//         <p className="ex-row-meta">
//           {category} · {formatDayMonth(expense.expense_date)}
//         </p>
//       </div>

//       <p className="ex-row-amount">{formatRupees(amount)}</p>

//       <button
//         type="button"
//         className="ex-text-btn"
//         onClick={() => onDelete(expense)}
//         aria-label={`Remove ${expense.title}`}
//       >
//         Remove
//       </button>
//     </article>
//   );
// }
import { useEffect, useId, useRef, useState } from "react";
import { formatRupees } from "../lib/format";
import { formatDayMonth, iconFor } from "../lib/expense";

// Remove opens a small confirm popup over the button. Delete runs the removal;
// Cancel, Escape or a click outside closes it. No browser popup is used.
export default function ExpenseRow({ expense, index, onRemove }) {
  const [asking, setAsking] = useState(false);
  const wrapRef = useRef(null);
  const cancelRef = useRef(null);
  const titleId = useId();
  const textId = useId();
  const category = expense.category || "Other";
  const amount = Number(expense.amount || 0);

  useEffect(() => {
    if (!asking) return undefined;

    cancelRef.current?.focus();

    const onPointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setAsking(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setAsking(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [asking]);

  const handleDelete = () => {
    setAsking(false);
    onRemove(expense);
  };

  return (
    <article className="expense-row">
      <span className="expense-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="expense-icon" aria-hidden="true">
        {iconFor(category)}
      </div>
      <div className="expense-identity">
        <p className="expense-category">{category}</p>
        <p className="expense-title">{expense.title}</p>
      </div>
      <p className="expense-date">{formatDayMonth(expense.expense_date)}</p>
      <p className="expense-amount">{formatRupees(amount)}</p>

      <div className="row-action-wrap" ref={wrapRef}>
        <button
          type="button"
          className="row-action"
          aria-haspopup="dialog"
          aria-expanded={asking}
          onClick={() => setAsking((open) => !open)}
        >
          Remove
        </button>

        {asking && (
          <div
            className="confirm-pop"
            role="alertdialog"
            aria-labelledby={titleId}
            aria-describedby={textId}
          >
            <p className="confirm-title" id={titleId}>Delete this expense?</p>
            <p className="confirm-text" id={textId}>
              “{expense.title}” will be removed. This can’t be undone.
            </p>
            <div className="confirm-actions">
              <button ref={cancelRef} type="button" onClick={() => setAsking(false)}>
                Cancel
              </button>
              <button type="button" className="confirm-delete" onClick={handleDelete}>
                OK, delete
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
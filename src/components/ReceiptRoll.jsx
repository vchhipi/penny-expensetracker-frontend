import { useState } from "react";
import { formatRupees } from "../lib/format";

// Example expenses already on the receipt. The quick-add line the visitor types
// is added on top, and the total updates with it.
const BASE = [
  { title: "Groceries", amount: 2360 },
  { title: "Cab to airport", amount: 620 },
  { title: "Electricity", amount: 1850 },
];

// A random date in the last 30 days, picked once per visit.
function randomReceiptDate() {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date;
}

export default function ReceiptRoll({ entry }) {
  const [date] = useState(randomReceiptDate);
  const [order] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));
  const [run, setRun] = useState(0); // bump to replay the unroll
  const live = entry?.ok ? entry : null;
  const total = BASE.reduce((sum, row) => sum + row.amount, 0) + (live ? live.amount : 0);
  const dateText = date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="rx-stage">
      <button type="button" className="rx-replay" onClick={() => setRun((n) => n + 1)}>
        Replay
      </button>

      <div className="rx-body" key={run}>
        <span className="rx-roll" aria-hidden="true" />
        <article className="rx-paper" aria-label="An example receipt from Penny">
          <header className="rx-head">
            <p className="rx-brand">penny.</p>
            <p className="rx-meta">Order #{order}</p>
            <p className="rx-meta">{dateText}</p>
          </header>

          <ul className="rx-items">
            {live && (
              <li className="rx-item is-new" key={`${live.title}-${live.amount}-${live.category}`}>
                <span>
                  {live.title}
                  <br />
                  <small>{live.category}</small>
                </span>
                <span>{formatRupees(live.amount)}</span>
              </li>
            )}
            {BASE.map((row) => (
              <li className="rx-item" key={row.title}>
                <span>{row.title}</span>
                <span>{formatRupees(row.amount)}</span>
              </li>
            ))}
          </ul>

          <div className="rx-total">
            <span>Total</span>
            <span key={total}>{formatRupees(total)}</span>
          </div>

          <div className="rx-barcode" aria-hidden="true" />
          <p className="rx-thanks">Thank you for tracking</p>
        </article>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link } from "react-router-dom";
import QuickAddDemo from "../components/QuickAddDemo";
import ReceiptRoll from "../components/ReceiptRoll";
import "../styles/landing.css";

const SHOTS = [
  {
    src: "/screens/dashboard-top.png",
    caption: "Your month at the top: what you've spent, the insight, and a quick way to add an expense.",
    alt: "The Penny dashboard header with this month's insight and the Add expense button.",
  },
  {
    src: "/screens/dashboard-glance.png",
    caption: "Money at a glance: spent this month, what's left of your budget, and your top category.",
    alt: "Penny cards showing this month's spending, the monthly budget and the top category.",
  },
  {
    src: "/screens/dashboard-spend.png",
    caption: "Where the money went: a monthly chart and a breakdown by category.",
    alt: "Penny spending chart over six months and a category breakdown donut.",
  },
  {
    src: "/screens/dashboard-recent.png",
    caption: "Recent expenses, with filters and a remove button on every row.",
    alt: "Penny list of recent expenses with date and amount, and Remove buttons.",
  },
  {
    src: "/screens/add-expense.png",
    caption: "Adding an expense: type it in plain words, or fill in the fields.",
    alt: "The Penny add expense dialog with title, amount, category and date fields.",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export default function Landing() {
  // The latest parsed quick-add line, added to the receipt beside the hero.
  const [entry, setEntry] = useState(null);

  return (
    <div className="lp-page">
      <header className="lp-top">
        <Link className="lp-brand" to="/" aria-label="penny home">
          penny<span>.</span>
        </Link>
      </header>

      <main className="lp-main is-ready">
        <section className="lp-hero" aria-labelledby="lp-title">
          <div className="lp-copy">
            {/* <p className="lp-badge">
              <span aria-hidden="true" />
              Your personal expense tracker
            </p> */}
            <h1 id="lp-title">
              Track all your <em>penny.</em>
            </h1>
            <p className="lp-lede">
   Add what you spend, track your spending pattern and stay within your budget.
</p>
            

            <div className="lp-actions">
              <Link className="lp-btn lp-btn-primary" to="/login">
                <span>Sign in</span>
                <ArrowIcon />
              </Link>
              <Link className="lp-btn lp-btn-secondary" to="/register">
                <span>Create new account</span>
                <ArrowIcon />
              </Link>
            </div>

            <p className="lp-bank-note">
              Penny doesn’t connect to any bank account. You add every expense yourself.
            </p>
          </div>

          <div className="lp-friend">
            <ReceiptRoll entry={entry} />
            <QuickAddDemo onChange={setEntry} />
          </div>
        </section>

        <div className="lp-scroll-wrap">
          <a className="lp-scroll" href="#how">
            <span>Scroll down</span>
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </a>
        </div>

        <section className="lp-preview" id="how" aria-labelledby="lp-preview-title">
          <div className="lp-preview-head">
            <p className="lp-kicker">How Penny looks</p>
            <h2 id="lp-preview-title">Your money, at a glance.</h2>
          </div>
          <div className="lp-gallery">
            {SHOTS.map((shot) => (
              <figure className="lp-shot" key={shot.src}>
                <img src={shot.src} alt={shot.alt} loading="lazy" />
                <figcaption>{shot.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <span>penny</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
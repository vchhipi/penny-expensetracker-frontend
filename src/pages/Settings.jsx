import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addSubscription,
  deleteSubscription,
  fetchSettings,
  fetchSubscriptions,
  saveProfile,
  savePassword,
  saveSettings,
  updateSubscription,
} from "../api/settings";
import { formatRupees } from "../lib/format";
import "../styles/settings.css";

const SECTIONS = [
  { id: "preferences", label: "Preferences & Budget", hint: "Budget, categories, subscriptions" },
  { id: "personal", label: "Personal Details", hint: "Name and password" },
];

const today = () => new Date().toLocaleDateString("en-CA");

const EMPTY_SUB = {
  name: "",
  amount: "",
  billingCycle: "MONTHLY",
  category: "",
  startDate: today(),
  nextDue: today(),
  validUntil: "",
  status: "ACTIVE",
  notes: "",
};

const errorText = (err, fallback) => err.response?.data?.message || fallback;

export default function Settings({ me, onProfileSaved, onLogout }) {
  const [section, setSection] = useState("preferences");

  return (
    <div className="st-page">
      <header className="st-top">
        <Link className="st-brand" to="/dashboard">
          penny<span>.</span>
        </Link>
        <Link className="st-back" to="/dashboard">
          ← Back to dashboard
        </Link>
      </header>

      <div className="st-layout">
        <aside className="st-side" aria-label="Settings">
          <p className="st-side-title">Settings</p>
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`st-nav ${section === item.id ? "is-active" : ""}`}
              aria-current={section === item.id ? "page" : undefined}
              onClick={() => setSection(item.id)}
            >
              <strong>{item.label}</strong>
              <small>{item.hint}</small>
            </button>
          ))}
          <button type="button" className="st-nav st-signout" onClick={onLogout}>
            <strong>Sign out</strong>
          </button>
        </aside>

        <main className="st-main">
          {section === "preferences" ? (
            <Preferences />
          ) : (
            <PersonalDetails me={me} onProfileSaved={onProfileSaved} />
          )}
        </main>
      </div>
    </div>
  );
}

function Preferences() {
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [subs, setSubs] = useState([]);
  const [subForm, setSubForm] = useState(EMPTY_SUB);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([fetchSettings(), fetchSubscriptions()])
      .then(([settings, list]) => {
        if (!active) return;
        setBudget(String(settings.monthlyBudget));
        setCategories(settings.categories);
        setSubs(list);
      })
      .catch((err) => active && setError(errorText(err, "Couldn't load your settings.")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const refreshSubs = async () => setSubs(await fetchSubscriptions());

  const saveBudgetAndCategories = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await saveSettings({ monthlyBudget: Number(budget), categories });
      setMessage("Preferences saved.");
    } catch (err) {
      setError(errorText(err, "Couldn't save. Please try again."));
    }
  };

  const addCategory = () => {
    const name = newCategory.trim();
    setNewCategory("");
    if (!name || categories.some((c) => c.toLowerCase() === name.toLowerCase())) return;
    setCategories([...categories, name]);
  };

  const removeCategory = (name) => setCategories(categories.filter((c) => c !== name));

  const startEdit = (sub) => {
    setEditingId(sub.id);
    setSubForm({
      ...sub,
      amount: String(sub.amount),
      validUntil: sub.validUntil || "",
      notes: sub.notes || "",
    });
    setMessage("");
    setError("");
  };

  const resetSub = () => {
    setEditingId(null);
    setSubForm(EMPTY_SUB);
  };

  const submitSub = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const payload = {
      ...subForm,
      amount: Number(subForm.amount),
      validUntil: subForm.validUntil || null,
    };
    try {
      if (editingId) {
        await updateSubscription(editingId, payload);
        setMessage("Subscription updated.");
      } else {
        await addSubscription(payload);
        setMessage("Subscription added.");
      }
      resetSub();
      await refreshSubs();
    } catch (err) {
      setError(errorText(err, "Couldn't save that subscription."));
    }
  };

  const removeSub = async (id) => {
    setError("");
    setMessage("");
    try {
      await deleteSubscription(id);
      if (editingId === id) resetSub();
      setMessage("Subscription removed.");
      await refreshSubs();
    } catch (err) {
      setError(errorText(err, "Couldn't remove that subscription."));
    }
  };

  const togglePause = async (sub) => {
    setError("");
    try {
      await updateSubscription(sub.id, {
        ...sub,
        status: sub.status === "ACTIVE" ? "PAUSED" : "ACTIVE",
        validUntil: sub.validUntil || null,
      });
      await refreshSubs();
    } catch (err) {
      setError(errorText(err, "Couldn't update that subscription."));
    }
  };

  if (loading) return <p className="st-muted">Loading your settings…</p>;

  return (
    <>
      <section className="st-card">
        <h2>Budget and categories</h2>
        <form onSubmit={saveBudgetAndCategories}>
          <label className="st-field">
            <span>Monthly budget (₹)</span>
            <input
              type="number"
              min="1"
              step="1"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              required
            />
          </label>

          <div className="st-field">
            <span>Categories</span>
            <div className="st-chips">
              {categories.map((name) => (
                <span key={name} className="st-chip">
                  {name}
                  <button type="button" aria-label={`Remove ${name}`} onClick={() => removeCategory(name)}>
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="st-row">
              <input
                type="text"
                placeholder="Add a category"
                value={newCategory}
                maxLength={40}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCategory();
                  }
                }}
              />
              <button type="button" className="st-btn st-btn-ghost" onClick={addCategory}>
                Add
              </button>
            </div>
          </div>

          <button type="submit" className="st-btn">Save preferences</button>
        </form>
      </section>

      <section className="st-card">
        <h2>Subscriptions</h2>
        {subs.length === 0 ? (
          <p className="st-muted">No subscriptions yet.</p>
        ) : (
          <ul className="st-subs">
            {subs.map((sub) => (
              <li key={sub.id} className={sub.status === "PAUSED" ? "is-paused" : ""}>
                <div>
                  <strong>{sub.name}</strong>
                  <small>
                    {formatRupees(sub.amount)} · {sub.billingCycle.toLowerCase()} · next {sub.nextDue}
                    {sub.status === "PAUSED" ? " · paused" : ""}
                  </small>
                </div>
                <div className="st-sub-actions">
                  <button type="button" onClick={() => startEdit(sub)}>Edit</button>
                  <button type="button" onClick={() => togglePause(sub)}>
                    {sub.status === "ACTIVE" ? "Pause" : "Resume"}
                  </button>
                  <button type="button" onClick={() => removeSub(sub.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form className="st-sub-form" onSubmit={submitSub}>
          <h3>{editingId ? "Edit subscription" : "Add a subscription"}</h3>
          <div className="st-grid">
            <label className="st-field">
              <span>Name</span>
              <input
                type="text"
                maxLength={100}
                value={subForm.name}
                onChange={(e) => setSubForm({ ...subForm, name: e.target.value })}
                required
              />
            </label>
            <label className="st-field">
              <span>Amount (₹)</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={subForm.amount}
                onChange={(e) => setSubForm({ ...subForm, amount: e.target.value })}
                required
              />
            </label>
            <label className="st-field">
              <span>Billing</span>
              <select
                value={subForm.billingCycle}
                onChange={(e) => setSubForm({ ...subForm, billingCycle: e.target.value })}
              >
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="YEARLY">Yearly</option>
              </select>
            </label>
            <label className="st-field">
              <span>Category</span>
              <select
                value={subForm.category}
                onChange={(e) => setSubForm({ ...subForm, category: e.target.value })}
              >
                <option value="">Other</option>
                {categories.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="st-field">
              <span>Start date</span>
              <input
                type="date"
                value={subForm.startDate}
                onChange={(e) => setSubForm({ ...subForm, startDate: e.target.value })}
                required
              />
            </label>
            <label className="st-field">
              <span>Next payment</span>
              <input
                type="date"
                value={subForm.nextDue}
                onChange={(e) => setSubForm({ ...subForm, nextDue: e.target.value })}
                required
              />
            </label>
            <label className="st-field">
              <span>Ends on (optional)</span>
              <input
                type="date"
                value={subForm.validUntil}
                onChange={(e) => setSubForm({ ...subForm, validUntil: e.target.value })}
              />
            </label>
            <label className="st-field">
              <span>Status</span>
              <select
                value={subForm.status}
                onChange={(e) => setSubForm({ ...subForm, status: e.target.value })}
              >
                <option value="ACTIVE">Active</option>
                <option value="PAUSED">Paused</option>
              </select>
            </label>
          </div>
          <div className="st-row">
            <button type="submit" className="st-btn">
              {editingId ? "Save subscription" : "Add subscription"}
            </button>
            {editingId && (
              <button type="button" className="st-btn st-btn-ghost" onClick={resetSub}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* {message && <p className="st-message" role="status">{message}</p>}
      {error && <p className="st-error" role="alert">{error}</p>} */}
            <Toast kind="ok" text={message} onClose={() => setMessage("")} />
            <Toast kind="error" text={error} onClose={() => setError("")} />
    </>
  );
}

function PersonalDetails({ me, onProfileSaved }) {
  const [name, setName] = useState(me?.name || "");
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const saveName = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await saveProfile(name.trim());
      await onProfileSaved();
      setMessage("Name updated.");
    } catch (err) {
      setError(errorText(err, "Couldn't update your name."));
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    if (pw.next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (pw.next !== pw.confirm) {
      setError("The new passwords don't match.");
      return;
    }
    try {
      await savePassword(pw.current, pw.next);
      setPw({ current: "", next: "", confirm: "" });
      setMessage("Password updated.");
    } catch (err) {
      setError(errorText(err, "Couldn't change your password."));
    }
  };

  return (
    <>
      <section className="st-card">
        <h2>Your name</h2>
        <form onSubmit={saveName}>
          <label className="st-field">
            <span>Display name (shown across Penny)</span>
            <input
              type="text"
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="st-btn">Save name</button>
        </form>
      </section>

      <section className="st-card">
        <h2>Change password</h2>
        <form onSubmit={changePassword}>
          <label className="st-field">
            <span>Current password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={pw.current}
              onChange={(e) => setPw({ ...pw, current: e.target.value })}
              required
            />
          </label>
          <label className="st-field">
            <span>New password (at least 8 characters)</span>
            <input
              type="password"
              autoComplete="new-password"
              value={pw.next}
              onChange={(e) => setPw({ ...pw, next: e.target.value })}
              required
            />
          </label>
          <label className="st-field">
            <span>Confirm new password</span>
            <input
              type="password"
              autoComplete="new-password"
              value={pw.confirm}
              onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
              required
            />
          </label>
          <button type="submit" className="st-btn">Change password</button>
        </form>
      </section>

      {/* {message && <p className="st-message" role="status">{message}</p>}
      {error && <p className="st-error" role="alert">{error}</p>} */}
            <Toast kind="ok" text={message} onClose={() => setMessage("")} />
            <Toast kind="error" text={error} onClose={() => setError("")} />
    </>
  );
}

function Toast({ text, kind, onClose }) {
    useEffect(() => {
      if (!text) return;
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    }, [text, onClose]);
  
    if (!text) return null;
    return (
      <div className={`st-toast st-toast-${kind}`} role={kind === "error" ? "alert" : "status"}>
        <span>{text}</span>
        <button type="button" aria-label="Close message" onClick={onClose}>
          ×
        </button>
      </div>
    );
  }
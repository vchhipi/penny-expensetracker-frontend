import { useState } from "react";
import { ArrowIcon, CategoryIcon, SetupButton, SetupHeader, SetupStatus, StepHeading } from "../components/ui";
import SubscriptionForm from "../components/SubscriptionForm";
import { defaultCategories, makeInitialSubscription } from "../data/mock";
import { formatRupees, formatSetupDate } from "../lib/format";

function SetupWizard({ onComplete }) {
    const [step, setStep] = useState(0);
    const [budget, setBudget] = useState("25000");
    const [selectedCategories, setSelectedCategories] = useState(() => new Set(defaultCategories.slice(0, 6)));
    const [customCategories, setCustomCategories] = useState([]);
    const [showCustomCategory, setShowCustomCategory] = useState(false);
    const [customCategory, setCustomCategory] = useState("");
    const [subscriptions, setSubscriptions] = useState([]);
    const [showSubscriptionForm, setShowSubscriptionForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [draft, setDraft] = useState(() => makeInitialSubscription());
    const [subscriptionError, setSubscriptionError] = useState("");
    const allCategories = [...defaultCategories, ...customCategories];
    const numericBudget = Number(budget) || 0;
    const updateDraft = (field, value) => {
        setDraft((current) => ({ ...current, [field]: value }));
        setSubscriptionError("");
    };
    const toggleCategory = (category) => {
        setSelectedCategories((current) => {
            const next = new Set(current);
            if (next.has(category))
                next.delete(category);
            else
                next.add(category);
            return next;
        });
    };
    const addCustomCategory = () => {
        const value = customCategory.trim();
        if (!value)
            return;
        const normalized = value.charAt(0).toUpperCase() + value.slice(1);
        setCustomCategories((current) => [...current, normalized]);
        setSelectedCategories((current) => new Set([...current, normalized]));
        setCustomCategory("");
        setShowCustomCategory(false);
    };
    const saveSubscription = () => {
        if (!draft.name.trim() || !draft.amount) {
            setSubscriptionError("Add a subscription name and amount to continue.");
            return;
        }
        if (draft.validity === "CUSTOM DATE" && !draft.validUntil) {
            setSubscriptionError("Choose an end date or select no expiry.");
            return;
        }
        if (editingId !== null) {
            setSubscriptions((current) => current.map((item) => item.id === editingId ? { ...draft, id: editingId } : item));
        }
        else {
            setSubscriptions((current) => [...current, { ...draft, id: Date.now() }]);
        }
        setDraft(makeInitialSubscription());
        setEditingId(null);
        setShowSubscriptionForm(false);
        setSubscriptionError("");
    };
    const editSubscription = (subscription) => {
        const { id, ...values } = subscription;
        setDraft(values);
        setEditingId(id);
        setShowSubscriptionForm(true);
    };
    const cancelSubscriptionForm = () => {
        setDraft(makeInitialSubscription());
        setEditingId(null);
        setShowSubscriptionForm(false);
        setSubscriptionError("");
    };
    return (<div className={`setup-shell setup-step-${step}`}>
      <SetupHeader step={step}/>
      <SetupStatus step={step}/>

      <main className="setup-main">
        {step === 0 && (<section className="setup-screen welcome-screen">
            <div className="welcome-index" aria-hidden="true">01</div>
            <StepHeading eyebrow="" title={<>LET&apos;S SET UP<br /><em>YOUR MONEY.</em></>} copy="A few things before we start tracking."/>
            <div className="setup-actions">
              <SetupButton onClick={() => setStep(1)}>LET&apos;S GO <ArrowIcon /></SetupButton>
              <span className="terminal-note">&lt; EXPENSE SYSTEM INITIALIZING &gt;</span>
            </div>
            <div className="welcome-object" aria-hidden="true">
              <i /><i /><i /><i /><i /><i /><i /><i />
              <b>₹</b>
            </div>
          </section>)}

        {step === 1 && (<section className="setup-screen budget-screen">
            <StepHeading eyebrow="" title={<>WHAT&apos;S YOUR<br /><em>MONTHLY LIMIT?</em></>} copy="Give yourself a number to work with. You can adjust it later."/>
            <div className="budget-layout">
              <div>
                <label className="budget-input">
                  <span>MONTHLY BUDGET</span>
                  <div><b>₹</b><input aria-label="Monthly budget" inputMode="numeric" value={budget} onChange={(event) => setBudget(event.target.value.replace(/\D/g, ""))}/></div>
                </label>
                <div className="quick-budgets" aria-label="Quick budget options">
                  {[10000, 15000, 20000, 25000].map((amount) => (<button key={amount} type="button" className={numericBudget === amount ? "active" : ""} onClick={() => setBudget(String(amount))}>
                      ₹{amount / 1000}K
                    </button>))}
                  <button type="button" className={!([10000, 15000, 20000, 25000].includes(numericBudget)) ? "active" : ""} onClick={() => setBudget("")}>CUSTOM</button>
                </div>
              </div>
              <div className="budget-preview">
                <span>YOUR STARTING LIMIT</span>
                <strong>{formatRupees(numericBudget)}</strong>
                <p>MONTHLY CAP · NOT CURRENT SPEND</p>
                <div className="limit-track"><i /></div>
                <div className="limit-scale"><span>₹0</span><span>{formatRupees(numericBudget)}</span></div>
              </div>
            </div>
            <div className="step-footer">
              
              <SetupButton onClick={() => setStep(2)} disabled={!numericBudget}>CONTINUE <ArrowIcon /></SetupButton>
            </div>
          </section>)}

        {step === 2 && (<section className="setup-screen categories-screen">
            <StepHeading title={<>WHERE DOES YOUR<br /><em>MONEY GO?</em></>} copy="Pick the categories you want penny to track."/>
            <div className="category-grid">
              {allCategories.map((category, index) => {
                const selected = selectedCategories.has(category);
                return (<button type="button" key={category} className={`category-block ${selected ? "selected" : ""}`} onClick={() => toggleCategory(category)} aria-pressed={selected}>
                    <span className="category-number">{String(index + 1).padStart(2, "0")}</span>
                    <CategoryIcon category={category}/>
                    <strong>{category.toUpperCase()}</strong>
                    <i className="category-check">{selected ? "✓" : "+"}</i>
                  </button>);
            })}
              <button type="button" className="category-block add-category" onClick={() => setShowCustomCategory(true)}>
                <span className="category-number">+</span>
                <strong>ADD CUSTOM<br />CATEGORY</strong>
                <i className="category-check">↗</i>
              </button>
            </div>
            {showCustomCategory && (<div className="inline-entry">
                <label>
                  <span>CUSTOM CATEGORY NAME</span>
                  <input autoFocus value={customCategory} onChange={(event) => setCustomCategory(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addCustomCategory()} placeholder="e.g. Pets"/>
                </label>
                <SetupButton onClick={addCustomCategory} disabled={!customCategory.trim()}>ADD +</SetupButton>
                <SetupButton variant="text" onClick={() => setShowCustomCategory(false)}>CANCEL</SetupButton>
              </div>)}
            <div className="step-footer">
              <span>{String(selectedCategories.size).padStart(2, "0")} SELECTED</span>
              <SetupButton onClick={() => setStep(3)} disabled={!selectedCategories.size}>CONTINUE <ArrowIcon /></SetupButton>
            </div>
          </section>)}

        {step === 3 && (<section className="setup-screen subscriptions-screen">
            <StepHeading  title={<>ANY RECURRING<br /><em>PAYMENTS?</em></>} copy="Add subscriptions so penny knows what’s coming next."/>

            {!showSubscriptionForm && subscriptions.length === 0 && (<div className="subscription-empty">
                <div className="empty-ledger-mark" aria-hidden="true"><span>+</span><i /><i /><i /></div>
                <div>
                  <p>YOUR RECURRING LEDGER IS EMPTY</p>
                  <strong>Nothing scheduled yet.</strong>
                  <span>Subscriptions are optional. Add one now or keep moving.</span>
                </div>
                <SetupButton onClick={() => setShowSubscriptionForm(true)}>+ ADD SUBSCRIPTION</SetupButton>
              </div>)}

            <div className="subscription-list">
              {subscriptions.map((subscription, index) => (<article className="subscription-card" key={subscription.id}>
                  <div className="subscription-card-head">
                    <span>ENTRY / {String(index + 1).padStart(2, "0")}</span>
                    <p className={subscription.status.toLowerCase()}>{subscription.status} <i /></p>
                  </div>
                  <div className="subscription-primary">
                    <h2>{subscription.name.toUpperCase()}</h2>
                    <strong>₹{Number(subscription.amount).toLocaleString("en-IN")} <small>/ {subscription.billingCycle.replace("LY", "")}</small></strong>
                  </div>
                  <dl>
                    <div><dt>Next payment</dt><dd>{formatSetupDate(subscription.nextPayment)}</dd></div>
                    <div><dt>Category</dt><dd>{subscription.category.toUpperCase()}</dd></div>
                    <div><dt>Start date</dt><dd>{formatSetupDate(subscription.startDate)}</dd></div>
                    <div><dt>Valid until</dt><dd>{subscription.validity === "NO EXPIRY" ? "NO EXPIRY" : formatSetupDate(subscription.validUntil)}</dd></div>
                  </dl>
                  <div className="subscription-actions">
                    <button type="button" onClick={() => editSubscription(subscription)}>EDIT</button>
                    <button type="button" onClick={() => setSubscriptions((current) => current.filter((item) => item.id !== subscription.id))}>REMOVE</button>
                  </div>
                </article>))}
            </div>

            {showSubscriptionForm && (<SubscriptionForm draft={draft} error={subscriptionError} isEditing={editingId !== null} onChange={updateDraft} onSave={saveSubscription} onCancel={cancelSubscriptionForm}/>)}

            {!showSubscriptionForm && subscriptions.length > 0 && (<SetupButton variant="secondary" onClick={() => setShowSubscriptionForm(true)}>+ ADD ANOTHER</SetupButton>)}

            <div className="step-footer subscription-footer">
              <SetupButton variant="text" onClick={() => setStep(4)}>{subscriptions.length ? "FINISH SETUP →" : "SKIP FOR NOW →"}</SetupButton>
              {subscriptions.length > 0 && <span>{String(subscriptions.length).padStart(2, "0")} RECURRING ENTRIES</span>}
            </div>
          </section>)}

        {step === 4 && (<section className="setup-screen complete-screen">
            <div className="complete-signal" aria-hidden="true"><i /><i /><i /><i /></div>
            <StepHeading  title={<>YOUR MONEY SYSTEM<br /><em>IS READY.</em></>} copy="Your workspace is configured. Start tracking when you’re ready."/>
            <div className="configuration-summary">
              <div><span>BUDGET</span><i /><strong>{formatRupees(numericBudget)}</strong></div>
              <div><span>CATEGORIES</span><i /><strong>{String(selectedCategories.size).padStart(2, "0")}</strong></div>
              <div><span>RECURRING</span><i /><strong>{String(subscriptions.length).padStart(2, "0")}</strong></div>
            </div>
            <div className="complete-actions">
              <span className="terminal-note active">&lt; TRACKING ACTIVE &gt;</span>
              <SetupButton onClick={() => onComplete({ budget: numericBudget, categories: [...selectedCategories], subscriptions })}>OPEN DASHBOARD <ArrowIcon /></SetupButton>
            </div>
          </section>)}
      </main>
    </div>);
}

export default SetupWizard;
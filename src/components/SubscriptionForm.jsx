import { SetupButton } from "./ui";
import { defaultCategories } from "../data/mock";

function SubscriptionForm({ draft, error, isEditing, onChange, onSave, onCancel, }) {
    return (<div className="subscription-form">
      <div className="form-stamp">{isEditing ? "EDIT.MODE" : "NEW.ENTRY"}</div>
      <div className="form-grid">
        <label className="field wide">
          <span>Subscription name</span>
          <input value={draft.name} onChange={(event) => onChange("name", event.target.value)} placeholder="e.g. Netflix" aria-invalid={Boolean(error && !draft.name.trim())}/>
        </label>
        <label className="field">
          <span>Amount</span>
          <div className="amount-field">
            <b>₹</b>
            <input inputMode="numeric" value={draft.amount} onChange={(event) => onChange("amount", event.target.value.replace(/\D/g, ""))} placeholder="649" aria-invalid={Boolean(error && !draft.amount)}/>
          </div>
        </label>
        <fieldset className="field fieldset">
          <legend>Billing cycle</legend>
          <div className="segmented-control">
            {["WEEKLY", "MONTHLY", "YEARLY"].map((cycle) => (<button type="button" key={cycle} className={draft.billingCycle === cycle ? "active" : ""} onClick={() => onChange("billingCycle", cycle)}>
                {cycle}
              </button>))}
          </div>
        </fieldset>
        <label className="field">
          <span>Category</span>
          <select value={draft.category} onChange={(event) => onChange("category", event.target.value)}>
            {defaultCategories.map((category) => <option key={category}>{category}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Start date</span>
          <input type="date" value={draft.startDate} onChange={(event) => onChange("startDate", event.target.value)}/>
        </label>
        <label className="field">
          <span>Next payment / due date</span>
          <input type="date" value={draft.nextPayment} onChange={(event) => onChange("nextPayment", event.target.value)}/>
        </label>
        <fieldset className="field fieldset">
          <legend>Validity</legend>
          <div className="segmented-control">
            {["NO EXPIRY", "CUSTOM DATE"].map((validity) => (<button type="button" key={validity} className={draft.validity === validity ? "active" : ""} onClick={() => onChange("validity", validity)}>
                {validity}
              </button>))}
          </div>
        </fieldset>
        {draft.validity === "CUSTOM DATE" && (<label className="field">
            <span>Valid until</span>
            <input type="date" value={draft.validUntil} onChange={(event) => onChange("validUntil", event.target.value)}/>
          </label>)}
        <fieldset className="field fieldset">
          <legend>Status</legend>
          <div className="segmented-control">
            {["ACTIVE", "PAUSED"].map((status) => (<button type="button" key={status} className={draft.status === status ? "active" : ""} onClick={() => onChange("status", status)}>
                {status}
              </button>))}
          </div>
        </fieldset>
        <label className="field wide">
          <span>Optional notes</span>
          <textarea value={draft.notes} onChange={(event) => onChange("notes", event.target.value)} placeholder="Account, plan, or reminder..." rows={2}/>
        </label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-actions">
        <SetupButton onClick={onSave}>{isEditing ? "SAVE CHANGES →" : "ADD TO LEDGER →"}</SetupButton>
        <SetupButton variant="text" onClick={onCancel}>CANCEL</SetupButton>
      </div>
    </div>);
}

export default SubscriptionForm;

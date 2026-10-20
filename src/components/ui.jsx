function BrandMark() {
    return (<span className="brand-mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>);
}

function ArrowIcon() {
    return (<svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5"/>
    </svg>);
}

function CategoryIcon({ category }) {
    const marks = {
        Food: <><path d="M5 3v6M8 3v6M5 6h3M6.5 9v8M13 3c2 2 2 6 0 8v6M13 3v8"/></>,
        Grocery: <><path d="M3 5h14l-2 8H5L3 5Z"/><path d="M7 5c0-2 1-3 3-3s3 1 3 3M7 17h.01M14 17h.01"/></>,
        Shopping: <><path d="M4 7h12l-1 10H5L4 7Z"/><path d="M7 8V6a3 3 0 0 1 6 0v2"/></>,
        Travel: <><path d="m2 11 16-7-6 14-2-6-8-1Z"/><path d="m10 12 4-4"/></>,
        Bills: <><path d="M5 2h10v16l-2-1.5L11 18l-2-1.5L7 18l-2-1.5V2Z"/><path d="M8 6h4M8 10h4"/></>,
        Entertainment: <><rect x="2.5" y="5" width="15" height="11" rx="1"/><path d="m7 5-2-3M13 5l2-3M8 9l5 2.5L8 14V9Z"/></>,
        Education: <><path d="m2 7 8-4 8 4-8 4-8-4Z"/><path d="M5 9.5V14c3 2 7 2 10 0V9.5"/></>,
        Health: <><path d="M7 2h6v5h5v6h-5v5H7v-5H2V7h5V2Z"/></>,
        Other: <><circle cx="4" cy="10" r="1"/><circle cx="10" cy="10" r="1"/><circle cx="16" cy="10" r="1"/></>,
    };
    return (<svg className="category-glyph" viewBox="0 0 20 20" aria-hidden="true">
      {marks[category] ?? marks.Other}
    </svg>);
}

function AppButton({ children, className = "", onClick, ariaLabel, }) {
    return (<button className={`pressable ${className}`} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>);
}

function NavItem({ children, active = false }) {
    return (<button className={`nav-item ${active ? "active" : ""}`} type="button">
      {children}
    </button>);
}

function StatCard({ eyebrow, value, children, className = "", }) {
    return (<article className={`stat-card ${className}`}>
      <div className="card-corner" aria-hidden="true">+</div>
      <p className="eyebrow">{eyebrow}</p>
      <p className="stat-value">{value}</p>
      {children}
    </article>);
}

function SetupHeader({ step }) {
    const displayStep = Math.min(step + 1, 4);
    return (<header className="setup-header">
      <div className="setup-brand">penny</div>
      <div className="setup-progress-wrap">
        <span>SETUP {String(displayStep).padStart(2, "0")} / 04</span>
        <div className="setup-progress" aria-label={`Setup step ${displayStep} of 4`}>
          {[1, 2, 3, 4].map((item) => (<i key={item} className={item <= displayStep ? "complete" : ""}/>))}
        </div>
      </div>
    </header>);
}

function SetupStatus({ step }) {
    const status = (requiredStep) => (step > requiredStep ? "READY" : step === requiredStep ? "ACTIVE" : "PENDING");
    return (<aside className="setup-status" aria-label="Configuration status">
      <span>USER.CONFIG</span>
      <p>BUDGET <i /> {status(1)}</p>
      <p>CATEGORIES <i /> {status(2)}</p>
      <p>RECURRING <i /> {status(3)}</p>
    </aside>);
}

function SetupButton({ children, variant = "primary", onClick, disabled = false, type = "button", }) {
    return (<button className={`setup-button ${variant}`} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>);
}

function StepHeading({ eyebrow, title, copy }) {
    return (<div className="setup-title-block">
      <p className="setup-eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="setup-copy">{copy}</p>
    </div>);
}

export { BrandMark, ArrowIcon, CategoryIcon, AppButton, NavItem, StatCard, SetupHeader, SetupStatus, SetupButton, StepHeading };

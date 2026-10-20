



// import { useEffect, useMemo, useState } from "react";

// import EmptyDashboard from "../components/EmptyDashboard";
// import { initialsOf } from "../lib/format";
// import {
//   AppButton,
//   ArrowIcon,
//   NavItem,
//   StatCard,
// } from "../components/ui";
// import SpendingChart from "../components/SpendingChart";
// import ExpenseRow from "../components/ExpenseRow";
// import { api } from "../api/client";

// export default function Dashboard({ me, onLogout }) {
//   const [filter, setFilter] = useState("all");
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [fetchError, setFetchError] = useState("");

//   // Temporary budget until we connect the saved setup settings.
//   const monthlyBudget = 25000;

//   // Fetch actual expenses from the backend.
//   useEffect(() => {
//     let cancelled = false;

//     async function loadExpenses() {
//       try {
//         setLoading(true);
//         setFetchError("");

//         const response = await api.get("/expenses");

//         if (!cancelled) {
//           setExpenses(Array.isArray(response.data) ? response.data : []);
//         }
//       } catch (error) {
//         if (!cancelled) {
//           setFetchError(
//             error.response?.data?.message ||
//               "Unable to load your expenses. Please try again."
//           );
//         }
//       } finally {
//         if (!cancelled) {
//           setLoading(false);
//         }
//       }
//     }

//     loadExpenses();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const today = new Date();
//   const currentMonth = today.getMonth();
//   const currentYear = today.getFullYear();

//   const getExpenseDate = (expense) =>
//     new Date(`${expense.expense_date}T00:00:00`);

//   const isThisMonth = (expense) => {
//     const date = getExpenseDate(expense);

//     return (
//       date.getMonth() === currentMonth &&
//       date.getFullYear() === currentYear
//     );
//   };

//   const monthlyExpenses = useMemo(
//     () => expenses.filter(isThisMonth),
//     [expenses, currentMonth, currentYear]
//   );

//   const monthlyTotal = monthlyExpenses.reduce(
//     (total, expense) => total + Number(expense.amount || 0),
//     0
//   );

//   const remainingBudget = monthlyBudget - monthlyTotal;

//   const budgetUsedPercentage =
//     monthlyBudget > 0
//       ? Math.round((monthlyTotal / monthlyBudget) * 100)
//       : 0;

//   const categoryTotals = monthlyExpenses.reduce((totals, expense) => {
//     const category = expense.category || "Other";

//     totals[category] =
//       (totals[category] || 0) + Number(expense.amount || 0);

//     return totals;
//   }, {});

//   const topCategory = Object.entries(categoryTotals).sort(
//     (a, b) => b[1] - a[1]
//   )[0];

//   const topCategoryPercentage =
//     monthlyTotal > 0 && topCategory
//       ? Math.round((topCategory[1] / monthlyTotal) * 100)
//       : 0;

//   const filteredExpenses = useMemo(() => {
//     const now = new Date();

//     return expenses.filter((expense) => {
//       const date = getExpenseDate(expense);

//       if (filter === "month") {
//         return isThisMonth(expense);
//       }

//       if (filter === "week") {
//         const startDate = new Date(now);
//         startDate.setDate(now.getDate() - 6);
//         startDate.setHours(0, 0, 0, 0);

//         return date >= startDate && date <= now;
//       }

//       return true;
//     });
//   }, [expenses, filter, currentMonth, currentYear]);

//   const formatCurrency = (amount) =>
//     `₹${Number(amount || 0).toLocaleString("en-IN", {
//       maximumFractionDigits: 2,
//     })}`;

//   const scrollToExpenses = () => {
//     document
//       .getElementById("recent-expenses")
//       ?.scrollIntoView({ behavior: "smooth" });
//   };

//   if (loading) {
//     return (
//       <div className="app-shell">
//         <p>Loading your expenses...</p>
//       </div>
//     );
//   }

//   if (fetchError) {
//     return (
//       <div className="app-shell">
//         <p role="alert">{fetchError}</p>
//         <button
//           type="button"
//           onClick={() => window.location.reload()}
//         >
//           Try again
//         </button>
//       </div>
//     );
//   }

//   if (expenses.length === 0) {
//     return <EmptyDashboard name={me?.name} onLogout={onLogout} />;
//   }

//   return (
//     <div className="app-shell">
//       {/* Sidebar */}
//       <aside className="sidebar">
//         <div className="brand">
//           <span className="brand-mark">e.</span>
//           <span>penny</span>
//         </div>

//         <div className="sidebar-label">WORKSPACE</div>

//         <nav className="sidebar-nav">
//           <NavItem active icon="grid">
//             Overview
//           </NavItem>

//           <NavItem icon="receipt" onClick={scrollToExpenses}>
//             Transactions
//           </NavItem>

//           <NavItem icon="chart">
//             Analytics
//           </NavItem>

//           <NavItem icon="wallet">
//             Budgets
//           </NavItem>
//         </nav>

//         <div className="sidebar-bottom">
//           <div className="profile">
//             <div className="avatar">
//               {initialsOf(me?.name || "User")}
//             </div>

//             <div className="profile-info">
//               <strong>{me?.name || "User"}</strong>
//               <span>{me?.email || "Your account"}</span>
//             </div>

//             <button
//               type="button"
//               className="logout-button"
//               onClick={onLogout}
//               aria-label="Log out"
//               title="Log out"
//             >
//               ↗
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Main dashboard */}
//       <main className="dashboard-main">
//         <header className="topbar">
//           <div>
//             <span className="eyebrow">YOUR WORKSPACE</span>
//             <h1>Overview</h1>
//           </div>

//           <div className="topbar-actions">
//             <span className="current-date">
//               {today.toLocaleDateString("en-IN", {
//                 day: "numeric",
//                 month: "short",
//                 year: "numeric",
//               })}
//             </span>

//             <AppButton onClick={scrollToExpenses}>
//               View expenses <ArrowIcon />
//             </AppButton>
//           </div>
//         </header>

//         {/* Welcome section */}
//         <section className="welcome-section">
//           <div>
//             <span className="eyebrow">
//               {today
//                 .toLocaleDateString("en-IN", {
//                   month: "short",
//                   year: "numeric",
//                 })
//                 .toUpperCase()}
//             </span>

//             <h2>
//               Hey, {me?.name?.split(" ")[0] || "there"}.
//             </h2>

//             <p>Here&apos;s how your money is looking this month.</p>
//           </div>

//           <div className="welcome-meta">
//             <span className="status-dot" />
//             <span>{expenses.length} ENTRIES</span>
//           </div>
//         </section>

//         {/* Summary cards */}
//         <section className="stats-grid">
//           <StatCard
//             eyebrow="This month"
//             value={formatCurrency(monthlyTotal)}
//             className="main-stat"
//           >
//             <div className="stat-detail">
//               <span>
//                 {monthlyExpenses.length} expense
//                 {monthlyExpenses.length === 1 ? "" : "s"} this month
//               </span>
//             </div>

//             <div className="budget-progress">
//               <div className="budget-progress-labels">
//                 <strong>
//                   {formatCurrency(remainingBudget)} remaining
//                 </strong>

//                 <span>{budgetUsedPercentage}% used</span>
//               </div>

//               <div className="progress-track">
//                 <span
//                   style={{
//                     width: `${Math.min(
//                       Math.max(budgetUsedPercentage, 0),
//                       100
//                     )}%`,
//                   }}
//                 />
//               </div>
//             </div>
//           </StatCard>

//           <StatCard
//             eyebrow="Monthly budget"
//             value={formatCurrency(monthlyBudget)}
//             className="budget-stat"
//           >
//             <div className="budget-blocks">
//               {Array.from({ length: 5 }, (_, index) => (
//                 <span
//                   key={index}
//                   className={
//                     index <
//                     Math.ceil(
//                       Math.min(Math.max(budgetUsedPercentage, 0), 100) /
//                         20
//                     )
//                       ? "filled"
//                       : ""
//                   }
//                 />
//               ))}
//             </div>

//             <div className="stat-detail">
//               <strong>{100 - Math.min(budgetUsedPercentage, 100)}% available</strong>
//               <span>{formatCurrency(remainingBudget)}</span>
//             </div>
//           </StatCard>

//           <StatCard
//             eyebrow="Top category"
//             value={topCategory?.[0] || "No data"}
//             className="category-stat"
//           >
//             <p className="category-amount">
//               {formatCurrency(topCategory?.[1] || 0)}
//             </p>

//             <p className="stat-footnote">
//               {topCategory ? `${topCategoryPercentage}% OF SPENDING` : "NO EXPENSES THIS MONTH"}
//             </p>
//           </StatCard>
//         </section>

//         {/* Spending chart */}
//         <section className="dashboard-panel chart-panel">
//           <div className="panel-heading">
//             <div>
//               <span className="eyebrow">YOUR MONEY, AT A GLANCE</span>
//               <h3>Spending overview</h3>
//             </div>

//             <span className="panel-period">THIS MONTH</span>
//           </div>

//           <p className="chart-total">{formatCurrency(monthlyTotal)}</p>

//           <p className="chart-caption">
//             Total expenses for{" "}
//             {today.toLocaleDateString("en-IN", { month: "long" })}
//           </p>

//           <SpendingChart expenses={expenses} />
//         </section>

//         {/* Category breakdown */}
//         <section className="dashboard-panel category-panel">
//           <div className="panel-heading">
//             <div>
//               <span className="eyebrow">WHERE IT GOES</span>
//               <h3>Category breakdown</h3>
//             </div>
//           </div>

//           {Object.entries(categoryTotals).length === 0 ? (
//             <p>No category spending recorded this month.</p>
//           ) : (
//             <div className="category-list">
//               {Object.entries(categoryTotals)
//                 .sort((a, b) => b[1] - a[1])
//                 .map(([category, amount]) => {
//                   const percentage =
//                     monthlyTotal > 0
//                       ? (amount / monthlyTotal) * 100
//                       : 0;

//                   return (
//                     <div className="category-item" key={category}>
//                       <div className="category-item-heading">
//                         <span>{category}</span>
//                         <strong>{formatCurrency(amount)}</strong>
//                       </div>

//                       <div className="progress-track">
//                         <span
//                           style={{
//                             width: `${percentage}%`,
//                           }}
//                         />
//                       </div>

//                       <span className="category-percentage">
//                         {Math.round(percentage)}% of monthly spending
//                       </span>
//                     </div>
//                   );
//                 })}
//             </div>
//           )}
//         </section>

//         {/* Recent expenses */}
//         <section
//           className="dashboard-panel expenses-panel"
//           id="recent-expenses"
//         >
//           <div className="panel-heading">
//             <div>
//               <span className="eyebrow">THE PAPER TRAIL</span>
//               <h3>Recent expenses</h3>
//             </div>

//             <div className="expense-filters">
//               <button
//                 type="button"
//                 className={filter === "all" ? "active" : ""}
//                 onClick={() => setFilter("all")}
//               >
//                 All
//               </button>

//               <button
//                 type="button"
//                 className={filter === "week" ? "active" : ""}
//                 onClick={() => setFilter("week")}
//               >
//                 This week
//               </button>

//               <button
//                 type="button"
//                 className={filter === "month" ? "active" : ""}
//                 onClick={() => setFilter("month")}
//               >
//                 This month
//               </button>
//             </div>
//           </div>

//           {filteredExpenses.length === 0 ? (
//             <p className="empty-expenses">
//               No expenses found for this period.
//             </p>
//           ) : (
//             <div className="expenses-list">
//               {filteredExpenses.map((expense, index) => (
//                 <ExpenseRow
//                   key={expense.id}
//                   expense={{
//                     ...expense,
//                     date: expense.expense_date,
//                   }}
//                   index={index}
//                 />
//               ))}
//             </div>
//           )}
//         </section>

//         <footer className="dashboard-footer">
//           <span>penny © {today.getFullYear()}</span>
//           <span>Spend thoughtfully.</span>
//         </footer>
//       </main>
//     </div>
//   );
// }


// import { useCallback, useEffect, useMemo, useState } from "react";
// import "../styles/figma.css";
// import { api } from "../api/client";
// import AddExpenseModal from "../components/AddExpenseModal";
// import EmptyDashboard from "../components/EmptyDashboard";
// import ExpenseRow from "../components/ExpenseRow";
// import { colorFor, iconFor, parseExpenseDate } from "../lib/expense";
// import { formatRupees, initialsOf } from "../lib/format";

// const PERIODS = [
//   { id: "all", label: "All" },
//   { id: "week", label: "This week" },
//   { id: "month", label: "This month" },
// ];

// const PREVIEW_COUNT = 5;

// // Chart geometry (matches the Figma viewBox 442 x 136).
// const CHART_TOP = 16;
// const CHART_BASE = 116;
// const CHART_X = [4, 90.8, 177.6, 264.4, 351.2, 438];

// const monthShort = (date) => date.toLocaleDateString("en-US", { month: "short" });

// const shortMoney = (value) =>
//   value >= 1000
//     ? `₹${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
//     : `₹${Math.round(value)}`;

// const sameMonth = (a, b) =>
//   a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

// const dayKey = (expense) => String(expense.expense_date).slice(0, 10);

// function ArrowIcon() {
//   return (
//     <svg viewBox="0 0 20 20" aria-hidden="true">
//       <path d="M4 10h12M11 5l5 5-5 5" />
//     </svg>
//   );
// }

// export default function Dashboard({ me, onLogout }) {
//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [fetchError, setFetchError] = useState("");
//   const [updatedAt, setUpdatedAt] = useState(null);
//   const [period, setPeriod] = useState("all");
//   const [showAll, setShowAll] = useState(false);
//   const [showAvg, setShowAvg] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [toast, setToast] = useState("");

//   const budget = Number(me?.monthlyBudget) || 0;
//   const now = new Date();
//   const firstName = me?.name?.split(" ")[0] || "there";

//   const loadExpenses = useCallback(async () => {
//     try {
//       setFetchError("");
//       const { data } = await api.get("/expenses");
//       setExpenses(Array.isArray(data) ? data : []);
//       setUpdatedAt(new Date());
//     } catch (error) {
//       setFetchError(
//         error.response?.data?.message ||
//           "We couldn't load your expenses. Check your connection and try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadExpenses();
//   }, [loadExpenses]);

//   // "N" opens the add dialog when no field has focus.
//   useEffect(() => {
//     const onKey = (event) => {
//       const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName);
//       if (event.key.toLowerCase() === "n" && !typing && !modalOpen) {
//         setModalOpen(true);
//       }
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [modalOpen]);

//   useEffect(() => {
//     if (!toast) return undefined;
//     const timer = setTimeout(() => setToast(""), 2600);
//     return () => clearTimeout(timer);
//   }, [toast]);

//   const closeModal = useCallback(() => setModalOpen(false), []);
//   const openModal = () => setModalOpen(true);

//   const handleSaved = () => {
//     setModalOpen(false);
//     setToast("Expense saved.");
//     loadExpenses();
//   };

//   const handleRemove = async (expense) => {
//     if (!window.confirm(`Remove “${expense.title}”?`)) return;
//     try {
//       await api.delete(`/expenses/${expense.id}`);
//       setExpenses((current) => current.filter((item) => item.id !== expense.id));
//       setToast("Expense removed.");
//     } catch {
//       setToast("Couldn't remove that. Please try again.");
//     }
//   };

//   const scrollToId = (id) =>
//     document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

//   // ---- Derived numbers ------------------------------------------------

//   // Newest first.
//   const sorted = useMemo(
//     () =>
//       [...expenses].sort((a, b) => {
//         const byDate = dayKey(b).localeCompare(dayKey(a));
//         return byDate !== 0 ? byDate : Number(b.id) - Number(a.id);
//       }),
//     [expenses]
//   );

//   // Totals for the last six months, oldest first. The last entry is this month.
//   const months = useMemo(
//     () =>
//       Array.from({ length: 6 }, (_, i) => {
//         const start = new Date(now.getFullYear(), now.getMonth() + i - 5, 1);
//         const total = expenses.reduce((sum, expense) => {
//           const date = parseExpenseDate(expense.expense_date);
//           return sameMonth(date, start) ? sum + Number(expense.amount || 0) : sum;
//         }, 0);
//         return { label: monthShort(start), total };
//       }),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [expenses, now.getMonth(), now.getFullYear()]
//   );

//   const current = months[5];
//   const previous = months[4];
//   const monthTotal = current.total;
//   const avgSpend = months.reduce((sum, m) => sum + m.total, 0) / months.length;

//   const trendPct =
//     previous.total > 0
//       ? Math.round((Math.abs(monthTotal - previous.total) / previous.total) * 1000) / 10
//       : null;
//   const trendUp = monthTotal > previous.total;

//   const thisMonthExpenses = useMemo(
//     () => sorted.filter((e) => sameMonth(parseExpenseDate(e.expense_date), now)),
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [sorted, now.getMonth(), now.getFullYear()]
//   );

//   const categories = useMemo(() => {
//     const totals = {};
//     thisMonthExpenses.forEach((e) => {
//       const name = e.category || "Other";
//       totals[name] = (totals[name] || 0) + Number(e.amount || 0);
//     });
//     return Object.entries(totals)
//       .map(([label, value]) => ({
//         label,
//         value,
//         color: colorFor(label),
//         share: monthTotal > 0 ? value / monthTotal : 0,
//       }))
//       .sort((a, b) => b.value - a.value);
//   }, [thisMonthExpenses, monthTotal]);

//   const topCategory = categories[0];

//   const donutStyle = useMemo(() => {
//     if (categories.length === 0) return { background: "#ece6d9" };
//     let cursor = 0;
//     const stops = categories.map((c) => {
//       const start = cursor;
//       cursor += c.share * 100;
//       return `${c.color} ${start}% ${cursor}%`;
//     });
//     return { background: `conic-gradient(${stops.join(", ")})` };
//   }, [categories]);

//   const remaining = budget - monthTotal;
//   const overBudget = budget > 0 && remaining < 0;
//   const usedPct =
//     budget > 0 ? Math.min(100, Math.round((monthTotal / budget) * 100)) : 0;
//   const filledBlocks = Math.ceil(usedPct / 10);

//   // Chart points.
//   const maxValue = Math.max(1, ...months.map((m) => m.total), avgSpend);
//   const yFor = (value) => CHART_BASE - (value / maxValue) * (CHART_BASE - CHART_TOP);
//   const points = months.map((m, i) => ({ x: CHART_X[i], y: yFor(m.total) }));
//   const pointsAttr = points.map((p) => `${p.x},${p.y.toFixed(1)}`).join(" ");
//   const areaPath = `M ${points
//     .map((p) => `${p.x} ${p.y.toFixed(1)}`)
//     .join(" L ")} L 438 132 L 4 132 Z`;
//   const avgY = yFor(avgSpend).toFixed(1);

//   // Recent list.
//   const filtered = useMemo(() => {
//     const weekStart = new Date(now);
//     weekStart.setDate(now.getDate() - 6);
//     weekStart.setHours(0, 0, 0, 0);

//     return sorted.filter((expense) => {
//       const date = parseExpenseDate(expense.expense_date);
//       if (period === "month") return sameMonth(date, now);
//       if (period === "week") return date >= weekStart && date <= now;
//       return true;
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [sorted, period, now.getMonth(), now.getFullYear()]);

//   const visible = showAll ? filtered : filtered.slice(0, PREVIEW_COUNT);

//   const monthLabel = `${monthShort(now).toUpperCase()} / ${now.getFullYear()}`;
//   const updatedLabel = updatedAt
//     ? `LAST UPDATED · ${updatedAt
//         .toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
//         .toUpperCase()}`
//     : "LAST UPDATED · —";

//   // ---- Shared chrome --------------------------------------------------

//   const header = (
//     <header className="topbar">
//       <a
//         className="brand"
//         href="#top"
//         aria-label="penny dashboard"
//         onClick={(event) => {
//           event.preventDefault();
//           window.scrollTo({ top: 0, behavior: "smooth" });
//         }}
//       >
//         <span>penny</span>
//       </a>

//       <span className="edition-mark" aria-hidden="true">MONEY OS® / 2025</span>

//       <nav className="primary-nav" aria-label="Primary navigation">
//         <button className="nav-item active" type="button" aria-current="page"
//           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
//           Dashboard
//         </button>
//         <button className="nav-item" type="button" onClick={() => scrollToId("recent-expenses")}>
//           Expenses
//         </button>
//         <button className="nav-item" type="button" onClick={() => scrollToId("analytics")}>
//           Analytics
//         </button>
//       </nav>

//       <div className="user-nav">
//         <div className="avatar" aria-hidden="true">{initialsOf(me?.name || "User")}</div>
//         <div className="user-copy">
//           <span>{me?.name || "User"}</span>
//           <small>PERSONAL</small>
//         </div>
//         <button className="logout-button" type="button" onClick={onLogout}>
//           Logout <span aria-hidden="true"></span>
//         </button>
//       </div>
//     </header>
//   );

//   const modal = (
//     <AddExpenseModal open={modalOpen} onClose={closeModal} onSaved={handleSaved} />
//   );

//   const toastNode = toast ? (
//     <div className="ex-toast" role="status" aria-live="polite">
//       {toast}
//     </div>
//   ) : null;

//   if (loading) {
//     return (
//       <div className="fg app-shell">
//         {header}
//         <main id="top">
//           <p className="updated-label" role="status" style={{ padding: "120px 100px" }}>
//             Loading your expenses…
//           </p>
//         </main>
//       </div>
//     );
//   }

//   if (fetchError) {
//     return (
//       <div className="fg app-shell">
//         {header}
//         <main id="top">
//           <div className="empty-state">
//             <span aria-hidden="true">[ ! ]</span>
//             <h3>Couldn’t load.</h3>
//             <p role="alert">{fetchError}</p>
//             <button className="pressable primary-button" type="button" onClick={loadExpenses}>
//               <span>Try again</span>
//               <ArrowIcon />
//             </button>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   // Users with no expenses yet see the empty dashboard from setup.
//   if (expenses.length === 0) {
//     return (
//       <>
//         <EmptyDashboard name={me?.name} onLogout={onLogout} onAdd={openModal} />
//         {modal}
//         {toastNode}
//       </>
//     );
//   }

//   return (
//     <div className="fg app-shell">
//       {header}

//       <main id="top">
//         {/* Hero */}
//         <section className="hero-section">
//           <div className="hero-copy">
//             <div className="system-badge"><span /> Expense system online</div>
//           </div>
//           <div className="hero-action">
//             <div className="hero-readout" aria-label="Current dashboard period">
//               <span>{monthLabel}</span>
//               <span>{expenses.length} ENTRIES</span>
//               <span>INR ₹</span>
//             </div>
//             <button className="pressable primary-button" type="button" onClick={openModal}>
//               <span>+ Add expense</span>
//               <ArrowIcon />
//             </button>
//           </div>
//         </section>

//         {/* Overview */}
//         <section className="overview-section" aria-labelledby="overview-title">
//           <div className="section-heading">
//             <div>
//               <h2 id="overview-title">Money at a glance.</h2>
//             </div>
//             <p className="updated-label">{updatedLabel}</p>
//           </div>

//           <div className="stats-grid">
//             <article className="stat-card main-stat">
//               <div className="card-corner" aria-hidden="true">+</div>
//               <p className="eyebrow">This month</p>
//               <p className="stat-value">{formatRupees(monthTotal)}</p>
//               <p className="stat-caption">Spent this month</p>
//               <div className="progress-copy">
//                 <strong>
//                   {budget === 0
//                     ? "No budget set"
//                     : overBudget
//                     ? `${formatRupees(Math.abs(remaining))} over`
//                     : `${formatRupees(remaining)} remaining`}
//                 </strong>
//                 <span>{usedPct}% used</span>
//               </div>
//               <div className="progress-track" aria-label={`${usedPct} percent of monthly budget used`}>
//                 <span style={{ width: `${usedPct}%` }} />
//               </div>
//             </article>

//             <article className="stat-card budget-stat">
//               <div className="card-corner" aria-hidden="true">+</div>
//               <p className="eyebrow">Monthly budget</p>
//               <p className="stat-value">{budget ? formatRupees(budget) : "Not set"}</p>
//               <div className="budget-visual" aria-hidden="true">
//                 {Array.from({ length: 10 }).map((_, index) => (
//                   <span key={index} className={index < filledBlocks ? "filled" : ""} />
//                 ))}
//               </div>
//               <p className="stat-footnote budget-insight">
//                 <strong>{budget ? `${100 - usedPct}% remaining` : "No budget"}</strong>
//                 <span>
//                   {budget === 0
//                     ? "Set during setup"
//                     : overBudget
//                     ? `${formatRupees(Math.abs(remaining))} over budget`
//                     : `${formatRupees(remaining)} available`}
//                 </span>
//               </p>
//             </article>

//             <article className="stat-card category-stat">
//               <div className="card-corner" aria-hidden="true">+</div>
//               <p className="eyebrow">Top category</p>
//               <p className="stat-value">{topCategory ? topCategory.label : "No data"}</p>
//               <p className="category-amount">
//                 {topCategory ? formatRupees(topCategory.value) : "₹0"}
//               </p>
//               <div className="food-stamp" aria-hidden="true">
//                 {topCategory ? iconFor(topCategory.label) : "·"}
//               </div>
//               <p className="stat-footnote">
//                 {topCategory
//                   ? `${Math.round(topCategory.share * 100)}% OF SPENDING`
//                   : "NO SPENDING YET"}
//               </p>
//             </article>

//             <div className="overview-note" aria-hidden="true">
//               <span>MONTH {now.getMonth() + 1}</span>
//               <strong>KEEP<br />GOING.</strong>
//               <span>{usedPct} / 100</span>
//             </div>
//           </div>
//         </section>

//         {/* Analytics */}
//         <section className="analytics-section" id="analytics" aria-labelledby="analytics-title">
//           <div className="analytics-watermark" aria-hidden="true">SPEND<br />MAP</div>

//           <div className="section-heading analytics-heading">
//             <div>
//               <h2 id="analytics-title">Where the money went.</h2>
//             </div>
//             <div className="chart-legend">
//               <button className="active" type="button" aria-pressed="true">
//                 <i className="legend-lime" /> This month
//               </button>
//               <button
//                 type="button"
//                 aria-pressed={showAvg}
//                 className={showAvg ? "active" : ""}
//                 onClick={() => setShowAvg((value) => !value)}
//               >
//                 <i className="legend-dark" /> Avg. spend
//               </button>
//             </div>
//           </div>

//           <div className="analytics-grid">
//             <article className="chart-panel">
//               <div className="chart-panel-top">
//                 <div>
//                   <p className="eyebrow">Monthly spending</p>
//                   <p className="chart-total">{formatRupees(monthTotal)}</p>
//                 </div>
//                 <span className="trend-tag">
//                   {trendPct === null
//                     ? `NO DATA FOR ${previous.label.toUpperCase()}`
//                     : `${trendUp ? "↑" : "↓"} ${trendPct}% FROM ${previous.label.toUpperCase()}`}
//                 </span>
//               </div>

//               <div className="chart-shell">
//                 <div className="chart-y-labels" aria-hidden="true">
//                   <span>{shortMoney(maxValue)}</span>
//                   <span>{shortMoney(maxValue / 2)}</span>
//                   <span>₹0</span>
//                 </div>
//                 <div className="chart-main">
//                   <svg
//                     className="spending-chart"
//                     viewBox="0 0 442 136"
//                     role="img"
//                     aria-label={`Monthly spending for the last six months. This month ${formatRupees(monthTotal)}, average ${formatRupees(Math.round(avgSpend))}.`}
//                   >
//                     <defs>
//                       <pattern id="chart-grid" width="62" height="34" patternUnits="userSpaceOnUse">
//                         <path d="M 62 0 L 0 0 0 34" fill="none" className="grid-line" />
//                       </pattern>
//                     </defs>
//                     <rect width="442" height="136" fill="url(#chart-grid)" />
//                     <path d={areaPath} className="chart-area" />
//                     {showAvg && (
//                       <line
//                         x1="4"
//                         x2="438"
//                         y1={avgY}
//                         y2={avgY}
//                         stroke="#c8f135"
//                         strokeWidth="2"
//                         strokeDasharray="6 6"
//                       />
//                     )}
//                     <polyline points={pointsAttr} className="chart-line-under" />
//                     <polyline points={pointsAttr} className="chart-line" />
//                     {points.map((p, index) => (
//                       <circle
//                         key={months[index].label + index}
//                         cx={p.x}
//                         cy={p.y}
//                         r="5"
//                         className={index === 5 ? "chart-dot current" : "chart-dot"}
//                       />
//                     ))}
//                   </svg>
//                   <div className="chart-x-labels" aria-hidden="true">
//                     {months.map((m, index) => (
//                       <span key={m.label + index}>{m.label}</span>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </article>

//             <article className="breakdown-panel">
//               <div className="breakdown-title">
//                 <p className="eyebrow">Category breakdown</p>
//                 <span>{monthShort(now).toUpperCase()}</span>
//               </div>

//               <div className="donut-wrap">
//                 <div
//                   className="donut"
//                   role="img"
//                   aria-label={
//                     categories.length
//                       ? categories
//                           .map((c) => `${c.label} ${Math.round(c.share * 100)} percent`)
//                           .join(", ")
//                       : "No spending this month"
//                   }
//                   style={donutStyle}
//                 >
//                   <div>
//                     <span>{categories.length}</span>
//                     <small>CATEGORIES</small>
//                   </div>
//                 </div>
//               </div>

//               <div className="category-list">
//                 {categories.length === 0 ? (
//                   <div><span>No spending this month</span></div>
//                 ) : (
//                   categories.map((c) => (
//                     <div key={c.label}>
//                       <span>
//                         <i style={{ background: c.color }} aria-hidden="true" /> {c.label}
//                       </span>
//                       <strong>{Math.round(c.share * 100)}%</strong>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </article>
//           </div>
//         </section>

//         {/* Recent expenses */}
//         <section className="expenses-section" id="recent-expenses" aria-labelledby="expenses-title">
//           <div className="section-heading expense-heading">
//             <div>
//               <h2 id="expenses-title">Recent expenses.</h2>
//             </div>
//             {expenses.length > 0 && (
//               <div className="filter-tabs" role="group" aria-label="Filter expenses">
//                 {PERIODS.map((item) => (
//                   <button
//                     key={item.id}
//                     type="button"
//                     className={period === item.id ? "active" : ""}
//                     aria-pressed={period === item.id}
//                     onClick={() => {
//                       setPeriod(item.id);
//                       setShowAll(false);
//                     }}
//                   >
//                     {item.label}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {expenses.length === 0 ? (
//             <div className="empty-state">
//               <span aria-hidden="true">[ · · · ]</span>
//               <h3>Nothing spent yet.</h3>
//               <p>Add your first expense and your spending story starts here.</p>
//               <button className="pressable primary-button" type="button" onClick={openModal}>
//                 <span>+ Add first expense</span>
//                 <ArrowIcon />
//               </button>
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="empty-state">
//               <span aria-hidden="true">[ · · · ]</span>
//               <h3>Nothing here.</h3>
//               <p>No expenses in this period.</p>
//             </div>
//           ) : (
//             <div className="expense-list">
//               <div className="list-labels" aria-hidden="true">
//                 <span>Details</span><span>Date</span><span>Amount</span><span />
//               </div>
//               {visible.map((expense, index) => (
//                 <ExpenseRow
//                   key={expense.id}
//                   expense={expense}
//                   index={index}
//                   onRemove={handleRemove}
//                 />
//               ))}
//             </div>
//           )}

//           {filtered.length > PREVIEW_COUNT && (
//             <button className="view-all" type="button" onClick={() => setShowAll((value) => !value)}>
//               {showAll ? "Show fewer" : "View all expenses"} <ArrowIcon />
//             </button>
//           )}
//         </section>
//       </main>

//       <footer className="site-footer">
//         <div className="footer-lead">
//           <h2>Okay, that’s enough<br /><em>money talk.</em></h2>
//           <a className="footer-cta" href="#top">
//             Back to top
//             <span aria-hidden="true">↑</span>
//           </a>
//         </div>

//         <div className="footer-wordmark" aria-label="penny">penny<sup>®</sup></div>

//         <div className="footer-bottom">
//           <div className="footer-note">
//             <strong>penny</strong>
//             <p>A clearer view of where your money goes.</p>
//           </div>
//           <nav className="footer-nav" aria-label="Footer navigation">
//             <a href="#top">Dashboard</a>
//             <a href="#recent-expenses">Expenses</a>
//           </nav>
//           <div className="footer-meta">
//             <span>BUILT FOR BETTER SPENDING</span>
//             <span>© {now.getFullYear()} penny</span>
//           </div>
//         </div>
//       </footer>

//       {modal}
//       {toastNode}
//     </div>
//   );
// }



import { Link } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";

const DEMO_ADD_NOTE = "Create an account to add your own expenses.";
import "../styles/figma.css";
import { api } from "../api/client";
import AddExpenseModal from "../components/AddExpenseModal";
import EmptyDashboard from "../components/EmptyDashboard";
import ExpenseRow from "../components/ExpenseRow";
import { colorFor, iconFor, parseExpenseDate } from "../lib/expense";
import { formatRupees, initialsOf } from "../lib/format";


const PERIODS = [
  { id: "all", label: "All" },
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
];

const PREVIEW_COUNT = 5;

// Chart geometry (matches the Figma viewBox 442 x 136).
const CHART_TOP = 16;
const CHART_BASE = 116;
const CHART_X = [4, 90.8, 177.6, 264.4, 351.2, 438];

const monthShort = (date) => date.toLocaleDateString("en-US", { month: "short" });

const shortMoney = (value) =>
  value >= 1000
    ? `₹${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
    : `₹${Math.round(value)}`;

const sameMonth = (a, b) =>
  a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();

const dayKey = (expense) => String(expense.expense_date).slice(0, 10);

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export default function Dashboard({ me, onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  const [period, setPeriod] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [showAvg, setShowAvg] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState("");
  

  const budget = Number(me?.monthlyBudget) || 0;
  const now = new Date();
  const firstName = me?.name?.split(" ")[0] || "there";

  const loadExpenses = useCallback(async () => {
    try {
      setFetchError("");
      const { data } = await api.get("/expenses");
      setExpenses(Array.isArray(data) ? data : []);
      setUpdatedAt(new Date());
    } catch (error) {
      setFetchError(
        error.response?.data?.message ||
          "We couldn't load your expenses. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  // "N" opens the add dialog when no field has focus.
  useEffect(() => {
    const onKey = (event) => {
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName);
      if (event.key.toLowerCase() === "n" && !typing && !modalOpen) {
        setModalOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const closeModal = useCallback(() => setModalOpen(false), []);
  const openModal = () => setModalOpen(true);

  const handleSaved = () => {
    setModalOpen(false);
    setToast("Expense saved.");
    loadExpenses();
  };

  const handleRemove = async (expense) => {
    try {
      await api.delete(`/expenses/${expense.id}`);
      setExpenses((current) => current.filter((item) => item.id !== expense.id));
      setToast("Expense removed.");
    } catch {
      setToast("Couldn't remove that. Please try again.");
    }
  };

  const scrollToId = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  // ---- Derived numbers ------------------------------------------------

  // Newest first.
  const sorted = useMemo(
    () =>
      [...expenses].sort((a, b) => {
        const byDate = dayKey(b).localeCompare(dayKey(a));
        return byDate !== 0 ? byDate : Number(b.id) - Number(a.id);
      }),
    [expenses]
  );

  // Totals for the last six months, oldest first. The last entry is this month.
  const months = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const start = new Date(now.getFullYear(), now.getMonth() + i - 5, 1);
        const total = expenses.reduce((sum, expense) => {
          const date = parseExpenseDate(expense.expense_date);
          return sameMonth(date, start) ? sum + Number(expense.amount || 0) : sum;
        }, 0);
        return { label: monthShort(start), total };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [expenses, now.getMonth(), now.getFullYear()]
  );

  const current = months[5];
  const previous = months[4];
  const monthTotal = current.total;
  const avgSpend = months.reduce((sum, m) => sum + m.total, 0) / months.length;

  const trendPct =
    previous.total > 0
      ? Math.round((Math.abs(monthTotal - previous.total) / previous.total) * 1000) / 10
      : null;
  const trendUp = monthTotal > previous.total;

  const thisMonthExpenses = useMemo(
    () => sorted.filter((e) => sameMonth(parseExpenseDate(e.expense_date), now)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sorted, now.getMonth(), now.getFullYear()]
  );

  const categories = useMemo(() => {
    const totals = {};
    thisMonthExpenses.forEach((e) => {
      const name = e.category || "Other";
      totals[name] = (totals[name] || 0) + Number(e.amount || 0);
    });
    return Object.entries(totals)
      .map(([label, value]) => ({
        label,
        value,
        color: colorFor(label),
        share: monthTotal > 0 ? value / monthTotal : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [thisMonthExpenses, monthTotal]);

  const topCategory = categories[0];

  const donutStyle = useMemo(() => {
    if (categories.length === 0) return { background: "#ece6d9" };
    let cursor = 0;
    const stops = categories.map((c) => {
      const start = cursor;
      cursor += c.share * 100;
      return `${c.color} ${start}% ${cursor}%`;
    });
    return { background: `conic-gradient(${stops.join(", ")})` };
  }, [categories]);

  const remaining = budget - monthTotal;
  const overBudget = budget > 0 && remaining < 0;
  const usedPct =
    budget > 0 ? Math.min(100, Math.round((monthTotal / budget) * 100)) : 0;
  const filledBlocks = Math.ceil(usedPct / 10);

  // Chart points.
  const maxValue = Math.max(1, ...months.map((m) => m.total), avgSpend);
  const yFor = (value) => CHART_BASE - (value / maxValue) * (CHART_BASE - CHART_TOP);
  const points = months.map((m, i) => ({ x: CHART_X[i], y: yFor(m.total) }));
  const pointsAttr = points.map((p) => `${p.x},${p.y.toFixed(1)}`).join(" ");
  const areaPath = `M ${points
    .map((p) => `${p.x} ${p.y.toFixed(1)}`)
    .join(" L ")} L 438 132 L 4 132 Z`;
  const avgY = yFor(avgSpend).toFixed(1);

  // Recent list.
  const filtered = useMemo(() => {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    return sorted.filter((expense) => {
      const date = parseExpenseDate(expense.expense_date);
      if (period === "month") return sameMonth(date, now);
      if (period === "week") return date >= weekStart && date <= now;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorted, period, now.getMonth(), now.getFullYear()]);

  const visible = showAll ? filtered : filtered.slice(0, PREVIEW_COUNT);

  // ---- Insight, forecast and next move ---------------------------------

  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  // Forecast only after a few days, so one early purchase doesn't skew it.
  const projected =
    dayOfMonth >= 3 && monthTotal > 0
      ? Math.round((monthTotal / dayOfMonth) * daysInMonth)
      : null;

  let insightHeadline;
//   if (trendPct !== null) {
//     insightHeadline = `Spending is ${trendUp ? "up" : "down"} ${trendPct}% from ${previous.label}.`;
//   } else {
//     insightHeadline =
//       monthTotal > 0 ? "Your first month to compare." : "No spending this month yet.";
//   }



if (trendPct !== null) {
  insightHeadline = `Spending is ${trendUp ? "up" : "down"} ${trendPct}% from ${previous.label}.`;
} else {
  insightHeadline =
    monthTotal > 0 ? "Your first month to compare." : "No spending this month yet.";
}
  const insightSupport = topCategory
    ? `${topCategory.label} is ${Math.round(topCategory.share * 100)}% of what you've spent this month.`
    : "Add an expense to see where your money goes.";

  let insightAdvice;
  if (projected === null) {
    insightAdvice = "Give it a few more days and we'll forecast your month-end spend.";
  } else if (budget > 0) {
    insightAdvice =
      projected > budget
        ? `At this pace you'll pass your ${formatRupees(budget)} budget by about ${formatRupees(projected - budget)}.`
        : `At this pace you'll finish near ${formatRupees(projected)}, under your ${formatRupees(budget)} budget.`;
  } else {
    insightAdvice = `At this pace you'll spend about ${formatRupees(projected)} this month.`;
  }

  const tip = overBudget
    ? { title: "Slow down.", footer: `OVER BY ${formatRupees(Math.abs(remaining))}` }
    : topCategory && topCategory.value > 0
    ? {
        title: `Cut ${topCategory.label} by 10%.`,
        footer: `SAVES ${formatRupees(Math.round(topCategory.value * 0.1))}`,
      }
    : { title: "Keep going.", footer: "ADD AN EXPENSE" };

  const monthLabel = `${monthShort(now).toUpperCase()} / ${now.getFullYear()}`;
  const updatedLabel = updatedAt
    ? `LAST UPDATED · ${updatedAt
        .toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
        .toUpperCase()}`
    : "LAST UPDATED · —";

  // ---- Shared chrome --------------------------------------------------

  const header = (
    <header className="topbar">
      <a
        className="brand"
        href="#top"
        aria-label="Penny dashboard"
        onClick={(event) => {
          event.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <span>Penny</span>
      </a>

      <nav className="primary-nav" aria-label="Primary navigation">
        <button className="nav-item active" type="button" aria-current="page"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Dashboard
        </button>
        <button className="nav-item" type="button" onClick={() => scrollToId("recent-expenses")}>
          Expenses
        </button>
        <button className="nav-item" type="button" onClick={() => scrollToId("analytics")}>
          Analytics
        </button>
      </nav>

      <div className="user-nav">
        <Link className="user-nav-button" to="/settings" aria-label="Open settings">
          <div className="avatar" aria-hidden="true">
            {initialsOf(me?.name || "User")}
          </div>
          <div className="user-copy">
            <span>{me?.name || "User"}</span>
            <small>PERSONAL</small>
          </div>
          <span className="profile-chevron">⌄</span>
        </Link>
        <button className="logout-button" type="button" onClick={onLogout}>
          Logout <span aria-hidden="true">↗</span>
        </button>
      </div>
    </header>
  );

  const modal = (
    <AddExpenseModal open={modalOpen} onClose={closeModal} onSaved={handleSaved} />
  );

  const toastNode = toast ? (
    <div className="ex-toast" role="status" aria-live="polite">
      {toast}
    </div>
  ) : null;

  if (loading) {
    return (
      <div className="fg app-shell">
        {header}
        <main id="top">
          <p className="updated-label" role="status" style={{ padding: "120px 100px" }}>
            Loading your expenses…
          </p>
        </main>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="fg app-shell">
        {header}
        <main id="top">
          <div className="empty-state">
            <span aria-hidden="true">[ ! ]</span>
            <h3>Couldn’t load.</h3>
            <p role="alert">{fetchError}</p>
            <button className="pressable primary-button" type="button" onClick={loadExpenses}>
              <span>Try again</span>
              <ArrowIcon />
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Users with no expenses yet see the empty dashboard from setup.
  if (expenses.length === 0) {
    return (
      <>
        <EmptyDashboard name={me?.name} onLogout={onLogout} onAdd={openModal} />
        {modal}
        {toastNode}
      </>
    );
  }

  return (
    <div className="fg app-shell">
      {header}

      <main id="top">
        {/* Hero */}
        <section className="hero-section">
          <div className="hero-copy">
            <div className="system-badge"><span /> Expense system online</div>
            <div className="insight">
              <p className="insight-kicker">This month&apos;s insight</p>
              <h2 className="insight-headline">{insightHeadline}</h2>
              <p className="insight-support">{insightSupport}</p>
              <p className="insight-advice">{insightAdvice}</p>
            </div>
          </div>
          <div className="hero-action">
            <div className="hero-readout" aria-label="Current dashboard period">
              <span>{monthLabel}</span>
              <span>{expenses.length} {expenses.length === 1 ? "ENTRY" : "ENTRIES"}</span>
              <span>INR ₹</span>
            </div>
            <button className="pressable primary-button" type="button" onClick={openModal}>
              <span>+ Add expense</span>
              <ArrowIcon />
            </button>
          </div>
        </section>

        {/* Overview */}
        <section className="overview-section" aria-labelledby="overview-title">
          <div className="section-heading">
            <div>
              <h2 id="overview-title">Money at a glance.</h2>
            </div>
            <p className="updated-label">{updatedLabel}</p>
          </div>

          <div className="stats-grid">
            <article className="stat-card main-stat">
              <p className="eyebrow">This month</p>
              <p className="stat-value">{formatRupees(monthTotal)}</p>
              <p className="stat-caption">Spent this month</p>
              <div className="progress-copy">
                <strong>
                  {budget === 0
                    ? "No budget set"
                    : overBudget
                    ? `${formatRupees(Math.abs(remaining))} over`
                    : `${formatRupees(remaining)} remaining`}
                </strong>
                <span>{usedPct}% used</span>
              </div>
              <div className="progress-track" aria-label={`${usedPct} percent of monthly budget used`}>
                <span style={{ width: `${usedPct}%` }} />
              </div>
            </article>

            <article className="stat-card budget-stat">
              <p className="eyebrow">Monthly budget</p>
              <p className="stat-value">{budget ? formatRupees(budget) : "Not set"}</p>
              <div className="budget-visual" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, index) => (
                  <span key={index} className={index < filledBlocks ? "filled" : ""} />
                ))}
              </div>
              <p className="stat-footnote budget-insight">
                <strong>{budget ? `${100 - usedPct}% remaining` : "No budget"}</strong>
                <span>
                  {budget === 0
                    ? "Set during setup"
                    : overBudget
                    ? `${formatRupees(Math.abs(remaining))} over budget`
                    : `${formatRupees(remaining)} available`}
                </span>
              </p>
            </article>

            <article className="stat-card category-stat">
              <p className="eyebrow">Top category</p>
              <p className="stat-value">{topCategory ? topCategory.label : "No data"}</p>
              <p className="category-amount">
                {topCategory ? formatRupees(topCategory.value) : "₹0"}
              </p>
              <div className="food-stamp" aria-hidden="true">
                {topCategory ? iconFor(topCategory.label) : "·"}
              </div>
              <p className="stat-footnote">
                {topCategory
                  ? `${Math.round(topCategory.share * 100)}% OF SPENDING`
                  : "NO SPENDING YET"}
              </p>
            </article>

            <div className="overview-note">
              <span>NEXT MOVE</span>
              <strong>{tip.title}</strong>
              <span>{tip.footer}</span>
            </div>
          </div>
        </section>

        {/* Analytics */}
        <section className="analytics-section" id="analytics" aria-labelledby="analytics-title">
          <div className="analytics-watermark" aria-hidden="true">SPEND<br />MAP</div>

          <div className="section-heading analytics-heading">
            <div>
              <h2 id="analytics-title">Where the money went.</h2>
            </div>
            <div className="chart-legend">
              <button className="active" type="button" aria-pressed="true">
                <i className="legend-lime" /> This month
              </button>
              <button
                type="button"
                aria-pressed={showAvg}
                className={showAvg ? "active" : ""}
                onClick={() => setShowAvg((value) => !value)}
              >
                <i className="legend-dark" /> Avg. spend
              </button>
            </div>
          </div>

          <div className="analytics-grid">
            <article className="chart-panel">
              <div className="chart-panel-top">
                <div>
                  <p className="eyebrow">Monthly spending</p>
                  <p className="chart-total">{formatRupees(monthTotal)}</p>
                </div>
                <span className="trend-tag">
                  {trendPct === null
                    ? `NO DATA FOR ${previous.label.toUpperCase()}`
                    : `${trendUp ? "↑" : "↓"} ${trendPct}% FROM ${previous.label.toUpperCase()}`}
                </span>
              </div>

              <div className="chart-shell">
                <div className="chart-y-labels" aria-hidden="true">
                  <span>{shortMoney(maxValue)}</span>
                  <span>{shortMoney(maxValue / 2)}</span>
                  <span>₹0</span>
                </div>
                <div className="chart-main">
                  <svg
                    className="spending-chart"
                    viewBox="0 0 442 136"
                    role="img"
                    aria-label={`Monthly spending for the last six months. This month ${formatRupees(monthTotal)}, average ${formatRupees(Math.round(avgSpend))}.`}
                  >
                    <defs>
                      <pattern id="chart-grid" width="62" height="34" patternUnits="userSpaceOnUse">
                        <path d="M 62 0 L 0 0 0 34" fill="none" className="grid-line" />
                      </pattern>
                    </defs>
                    <rect width="442" height="136" fill="url(#chart-grid)" />
                    <path d={areaPath} className="chart-area" />
                    {showAvg && (
                      <line
                        x1="4"
                        x2="438"
                        y1={avgY}
                        y2={avgY}
                        stroke="#c8f135"
                        strokeWidth="2"
                        strokeDasharray="6 6"
                      />
                    )}
                    <polyline points={pointsAttr} className="chart-line-under" />
                    <polyline points={pointsAttr} className="chart-line" />
                    {points.map((p, index) => (
                      <circle
                        key={months[index].label + index}
                        cx={p.x}
                        cy={p.y}
                        r="5"
                        className={index === 5 ? "chart-dot current" : "chart-dot"}
                      />
                    ))}
                  </svg>
                  <div className="chart-x-labels" aria-hidden="true">
                    {months.map((m, index) => (
                      <span key={m.label + index}>{m.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="breakdown-panel">
              <div className="breakdown-title">
                <p className="eyebrow">Category breakdown</p>
                <span>{monthShort(now).toUpperCase()}</span>
              </div>

              <div className="donut-wrap">
                <div
                  className="donut"
                  role="img"
                  aria-label={
                    categories.length
                      ? categories
                          .map((c) => `${c.label} ${Math.round(c.share * 100)} percent`)
                          .join(", ")
                      : "No spending this month"
                  }
                  style={donutStyle}
                >
                  <div>
                    <span>{categories.length}</span>
                    <small>CATEGORIES</small>
                  </div>
                </div>
              </div>

              <div className="category-list">
                {categories.length === 0 ? (
                  <div><span>No spending this month</span></div>
                ) : (
                  categories.map((c) => (
                    <div key={c.label}>
                      <span>
                        <i style={{ background: c.color }} aria-hidden="true" /> {c.label}
                      </span>
                      <strong>{Math.round(c.share * 100)}%</strong>
                    </div>
                  ))
                )}
              </div>
            </article>
          </div>
        </section>

        {/* Recent expenses */}
        <section className="expenses-section" id="recent-expenses" aria-labelledby="expenses-title">
          <div className="section-heading expense-heading">
            <div>
              <h2 id="expenses-title">Recent expenses.</h2>
            </div>
            {expenses.length > 0 && (
              <div className="filter-tabs" role="group" aria-label="Filter expenses">
                {PERIODS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={period === item.id ? "active" : ""}
                    aria-pressed={period === item.id}
                    onClick={() => {
                      setPeriod(item.id);
                      setShowAll(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {expenses.length === 0 ? (
            <div className="empty-state">
              <span aria-hidden="true">[ · · · ]</span>
              <h3>Nothing spent yet.</h3>
              <p>Add your first expense and your spending story starts here.</p>
              <button className="pressable primary-button" type="button" onClick={openModal}>
                <span>+ Add first expense</span>
                <ArrowIcon />
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <span aria-hidden="true">[ · · · ]</span>
              <h3>Nothing here.</h3>
              <p>No expenses in this period.</p>
            </div>
          ) : (
            <div className="expense-list">
              <div className="list-labels" aria-hidden="true">
                <span>Details</span><span>Date</span><span>Amount</span><span />
              </div>
              {visible.map((expense, index) => (
                <ExpenseRow
                  key={expense.id}
                  expense={expense}
                  index={index}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}

          {filtered.length > PREVIEW_COUNT && (
            <button className="view-all" type="button" onClick={() => setShowAll((value) => !value)}>
              {showAll ? "Show fewer" : "View all expenses"} <ArrowIcon />
            </button>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-lead">
          <h2>Okay, that’s enough<br /><em>money talk.</em></h2>
          <a className="footer-cta" href="#top" color="#101110">
            Back to top
            <span aria-hidden="true">↑</span>
          </a>
        </div>

        <div className="footer-wordmark" aria-label="penny">penny<sup>®</sup></div>

        <div className="footer-bottom">
          <div className="footer-note">
            <strong>penny</strong>
            <p>A clearer view of where your money goes.</p>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            {/* <a href="#top">Dashboard</a>
            <a href="#recent-expenses">Expenses</a> */}
          </nav>
          <div className="footer-meta">
            <span>BUILT FOR BETTER SPENDING</span>
            <span>© {now.getFullYear()} penny</span>
          </div>
        </div>
      </footer>

      {modal}
      {toastNode}
    </div>
  );
}

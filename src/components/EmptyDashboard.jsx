// import { AppButton, ArrowIcon } from "./ui";

// // Shown to users who finished setup but have not added any expense yet.
// export default function EmptyDashboard({ name, onLogout }) {
//   return (
//     <div className="app-shell">
//       <header className="topbar">
//         <a className="brand" href="/" aria-label="penny home">
//           <span>penny</span>
//         </a>
//         <span />
//         <span />
//         <div className="user-nav">
//           <div className="user-copy">
//             <span>{name || "Member"}</span>
//             <small>PERSONAL</small>
//           </div>
//           <button className="logout-button" type="button" onClick={onLogout}>
//             Logout <span aria-hidden="true">↗</span>
//           </button>
//         </div>
//       </header>

//       <main>
//         <section className="overview-section" aria-labelledby="empty-title">
//           <div className="section-heading">
//             <div>
//               <h2 id="empty-title">Nothing tracked yet.</h2>
//             </div>
//           </div>

//           <div className="expense-list">
//             <div className="empty-state">
//               <span aria-hidden="true">[ · · · ]</span>
//               <h3>Nothing spent yet.</h3>
//               <p>Add your first expense and your spending story starts here.</p>
//               {/* Quick add is built in the next step. */}
//               <AppButton
//   className="primary-button"
//   onClick={() => alert("Add Expense clicked!")}
// >
//                 + Add your first expense <ArrowIcon />
//               </AppButton>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }






// import { useState } from "react";
// import { AppButton, ArrowIcon } from "./ui";
// import { api } from "../api/client";

// // Shown to users who have finished setup but haven't added an expense.
// export default function EmptyDashboard({ name, onLogout }) {
//   const [showForm, setShowForm] = useState(false);
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("Food");
//   const [expenseDate, setExpenseDate] = useState(
//     new Date().toLocaleDateString("en-CA")
//   );
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   async function handleSubmit(event) {
//     event.preventDefault();
//     setError("");

//     if (!title.trim() || !amount || Number(amount) <= 0 || !category || !expenseDate) {
//       setError("Please fill in all fields with valid values.");
//       return;
//     }

//     try {
//       setLoading(true);

//       await api.post("/expenses", {
//         title: title.trim(),
//         amount: Number(amount),
//         category,
//         expense_date: expenseDate,
//       });

//       alert("Expense added successfully!");
//       window.location.reload();
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Could not save the expense. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="app-shell">
//       <header className="topbar">
//         <a className="brand" href="/" aria-label="penny home">
//           <span>penny</span>
//         </a>
//         <span />
//         <span />
//         <div className="user-nav">
//           <div className="user-copy">
//             <span>{name || "Member"}</span>
//             <small>PERSONAL</small>
//           </div>
//           <button className="logout-button" type="button" onClick={onLogout}>
//             Logout <span aria-hidden="true">↗</span>
//           </button>
//         </div>
//       </header>

//       <main>
//         <section className="overview-section" aria-labelledby="empty-title">
//           <div className="section-heading">
//             <div>
//               <h2 id="empty-title">Nothing tracked yet.</h2>
//             </div>
//           </div>

//           <div className="expense-list">
//             <div className="empty-state">
//               <span aria-hidden="true">[ · · · ]</span>
//               <h3>Nothing spent yet.</h3>
//               <p>Add your first expense and your spending story starts here.</p>

//               {!showForm && (
//                 <AppButton
//                   className="primary-button"
//                   onClick={() => setShowForm(true)}
//                 >
//                   + Add your first expense <ArrowIcon />
//                 </AppButton>
//               )}

//               {showForm && (
//                 <form
//                   onSubmit={handleSubmit}
//                   style={{
//                     maxWidth: "420px",
//                     margin: "24px auto 0",
//                     textAlign: "left",
//                   }}
//                 >
//                   <h3>Add an expense</h3>

//                   <label htmlFor="expense-title">Expense name</label>
//                   <input
//                     id="expense-title"
//                     type="text"
//                     placeholder="e.g. Lunch"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     maxLength={100}
//                     required
//                     style={{ display: "block", width: "100%", margin: "8px 0 16px" }}
//                   />

//                   <label htmlFor="expense-amount">Amount (₹)</label>
//                   <input
//                     id="expense-amount"
//                     type="number"
//                     placeholder="e.g. 250"
//                     value={amount}
//                     onChange={(e) => setAmount(e.target.value)}
//                     min="0.01"
//                     step="0.01"
//                     required
//                     style={{ display: "block", width: "100%", margin: "8px 0 16px" }}
//                   />

//                   <label htmlFor="expense-category">Category</label>
//                   <select
//                     id="expense-category"
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     required
//                     style={{ display: "block", width: "100%", margin: "8px 0 16px" }}
//                   >
//                     <option value="Food">Food</option>
//                     <option value="Transport">Transport</option>
//                     <option value="Shopping">Shopping</option>
//                     <option value="Bills">Bills</option>
//                     <option value="Entertainment">Entertainment</option>
//                     <option value="Health">Health</option>
//                     <option value="Education">Education</option>
//                     <option value="Other">Other</option>
//                   </select>

//                   <label htmlFor="expense-date">Date</label>
//                   <input
//                     id="expense-date"
//                     type="date"
//                     value={expenseDate}
//                     onChange={(e) => setExpenseDate(e.target.value)}
//                     required
//                     style={{ display: "block", width: "100%", margin: "8px 0 16px" }}
//                   />

//                   {error && (
//                     <p role="alert" style={{ color: "crimson" }}>
//                       {error}
//                     </p>
//                   )}

//                   <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
//                     <button
//                       type="submit"
//                       className="primary-button"
//                       disabled={loading}
//                     >
//                       {loading ? "Saving..." : "Save expense"}
//                     </button>

//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShowForm(false);
//                         setError("");
//                       }}
//                       disabled={loading}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               )}
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }


import { Link } from "react-router-dom";
import { AppButton, ArrowIcon } from "./ui";
import "../styles/figma.css";

// Shown to users who finished setup but have not added any expense yet.
export default function EmptyDashboard({ name, onLogout, onAdd }) {
  return (
    <div className="fg app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="penny home">
          <span>penny</span>
        </a>
        <span />
        <span />
        {/* <div className="user-nav">
          <div className="user-copy">
            <span>{name || "Member"}</span>
            <small>PERSONAL</small>
          </div>
          <button className="logout-button" type="button" onClick={onLogout}>
            Logout <span aria-hidden="true">↗</span>
          </button>
        </div> */}
        <Link className="user-nav-button" to="/settings" aria-label="Open settings">
  <div className="user-copy">
    <span>{name || "Member"}</span>
    <small>PERSONAL</small>
  </div>
</Link>
      </header>

      <main>
        <section className="overview-section" aria-labelledby="empty-title">
          <div className="section-heading">
            <div>
              <h2 id="empty-title">Nothing tracked yet.</h2>
            </div>
          </div>

          <div className="expense-list">
            <div className="empty-state">
              <span aria-hidden="true">[ · · · ]</span>
              <h3>Nothing spent yet.</h3>
              <p>Add your first expense and your spending story starts here.</p>
              <AppButton className="primary-button" onClick={onAdd}>
                + Add your first expense <ArrowIcon />
              </AppButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
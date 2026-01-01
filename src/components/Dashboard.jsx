// import { useState } from "react";

// function Dashboard() {
//   const [expenses, setExpenses] = useState([
//     { id: 1, title: "Food", amount: 250, date: "2025-04-18", category: "Food" },
//     { id: 2, title: "Transport", amount: 120, date: "2025-04-17", category: "Travel" },
//     { id: 3, title: "Shopping", amount: 1450, date: "2025-04-15", category: "Shopping" },
//   ]);

//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");

//   const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

//   const addExpense = () => {
//     if (!title || !amount) return;

//     setExpenses([
//       ...expenses,
//       {
//         id: Date.now(),
//         title,
//         amount: Number(amount),
//         date: new Date().toISOString().split("T")[0],
//         category: "General",
//       },
//     ]);

//     setTitle("");
//     setAmount("");
//   };

//   const deleteExpense = (id) => {
//     setExpenses(expenses.filter((e) => e.id !== id));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-8 py-12">
//       <div className="max-w-5xl mx-auto">
        
//         {/* Header */}
//         <h1 className="text-3xl font-semibold text-gray-900 mb-2">
//           Expense Dashboard
//         </h1>
//         <p className="text-gray-500 mb-8">
//           Track and manage your daily expenses
//         </p>

//         {/* Stats */}
//         <div className="grid grid-cols-3 gap-6 mb-10">
//           <StatCard label="Total Spent" value={`₹ ${totalSpent}`} />
//           <StatCard label="Transactions" value={expenses.length} />
//           <StatCard label="Month" value="April" />
//         </div>

//         {/* Add Expense */}
//         <div className="bg-white rounded-2xl shadow p-6 mb-10">
//           <h3 className="font-medium mb-4">Add New Expense</h3>

//           <div className="flex gap-4">
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Title"
//               className="flex-1 p-3 border rounded-xl"
//             />

//             <input
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               placeholder="Amount"
//               type="number"
//               className="w-40 p-3 border rounded-xl"
//             />

//             <button
//               onClick={addExpense}
//               className="px-6 py-3 bg-gray-900 text-white rounded-xl"
//             >
//               Add
//             </button>
//           </div>
//         </div>

//         {/* Expense List */}
//         <div className="bg-white rounded-2xl shadow overflow-hidden">
//           <div className="px-6 py-4 border-b font-medium">
//             Recent Expenses
//           </div>

//           {expenses.length === 0 ? (
//             <p className="p-6 text-gray-500">No expenses yet.</p>
//           ) : (
//             expenses.map((e) => (
//               <ExpenseRow
//                 key={e.id}
//                 expense={e}
//                 onDelete={deleteExpense}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
// function StatCard({ label, value }) {
//     return (
//       <div className="bg-white rounded-2xl shadow p-6">
//         <p className="text-sm text-gray-500">{label}</p>
//         <h3 className="text-2xl font-semibold mt-2">{value}</h3>
//       </div>
//     );
//   }
  
//   function ExpenseRow({ expense, onDelete }) {
//     return (
//       <div className="flex items-center justify-between px-6 py-4 border-b last:border-none">
//         <div>
//           <p className="font-medium">{expense.title}</p>
//           <p className="text-sm text-gray-500">{expense.date}</p>
//         </div>
  
//         <div className="flex items-center gap-6">
//           <span className="font-medium">₹ {expense.amount}</span>
//           <button
//             onClick={() => onDelete(expense.id)}
//             className="text-red-500 hover:text-red-700"
//           >
//             ✕
//           </button>
//         </div>
//       </div>
//     );
//   }
  

// export default Dashboard;




import api from "../api";

import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

/* ------------------ COLORS ------------------ */
const PIE_COLORS = {
  Grocery: "#bbf7d0",
  Food: "#fecaca",
  Shopping: "#fed7aa",
  Travel: "#c7d2fe",
  Bills: "#e9d5ff",
  General: "#e2e8f0",
};

const MONTHLY_BUDGET = 25000;

/* ------------------ NORMALIZER ------------------ */
const normalizeExpenses = (data) =>
  data.map((e) => ({
    ...e,
    date: e.expense_date,
  }));

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [sort, setSort] = useState("LATEST");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("General");

  /* ---------------- LOAD ---------------- */
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/expenses");
      const normalized = res.data.map((e) => ({
        ...e,
        amount: Number(e.amount),
        date: e.expense_date.split("T")[0],
      }));
      setExpenses(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchExpenses();
  }, []);
    
  

  /* ---------------- FILTER ---------------- */
  const filteredExpenses = useMemo(() => {
    const now = new Date();

    return expenses.filter((e) => {
      const d = new Date(e.date);

      if (filter === "WEEK") {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        return d >= start;
      }

      if (filter === "MONTH") {
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }

      return true;
    });
  }, [expenses, filter]);
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }
  

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sort === "HIGHEST") return b.amount - a.amount;
    return new Date(b.date) - new Date(a.date);
  });

  const totalSpent = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const balanceLeft = MONTHLY_BUDGET - totalSpent;

  /* ---------------- CATEGORY TOTALS ---------------- */
  const categoryTotals = {};
  filteredExpenses.forEach((e) => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;
  });

  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  /* ---------------- ACTIONS ---------------- */
  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("General");
    setEditing(null);
    setShowForm(false);
  };

  const refetchExpenses = async () => {
    const res = await api.get("/expenses");
    setExpenses(normalizeExpenses(res.data));
  };

  const saveExpense = async () => {
    if (!title || !amount) return;
  
    try {
      if (editing) {
        await api.put(`/expenses/${editing.id}`, {
          title,
          amount,
          category,
          expense_date: new Date().toISOString().split("T")[0],
        });
      } else {
        await api.post("/expenses", {
          title,
          amount,
          category,
          expense_date: new Date().toISOString().split("T")[0],
        });
      }
  
      await fetchExpenses();   // 🔥 THIS WAS MISSING
      resetForm();
    } catch (err) {
      console.error("Save failed", err.response?.data || err.message);
    }
  };
  

  const deleteExpense = async () => {
    if (!editing) return;
  
    try {
      console.log("DELETE BUTTON CLICKED");
      console.log("Deleting expense id:", editing.id);  
      await api.delete(`/expenses/${editing.id}`);
      console.log("DELETE success, refetching");
      await fetchExpenses();   // 🔥 SAME FIX
      resetForm();
    } catch (err) {
      console.error("Delete failed", err.response?.data || err.message);
    }
  };
  

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#f2f2f2] px-10 py-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex items-center justify-between">
  {/* Left: Greeting */}
  <div>
    <h1 className="text-gray-700 text-4xl">
      hello <span className="font-semibold">user</span>,
    </h1>
    <p className="text-gray-500">
      Here’s your expense snapshot for this month
    </p>
  </div>

  {/* Right: Logout */}
  <button
    onClick={() => {
      localStorage.removeItem("token");
      window.location.href = "/";
    }}
    className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition font-medium"
  >
    <LogoutIcon />
    <span>Logout</span>
  </button>
</div>


        {/* STATS */}
        <div className="grid grid-cols-3 gap-6">
          <StatCard title="balance left" value={`₹ ${balanceLeft}`} bg="#ecfccb" />
          <StatCard title="total spent" value={`₹ ${totalSpent}`} bg="#fee2e2" />
          <StatCard title="monthly budget" value={`₹ ${MONTHLY_BUDGET}`} bg="#e5e7eb" />
        </div>

        {/* FILTER + ADD */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {["ALL", "WEEK", "MONTH"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-full text-sm ${
                  filter === f ? "bg-lime-300" : "bg-gray-300"
                }`}
              >
                {f === "ALL" ? "All" : f === "WEEK" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2 rounded-full bg-black text-white"
          >
            + Add Expense
          </button>
        </div>

        {/* PIE CHART */}
        <div className="bg-white rounded-xl p-10 min-h-[350px]">
          {chartData.length === 0 ? (
            <EmptyState />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  innerRadius={90}
                  outerRadius={130}
                >
                  {chartData.map((c) => (
                    <Cell key={c.name} fill={PIE_COLORS[c.name]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* TRANSACTIONS */}
        <div className="bg-white rounded-xl">
          <div className="flex justify-between px-6 py-4 border-b">
            <span className="font-medium">Recent Transactions</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-gray-200 rounded px-2 text-sm"
            >
              <option value="LATEST">Latest</option>
              <option value="HIGHEST">Highest</option>
            </select>
          </div>

          {sortedExpenses.map((e) => (
            <div key={e.id} className="flex justify-between px-6 py-4 border-b">
              <div>
                <p className="font-medium">{e.title}</p>
                <p className="text-xs text-gray-500">
                  {e.category} • {e.date}
                </p>
              </div>

              <div className="flex gap-4 items-center">
                <span>₹ {e.amount}</span>
                <button
                  onClick={() => {
                    setEditing(e);
                    setTitle(e.title);
                    setAmount(e.amount);
                    setCategory(e.category);
                    setShowForm(true);
                  }}
                >
                  ✎
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[420px] space-y-4 relative">
              <button
                onClick={resetForm}
                className="absolute top-3 right-3"
              >
                ✕
              </button>

              <h3 className="font-medium">
                {editing ? "Edit Expense" : "Add Expense"}
              </h3>

              <input
                className="w-full border p-3 rounded"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                type="number"
                className="w-full border p-3 rounded"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border p-3 rounded"
              >
                {Object.keys(PIE_COLORS).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  onClick={saveExpense}
                  className="flex-1 py-2 bg-black text-white rounded"
                >
                  Save
                </button>

                {editing && (
                  <button
                    onClick={deleteExpense}
                    className="flex-1 py-2 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ title, value, bg }) {
  return (
    <div className="rounded-xl p-5" style={{ background: bg }}>
      <p className="text-xs uppercase text-gray-500">{title}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center text-gray-500">
      No expenses yet. Add one to begin 💸
    </div>
  );
}
function LogoutIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}







// import { useEffect, useMemo, useState } from "react";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// /* ------------------ COLOR SYSTEM ------------------ */
// const COLORS = {
//   lime: "#84cc16",
//   text: "#111827",
//   muted: "#6b7280",
//   divider: "#e5e7eb",
// };

// /* Slightly darker pastel tones */
// const PIE_COLORS = {
  
//   Grocery: "#bbf7d0",
//   Food: "#fecaca",
//   Shopping: "#fed7aa",
//   Travel: "#c7d2fe",
//   Bills: "#e9d5ff",
//   General: "#e2e8f0",
// };

// const CATEGORY_BAR = {
//   Grocery: "#22c55e",
//   Food: "#ef4444",
//   Shopping: "#fb923c",
//   Travel: "#6366f1",
//   Bills: "#a855f7",
//   General: "#64748b",
// };

// const MONTHLY_BUDGET = 25000;

// export default function Dashboard() {
//   const [expenses, setExpenses] = useState([]);
//   const [filter, setFilter] = useState("MONTH");
//   const [sort, setSort] = useState("LATEST");

//   const [showForm, setShowForm] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [title, setTitle] = useState("");
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("General");

//   /* ---------------- LOAD ---------------- */
//   useEffect(() => {
//     setExpenses(JSON.parse(localStorage.getItem("expenses")) || []);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("expenses", JSON.stringify(expenses));
//   }, [expenses]);

//   /* ---------------- FILTER ---------------- */
//   const filteredExpenses = useMemo(() => {
//     const now = new Date();
//     return expenses.filter((e) => {
//       const d = new Date(e.date);
//       if (filter === "WEEK") {
//         const start = new Date(now);
//         start.setDate(now.getDate() - now.getDay());
//         return d >= start;
//       }
//       if (filter === "MONTH") {
//         return (
//           d.getMonth() === now.getMonth() &&
//           d.getFullYear() === now.getFullYear()
//         );
//       }
//       return true;
//     });
//   }, [expenses, filter]);

//   const sortedExpenses = [...filteredExpenses].sort((a, b) => {
//     if (sort === "HIGHEST") return b.amount - a.amount;
//     return new Date(b.date) - new Date(a.date);
//   });

//   const totalSpent = filteredExpenses.reduce((s, e) => s + e.amount, 0);
//   const balanceLeft = MONTHLY_BUDGET - totalSpent;

//   /* ---------------- CATEGORY TOTALS ---------------- */
//   const categoryTotals = {};
//   filteredExpenses.forEach((e) => {
//     categoryTotals[e.category] =
//       (categoryTotals[e.category] || 0) + e.amount;
//   });

//   const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
//     name,
//     value,
//   }));

//   /* ---------------- ACTIONS ---------------- */
//   const resetForm = () => {
//     setTitle("");
//     setAmount("");
//     setCategory("General");
//     setEditing(null);
//     setShowForm(false);
//   };

//   const saveExpense = () => {
//     if (!title || !amount) return;
//     if (editing) {
//       setExpenses(
//         expenses.map((e) =>
//           e.id === editing.id
//             ? { ...e, title, amount: +amount, category }
//             : e
//         )
//       );
//     } else {
//       setExpenses([
//         {
//           id: Date.now(),
//           title,
//           amount: +amount,
//           category,
//           date: new Date().toISOString().split("T")[0],
//         },
//         ...expenses,
//       ]);
//     }
//     resetForm();
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="min-h-screen bg-[#f2f2f2] px-10 py-8">
//       <div className="max-w-7xl mx-auto space-y-10">

//         {/* HEADER */}
//         <div className=" mx-auto space-y-10">
//           <h1 className="text-gray-700 text-4xl">
//             hello <span className="font-semibold">user</span>,
//           </h1>
//           <p className="text-gray-500">
//             Here’s your expense snapshot for this month
//           </p>
//           </div>
//           {/* Home icon
//           <button className="text-gray-600 hover:text-black">
//             <svg
//               width="20"
//               height="20"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <path d="M3 9l9-7 9 7" />
//               <path d="M9 22V12h6v10" />
//             </svg>
//           </button> */}
//         {/* </div> */}

        
//         {/* TOP CARDS */}
//         <div className="grid grid-cols-3 gap-6">
//           <StatCard title="total balance left" value={`₹ ${balanceLeft}`} bg="#ecfccb" />
//           <StatCard title="total expenses" value={`₹ ${totalSpent}`} bg="#fee2e2" />
//           <StatCard title="monthly budget" value={`₹ ${MONTHLY_BUDGET}`} bg="#c2c2c2" />
//         </div>

//         {/* FILTERS */}
//         <div className="flex justify-between items-center">
//           <div className="flex gap-2">
//             {["ALL", "WEEK", "MONTH"].map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setFilter(f)}
//                 className={`px-5 py-2 rounded-full text-sm ${
//                   filter === f
//                     ? "bg-[#c6f87b] text-black"
//                     : "bg-gray-300 text-gray-700"
//                 }`}
//               >
//                 {f === "ALL" ? "All" : f === "WEEK" ? "This Week" : "This Month"}
//               </button>
//             ))}
//           </div>
//           {/* ADD EXPENSE */}
//         <div className="flex justify-end">
//           <button
//             onClick={() => setShowForm(true)}
//             className="px-5 py-2 rounded-full bg-black text-white text-sm"
//           >
//             + Add Expense
//           </button>
//         </div>
//         </div>

//         {/* PIE CHART */}
//         <div className="bg-white rounded-xl p-10 h-[380px] flex items-center justify-center">
//           {chartData.length === 0 ? (
//             <EmptyState />
//           ) : (
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={chartData}
//                   dataKey="value"
//                   innerRadius={105}
//                   outerRadius={145}
//                 >
//                   {chartData.map((c) => (
//                     <Cell key={c.name} fill={PIE_COLORS[c.name]} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{
//                     background: "#111827",
//                     borderRadius: "8px",
//                     border: "none",
//                     color: "white",
//                   }}
//                   formatter={(v, _, p) => [`₹ ${v}`, p.payload.name]}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           )}
//         </div>

//         {/* CATEGORY CARDS */}
//         <div className="grid grid-cols-3 gap-6">
//           {chartData.map((c) => (
//             <div
//               key={c.name}
//               className="rounded-xl p-5"
//               style={{ background: PIE_COLORS[c.name] }}
//             >
//               <p className="text-sm text-gray-600">{c.name}</p>
//               <p className="text-xl font-semibold">₹ {c.value}</p>
//               <div className="mt-3 h-2 bg-black/20 rounded-full">
//                 <div
//                   className="h-2 rounded-full"
//                   style={{
//                     width: `${(c.value / MONTHLY_BUDGET) * 100}%`,
//                     background: CATEGORY_BAR[c.name],
//                   }}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* TRANSACTIONS */}
//         <div className="bg-white rounded-xl">
//           <div className="flex justify-between px-6 py-4 border-b">
//             <span className="font-medium">Recent Transaction</span>
//             <select
//               value={sort}
//               onChange={(e) => setSort(e.target.value)}
//               className="bg-gray-200 rounded px-2 text-sm"
//             >
//               <option value="LATEST">Latest</option>
//               <option value="HIGHEST">Highest</option>
//             </select>
//           </div>

//           {sortedExpenses.map((e) => (
//             <div key={e.id} className="flex justify-between px-6 py-4 border-b group">
//               <div>
//                 <p className="font-medium">{e.title}</p>
//                 <p className="text-xs text-gray-500">
//                   {e.category} • {e.date}
//                 </p>
//               </div>
//               <div className="flex items-center gap-4">
//                 <span>₹ {e.amount}</span>
//                 <button
//                   onClick={() => {
//                     setEditing(e);
//                     setTitle(e.title);
//                     setAmount(e.amount);
//                     setCategory(e.category);
//                     setShowForm(true);
//                   }}
//                   className="text-xs text-gray-500 opacity-0 group-hover:opacity-100"
//                 >
//                   Edit
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* ADD / EDIT MODAL */}
//         {showForm && (
//           <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
//             <div className="bg-white rounded-xl p-6 w-[420px] space-y-4 relative">
//               <button
//                 onClick={resetForm}
//                 className="absolute top-3 right-3 text-gray-400 hover:text-black"
//               >
//                 ✕
//               </button>

//               <h3 className="font-medium">
//                 {editing ? "Edit Expense" : "Add Expense"}
//               </h3>

//               <input
//                 className="w-full border p-3 rounded"
//                 placeholder="Title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//               />

//               <input
//                 type="number"
//                 className="w-full border p-3 rounded"
//                 placeholder="₹ Amount"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//               />

//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="w-full border p-3 rounded"
//               >
//                 {Object.keys(PIE_COLORS).map((c) => (
//                   <option key={c}>{c}</option>
//                 ))}
//               </select>

//               <button
//                 onClick={saveExpense}
//                 className="w-full py-2 rounded bg-black text-white"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ---------------- COMPONENTS ---------------- */

// function StatCard({ title, value, bg }) {
//   return (
//     <div className="rounded-xl p-5" style={{ background: bg }}>
//       <p className="text-sm text-gray-500">{title}</p>
//       <p className="text-xl font-semibold">{value}</p>
//     </div>
//   );
// }

// function EmptyState() {
//   return (
//     <div className="text-center text-gray-500">
//       You haven’t added any expenses yet.
//       <br />
//       Start tracking to see where your money goes 💸
//     </div>
//   );
// }

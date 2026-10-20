// Placeholder data. Replaced by API responses in the next step.
const expenses = [
    { id: 1, category: "Food", title: "Dinner", amount: 450, date: "Oct 4", day: 4, icon: "🍔" },
    { id: 2, category: "Transport", title: "Uber", amount: 220, date: "Oct 3", day: 3, icon: "🚕" },
    { id: 3, category: "Shopping", title: "Canvas tote", amount: 1200, date: "Oct 2", day: 2, icon: "🛍" },
    { id: 4, category: "Food", title: "Morning coffee", amount: 180, date: "Sep 29", day: 29, icon: "☕" },
];

const chartPoints = "4,116 66,91 128,101 190,56 252,70 314,29 376,48 438,20";

const chartArea = `M ${chartPoints.replaceAll(" ", " L ")} L 438 132 L 4 132 Z`;

const defaultCategories = [
    "Food",
    "Grocery",
    "Shopping",
    "Travel",
    "Bills",
    "Entertainment",
    "Education",
    "Health",
    "Other",
];

export { expenses, chartPoints, chartArea, defaultCategories };
export function makeInitialSubscription() {
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  const iso = (d) => d.toISOString().split("T")[0];
  return {
    name: "",
    amount: "",
    billingCycle: "MONTHLY",
    category: "Entertainment",
    startDate: iso(today),
    nextPayment: iso(nextMonth),
    validity: "NO EXPIRY",
    validUntil: "",
    status: "ACTIVE",
    notes: "",
  };
}

function DemoDashboard() {
  return (
    <section >
      {/* Section intro */}
      {/* <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
          Demo Dashboard Preview
        </p>
        <h2 className="text-3xl font-semibold text-gray-900 mb-3">
          Your Expenses, Clearly Organized
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          A snapshot of how your spending looks once you log in.
        </p>
      </div> */}

      <div className="flex justify-center">
        <div
          className="w-full max-w-7xl rounded-3xl bg-white shadow-2xl border overflow-hidden"
          style={{ transform: "scale(0.95)", opacity: 0.9 }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-900">Expense Tracker</h3>
            <span className="text-sm text-gray-500">April 2025</span>
          </div>

          <div className="p-8 bg-lime-100">
            <div className="grid grid-cols-3 gap-6 mb-8">
              <StatCard title="Total Spent" value="₹12,450" />
              <StatCard title="Categories" value="6" />
              <StatCard title="Transactions" value="24" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <ChartPlaceholder title="Spending by Category" />
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <p className="text-sm text-gray-500 mb-4">Recent Expenses</p>
                <div className="space-y-3">
                  <ExpenseRow title="Food" amount="₹250" />
                  <ExpenseRow title="Transport" amount="₹120" />
                  <ExpenseRow title="Shopping" amount="₹1,450" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* helpers */
function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function ChartPlaceholder({ title }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm h-44 flex flex-col">
      <p className="text-sm text-gray-500 mb-3">{title}</p>
      <div className="flex-1 bg-gray-200 rounded-lg opacity-40" />
    </div>
  );
}

function ExpenseRow({ title, amount }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{title}</span>
      <span className="font-medium text-gray-900">{amount}</span>
    </div>
  );
}

export default DemoDashboard;

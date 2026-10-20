
function SpendingChart({ expenses = [] }) {
    const monthLabels = [];
    const monthlyTotals = [];
  
    // Get the current month and previous five months.
    const today = new Date();
  
    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() - i,
        1
      );
  
      monthLabels.push(
        date.toLocaleDateString("en-IN", { month: "short" })
      );
  
      const total = expenses.reduce((sum, expense) => {
        const expenseDate = new Date(
          `${expense.expense_date}T00:00:00`
        );
  
        if (
          expenseDate.getMonth() === date.getMonth() &&
          expenseDate.getFullYear() === date.getFullYear()
        ) {
          return sum + Number(expense.amount || 0);
        }
  
        return sum;
      }, 0);
  
      monthlyTotals.push(total);
    }
  
    // Scale chart values to fit the SVG.
    const chartWidth = 442;
    const chartHeight = 116;
    const chartTop = 10;
    const chartBottom = 126;
  
    const maxValue = Math.max(...monthlyTotals, 1000);
    const roundedMax = Math.ceil(maxValue / 1000) * 1000;
  
    const points = monthlyTotals.map((total, index) => {
      const x =
        (index / (monthlyTotals.length - 1)) * chartWidth;
  
      const y =
        chartBottom - (total / roundedMax) * chartHeight;
  
      return { x, y, total };
    });
  
    const chartPoints = points
      .map((point) => `${point.x},${point.y}`)
      .join(" ");
  
    const chartArea = [
      `M ${points[0].x},${chartBottom}`,
      ...points.map((point) => `L ${point.x},${point.y}`),
      `L ${points[points.length - 1].x},${chartBottom}`,
      "Z",
    ].join(" ");
  
    const formatAxisValue = (value) => {
      if (value >= 1000) {
        return `₹${value / 1000}K`;
      }
  
      return `₹${value}`;
    };
  
    return (
      <div className="chart-shell">
        <div className="chart-y-labels" aria-hidden="true">
          <span>{formatAxisValue(roundedMax)}</span>
          <span>{formatAxisValue(roundedMax / 2)}</span>
          <span>₹0</span>
        </div>
  
        <div className="chart-main">
          <svg
            className="spending-chart"
            viewBox="0 0 442 136"
            role="img"
            aria-label="Monthly expenses over the last six months"
          >
            <defs>
              <pattern
                id="chart-grid"
                width="62"
                height="34"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 62 0 L 0 0 0 34"
                  fill="none"
                  className="grid-line"
                />
              </pattern>
            </defs>
  
            <rect
              width="442"
              height="136"
              fill="url(#chart-grid)"
            />
  
            <path d={chartArea} className="chart-area" />
  
            <polyline
              points={chartPoints}
              className="chart-line-under"
            />
  
            <polyline
              points={chartPoints}
              className="chart-line"
            />
  
            {points.map((point, index) => (
              <circle
                key={`${monthLabels[index]}-${index}`}
                cx={point.x}
                cy={point.y}
                r="4"
                className={
                  index === points.length - 1
                    ? "chart-dot current"
                    : "chart-dot"
                }
              />
            ))}
          </svg>
  
          <div className="chart-x-labels" aria-hidden="true">
            {monthLabels.map((month, index) => (
              <span key={`${month}-${index}`}>{month}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  export default SpendingChart;
  
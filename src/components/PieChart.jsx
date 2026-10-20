import { formatRupees } from "../lib/format";

const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = 112;

function slicePath(startAngle, endAngle) {
  const point = (angle) => [
    CENTER + RADIUS * Math.cos(angle),
    CENTER + RADIUS * Math.sin(angle),
  ];
  const [x1, y1] = point(startAngle);
  const [x2, y2] = point(endAngle);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

// slices: [{ label, value, color }], already sorted largest first.
export default function PieChart({ slices, total }) {
  let angle = -Math.PI / 2; // start at 12 o'clock

  const drawn = slices.map((slice) => {
    const start = angle;
    angle += (slice.value / total) * Math.PI * 2;

    return {
      ...slice,
      start,
      end: angle,
      share: Math.round((slice.value / total) * 100),
    };
  });

  const summary = drawn
    .map((slice) => `${slice.label} ${slice.share}%`)
    .join(", ");

  return (
    <div className="ex-pie">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`Spending by category: ${summary}`}
        className="ex-pie-svg"
      >
        {drawn.length === 1 ? (
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill={drawn[0].color}
            stroke="#111"
            strokeWidth="3"
          />
        ) : (
          drawn.map((slice) => (
            <path
              key={slice.label}
              d={slicePath(slice.start, slice.end)}
              fill={slice.color}
              stroke="#111"
              strokeWidth="3"
              strokeLinejoin="round"
            />
          ))
        )}
      </svg>

      <ul className="ex-legend">
        {drawn.map((slice) => (
          <li key={slice.label}>
            <span
              className="ex-swatch"
              style={{ background: slice.color }}
              aria-hidden="true"
            />
            <span className="ex-legend-label">{slice.label}</span>
            <span className="ex-legend-share">{slice.share}%</span>
            <span className="ex-legend-amount">
              {formatRupees(Math.round(slice.value))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
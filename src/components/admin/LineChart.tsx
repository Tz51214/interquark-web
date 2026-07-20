interface LineChartProps {
  data: { label: string; value: number }[];
}

export default function LineChart({ data }: LineChartProps) {
  const width = 700;
  const height = 220;
  const padding = 30;
  const max = Math.max(1, ...data.map((d) => d.value));

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.value / max) * (height - padding * 2);
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? 0} ${height - padding} L ${points[0]?.x ?? 0} ${height - padding} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full">
      <path d={areaPath} className="fill-blue-600/10" />
      <path d={linePath} fill="none" className="stroke-blue-600" strokeWidth={2.5} />
      {points.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r={3.5} className="fill-blue-600" />
          <text
            x={p.x}
            y={height + 14}
            textAnchor="middle"
            className="fill-slate-400 text-[10px]"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

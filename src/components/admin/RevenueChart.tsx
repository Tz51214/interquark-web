interface RevenueChartProps {
  data: { label: string; value: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const width = 700;
  const height = 220;
  const barGap = 12;
  const barWidth = data.length > 0 ? (width - barGap * (data.length - 1)) / data.length : 0;

  return (
    <svg viewBox={`0 0 ${width} ${height + 30}`} className="w-full">
      {data.map((d, i) => {
        const barHeight = (d.value / max) * height;
        const x = i * (barWidth + barGap);
        const y = height - barHeight;
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={4}
              className="fill-blue-600"
            />
            <text
              x={x + barWidth / 2}
              y={height + 18}
              textAnchor="middle"
              className="fill-slate-400 text-[10px]"
            >
              {d.label}
            </text>
            <text
              x={x + barWidth / 2}
              y={y - 6}
              textAnchor="middle"
              className="fill-slate-600 text-[10px] font-semibold dark:fill-slate-300"
            >
              £{d.value.toLocaleString()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

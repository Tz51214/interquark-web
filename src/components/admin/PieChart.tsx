interface PieChartProps {
  data: { label: string; value: number; color: string }[];
}

export default function PieChart({ data }: PieChartProps) {
  const total = Math.max(1, data.reduce((sum, d) => sum + d.value, 0));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="flex items-center gap-8">
      <svg viewBox="0 0 180 180" className="h-40 w-40 flex-shrink-0">
        <g transform="rotate(-90 90 90)">
          {data.map((d) => {
            const fraction = d.value / total;
            const dash = fraction * circumference;
            const segment = (
              <circle
                key={d.label}
                cx={90}
                cy={90}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={26}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return segment;
          })}
        </g>
      </svg>
      <div className="flex flex-col gap-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="capitalize text-slate-600 dark:text-slate-300">{d.label}</span>
            <span className="font-mono font-semibold text-slate-400">
              {d.value} ({total > 0 ? Math.round((d.value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NotificationToggle({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg px-2 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-lg">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-ink dark:text-slate-100">{label}</p>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-all duration-200 ${
          checked
            ? "bg-signal shadow-[0_0_0_3px_rgba(91,95,239,0.15)]"
            : "bg-slate-300 dark:bg-slate-600"
        }`}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

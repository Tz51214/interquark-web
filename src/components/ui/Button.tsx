import { useState, type ButtonHTMLAttributes, type ReactNode, type MouseEvent } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-signal text-white hover:bg-signal-dark disabled:opacity-60 disabled:cursor-not-allowed",
  secondary:
    "bg-white text-ink border border-slate-300 hover:border-signal hover:text-signal",
  ghost: "bg-transparent text-slate-700 hover:text-signal",
};

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  onClick,
  ...rest
}: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y, size }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.(e);
  }

  return (
    <button
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg px-4 py-2.5 font-body text-sm font-semibold transition-colors ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/40"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            animation: "ripple-expand 0.6s ease-out",
          }}
        />
      ))}
    </button>
  );
}

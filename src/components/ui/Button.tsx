import type { ButtonHTMLAttributes, ReactNode } from "react";

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

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 font-body text-sm font-semibold transition-colors ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

import { useRef, useState, type ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number; // how far the button can move toward the cursor
  className?: string;
}

// Wraps any button/link so it subtly "pulls" toward the cursor when
// hovered, then springs back on mouse leave — the classic "magnetic
// button" microinteraction seen on premium agency sites.
export default function MagneticButton({
  children,
  strength = 0.4,
  className = "",
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate(0px, 0px)");

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTransform(`translate(${x * strength}px, ${y * strength}px)`);
  }

  function handleMouseLeave() {
    setTransform("translate(0px, 0px)");
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: "transform 0.2s ease-out" }}
      className={`inline-block ${className}`}
    >
      {children}
    </div>
  );
}

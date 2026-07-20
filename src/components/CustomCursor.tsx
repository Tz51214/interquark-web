import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Skip on touch devices — no real cursor there.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    function handleMove(e: MouseEvent) {
      setVisible(true);
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, select, input, [role='button']"));
    }

    function handleLeaveWindow() {
      setVisible(false);
    }

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeaveWindow);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeaveWindow);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed z-[200] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal mix-blend-difference transition-all duration-150 ease-out"
      style={{
        width: hovering ? 32 : 10,
        height: hovering ? 32 : 10,
        opacity: visible ? 1 : 0,
      }}
    />
  );
}

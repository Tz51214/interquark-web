import { useRef, useEffect, useState } from "react";

// Tracks mouse position relative to an element's center, returning a
// small rotation/offset for a subtle tilt effect. Resets on mouse leave.
export function useParallax(strength = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("rotateX(0deg) rotateY(0deg)");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function handleMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTransform(`rotateX(${-y * strength}deg) rotateY(${x * strength}deg)`);
    }

    function handleLeave() {
      setTransform("rotateX(0deg) rotateY(0deg)");
    }

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);

  return { ref, transform };
}

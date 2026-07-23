import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

// Wraps the app in Lenis smooth scrolling — every scroll (mouse wheel,
// trackpad, anchor links) gets eased rather than jumping instantly.
// This is what makes scroll-driven effects (GSAP ScrollTrigger, reveals)
// feel fluid rather than jittery.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

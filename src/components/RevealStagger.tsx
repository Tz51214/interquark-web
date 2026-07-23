import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Wraps a group of children (cards, list items) so they animate in
// one after another as the group scrolls into view, instead of all
// appearing simultaneously — the "stagger" effect.
export default function RevealStagger({
  children,
  className = "",
  childSelector = ":scope > *",
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  childSelector?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll(childSelector);
    if (items.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { opacity: 0, y: 28, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [childSelector, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

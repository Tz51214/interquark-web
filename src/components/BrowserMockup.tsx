import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BrowserMockup({
  url = "app.interquark.co.uk",
  children,
}: {
  url?: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-mint" />
        <div className="ml-3 flex-1 rounded-md bg-white px-3 py-1 font-mono text-xs text-slate-400">
          {url}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

interface BarData {
  label: string;
  value: number;
}

export function AnimatedBarChart({ data }: { data: BarData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const max = Math.max(...data.map((d) => d.value));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const bars = el.querySelectorAll<HTMLElement>("[data-bar]");

    const ctx = gsap.context(() => {
      bars.forEach((bar) => {
        const target = bar.dataset.height;
        gsap.fromTo(
          bar,
          { height: "0%" },
          {
            height: `${target}%`,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, [data]);

  return (
    <div ref={ref} className="flex h-40 items-end gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-full w-full items-end overflow-hidden rounded-t-md bg-slate-100">
            <div
              data-bar
              data-height={(d.value / max) * 100}
              className="w-full rounded-t-md bg-gradient-to-t from-signal to-signal-dark"
              style={{ height: "0%" }}
            />
          </div>
          <span className="font-mono text-[10px] text-slate-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { CatalogItem } from "../data/catalog";
import { useCart } from "../context/CartContext";

export default function ServiceCard({ item }: { item: CatalogItem }) {
  const tierNames = Object.keys(item.tiers);
  const [tier, setTier] = useState(tierNames[0]);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    // Subtle tilt — max ~4 degrees, enough to feel like depth without
    // being distracting or gimmicky.
    setTilt({ x: (py - 0.5) * -8, y: (px - 0.5) * 8 });
    setSpotlight({ x: px * 100, y: py * 100 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleAdd() {
    addItem({
      name: item.name,
      sku: item.sku,
      tier,
      price: item.tiers[tier].price,
      features: item.tiers[tier].features,
    });
    setAdded(true);
    timeoutRef.current = setTimeout(() => setAdded(false), 1400);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        backgroundImage: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(91,95,239,0.06), transparent 60%)`,
        transition: "transform 0.15s ease-out",
      }}
      className="relative flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-signal/40 hover:shadow-lg hover:shadow-signal/10 [transform-style:preserve-3d]"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[11px] text-slate-400">{item.sku}</span>
        <span
          className={`rounded-full px-2 py-0.5 font-mono text-[10.5px] font-bold tracking-wide ${
            item.badge === "flagship"
              ? "bg-signal/10 text-signal-dark"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {item.badge === "flagship" ? "FLAGSHIP" : "AVAILABLE"}
        </span>
      </div>
      <Link to={`/services/${item.id}`}>
        <h3 className="mb-1.5 font-display text-base font-semibold text-ink hover:text-signal">
          {item.name}
        </h3>
      </Link>
      <p className="mb-4 flex-1 font-body text-sm leading-relaxed text-slate-500">{item.desc}</p>

      <select
        value={tier}
        onChange={(e) => setTier(e.target.value)}
        className="mb-4 rounded-lg border border-slate-300 px-3 py-2 font-body text-sm focus:border-signal focus:outline-none"
      >
        {tierNames.map((t) => (
          <option key={t} value={t}>
            {t} — £{item.tiers[t].price.toLocaleString()}
          </option>
        ))}
      </select>

      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold text-slate-400">PRICE</span>
        <span className="font-mono text-lg font-bold text-signal">
          £{item.tiers[tier].price.toLocaleString()}
        </span>
      </div>

      <button
        onClick={handleAdd}
        className={`rounded-lg py-2.5 font-body text-sm font-semibold transition-colors ${
          added ? "bg-mint text-white" : "bg-signal text-white hover:bg-signal-dark"
        }`}
      >
        {added ? "Added ✓" : "Add to cart"}
      </button>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { CatalogItem } from "../data/catalog";
import { useCart } from "../context/CartContext";

export default function ServiceCard({ item }: { item: CatalogItem }) {
  const tierNames = Object.keys(item.tiers);
  const [tier, setTier] = useState(tierNames[0]);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-signal/40 hover:shadow-lg hover:shadow-signal/10">
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

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import CartDrawer from "../components/CartDrawer";
import JoinModal from "../components/JoinModal";
import ChatWidget from "../components/ChatWidget";
import { catalog, sectionTitles, type CatalogSection } from "../data/catalog";
import { useCart } from "../context/CartContext";

export default function ServiceDetail() {
  const { t } = useTranslation();
  const { serviceId } = useParams();
  const { addItem } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  let item: (typeof catalog)[CatalogSection][number] | undefined;
  let section: CatalogSection | undefined;

  for (const key of Object.keys(catalog) as CatalogSection[]) {
    const found = catalog[key].find((i) => i.id === serviceId);
    if (found) {
      item = found;
      section = key;
      break;
    }
  }

  const tierNames = item ? Object.keys(item.tiers) : [];
  const [tier, setTier] = useState(tierNames[0] || "");

  // Related services: prefer others in the same category, then fill
  // from adjacent categories if the current one is small.
  const related = (() => {
    if (!item || !section) return [];
    const sameCategory = catalog[section].filter((i) => i.id !== item!.id);
    const others = (Object.keys(catalog) as CatalogSection[])
      .filter((key) => key !== section)
      .flatMap((key) => catalog[key]);
    return [...sameCategory, ...others].slice(0, 3);
  })();

  if (!item || !section) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <Navbar onCartClick={() => setCartOpen(true)} onJoinClick={() => setJoinOpen(true)} />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="mb-3 font-display text-2xl font-bold">Service not found</h1>
          <Link to="/" className="text-signal hover:underline">
            &larr; Back to services
          </Link>
        </div>
      </div>
    );
  }

  const currentTier = item.tiers[tier];

  function handleAdd() {
    if (!item) return;
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
    <div className="min-h-screen bg-paper text-ink">
      <Navbar onCartClick={() => setCartOpen(true)} onJoinClick={() => setJoinOpen(true)} />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        <Link to={`/#${section}`} className="mb-6 inline-block text-sm text-slate-500 hover:text-signal">
          &larr; {sectionTitles[section]}
        </Link>

        <div className="mb-3 flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400">{item.sku}</span>
          {item.badge === "flagship" && (
            <span className="rounded-full bg-signal/10 px-2 py-0.5 font-mono text-[10.5px] font-bold text-signal-dark">
              FLAGSHIP
            </span>
          )}
        </div>

        <h1 className="mb-4 font-display text-3xl font-bold text-ink">{item.name}</h1>
        <p className="mb-8 max-w-2xl font-body text-base leading-relaxed text-slate-600">
          {item.desc}
        </p>

        {/* Mini process strip */}
        <div className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { num: "01", label: "Add to cart", desc: "Pick your tier and submit your order" },
            { num: "02", label: "Get matched", desc: "A developer is assigned to your project" },
            { num: "03", label: "Track delivery", desc: "Follow progress from your customer portal" },
          ].map((step) => (
            <div key={step.num} className="rounded-lg border border-slate-200 bg-white p-4">
              <span className="font-mono text-xs font-bold text-signal">{step.num}</span>
              <div className="mt-1 font-body text-sm font-semibold text-ink">{step.label}</div>
              <div className="font-body text-xs text-slate-500">{step.desc}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="mb-4 font-display text-lg font-semibold text-ink">
              What's included — {tier}
            </h2>
            <div className="flex flex-col gap-2.5">
              {currentTier.features.map((f) => (
                <div
                  key={f}
                  className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-mint/10 text-xs text-mint">
                    ✓
                  </span>
                  <span className="font-body text-sm text-slate-700">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-fit rounded-xl border border-slate-200 bg-white p-6">
            <label className="mb-1.5 block font-mono text-[11px] font-semibold text-slate-400">
              TIER
            </label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="mb-5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-signal focus:outline-none"
            >
              {tierNames.map((tName) => (
                <option key={tName} value={tName}>
                  {tName} — £{item!.tiers[tName].price.toLocaleString()}
                </option>
              ))}
            </select>

            <div className="mb-5 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="font-mono text-[11px] font-semibold text-slate-400">PRICE</span>
              <span className="font-mono text-2xl font-bold text-signal">
                £{currentTier.price.toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleAdd}
              className={`w-full rounded-lg py-3 font-body text-sm font-semibold transition-colors ${
                added ? "bg-mint text-white" : "bg-signal text-white hover:bg-signal-dark"
              }`}
            >
              {added ? "Added ✓" : t("cart.addToCart")}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
            <h2 className="mb-6 font-display text-lg font-semibold text-ink">
              Frequently added together
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((r) => {
                return (
                  <Link
                    key={r.id}
                    to={`/services/${r.id}`}
                    className="rounded-xl border border-slate-200 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-signal/40 hover:shadow-lg hover:shadow-signal/10"
                  >
                    <span className="mb-2 block font-mono text-[11px] text-slate-400">{r.sku}</span>
                    <h3 className="mb-1.5 font-display text-sm font-semibold text-ink">{r.name}</h3>
                    <p className="mb-3 font-mono text-sm font-bold text-signal">
                      from £{Math.min(...Object.values(r.tiers).map((t) => t.price)).toLocaleString()}
                    </p>
                    <span className="font-body text-xs font-semibold text-signal hover:underline">
                      View details &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <JoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
      <ChatWidget />
      <SiteFooter />
    </div>
  );
}

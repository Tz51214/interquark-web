import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import SupportWidget from "../components/SupportWidget";
import CartDrawer from "../components/CartDrawer";
import JoinModal from "../components/JoinModal";
import NewsletterModal from "../components/NewsletterModal";
import ServiceCard from "../components/ServiceCard";
import RevealStagger from "../components/RevealStagger";
import { catalog, sectionTitles, type CatalogSection } from "../data/catalog";
import PageMeta from "../components/PageMeta";

const sectionOrder: CatalogSection[] = [
  "webdev",
  "ai",
  "software",
  "security",
  "cloud",
  "migrations",
  "growth",
  "saas",
  "maintenance",
  "retainer",
];

export default function Services() {
  const [cartOpen, setCartOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <PageMeta
        path="/services"
        title="Services & Pricing | Interquark"
        description="Browse all 27 Interquark services with transparent, fixed-tier pricing — web development, AI, custom software, security, cloud, migrations, growth, SaaS platforms, maintenance, and retainers."
      />
      <Navbar onCartClick={() => setCartOpen(true)} onJoinClick={() => setJoinOpen(true)} />

      <section className="relative overflow-hidden border-b border-slate-200 bg-ink py-24 text-center">
        <div className="hero-grid opacity-40" />
        <div className="hero-blob h-72 w-72 bg-signal/30" style={{ top: "10%", left: "5%" }} />
        <div
          className="hero-blob h-96 w-96 bg-mint/20"
          style={{ bottom: "5%", right: "10%", animationDelay: "3s" }}
        />
        <div
          className="hero-glow h-64 w-64 bg-signal/40"
          style={{ top: "40%", left: "50%", animationDelay: "1.5s" }}
        />
        <div className="relative mx-auto max-w-3xl px-6">
          <h1 className="mb-3 font-display text-5xl font-bold text-white">
            Services & pricing
          </h1>
          <p className="font-body text-base text-slate-400">
            Every service, priced upfront by tier. No hourly guesswork.
          </p>
        </div>
      </section>

      {sectionOrder.map((section) => (
        <section key={section} id={section} className="mx-auto max-w-7xl px-6 py-10">
          <h2 className="mb-8 font-display text-3xl font-bold text-ink">
            {sectionTitles[section]}
          </h2>
          <RevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {catalog[section].map((item) => (
              <ServiceCard key={item.id} item={item} />
            ))}
          </RevealStagger>
        </section>
      ))}

      <SiteFooter />
      <SupportWidget audience="public" />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <JoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
      <NewsletterModal open={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
    </div>
  );
}

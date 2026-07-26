import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import SupportWidget from "../components/SupportWidget";
import CartDrawer from "../components/CartDrawer";
import JoinModal from "../components/JoinModal";
import NewsletterModal from "../components/NewsletterModal";
import PageMeta from "../components/PageMeta";
import BrowserMockup, { AnimatedBarChart } from "../components/BrowserMockup";
import Reveal from "../components/Reveal";

export default function Showcase() {
  const [cartOpen, setCartOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <PageMeta
        path="/showcase"
        title="Showcase | Interquark"
        description="Illustrative examples of what our flagship services look like when delivered — Magento builds, SaaS platforms, custom web applications, and AI automation."
      />
      <Navbar onCartClick={() => setCartOpen(true)} onJoinClick={() => setJoinOpen(true)} />

      <section className="border-b border-slate-200 bg-white py-14 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="mb-3 font-display text-4xl font-bold text-ink">Showcase</h1>
          <p className="font-body text-base text-slate-500">
            Illustrative examples of what these builds look like when delivered — not real
            client screenshots.
          </p>
        </div>
      </section>

      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
        {/* Magento build */}
        <Reveal>
          <span className="mb-3 inline-block rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-signal">
            ILLUSTRATIVE EXAMPLE
          </span>
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">
            Magento 2 / Adobe Commerce Build
          </h2>
          <p className="mb-6 font-body text-sm text-slate-500">
            A full enterprise storefront — custom theme, multiple payment gateways, and cloud
            infrastructure.
          </p>
          <BrowserMockup url="yourstore.example.com">
            <div className="flex flex-col gap-3">
              <div className="h-8 w-full rounded-md bg-slate-100" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-24 rounded-md bg-slate-100" />
                <div className="h-24 rounded-md bg-slate-100" />
                <div className="h-24 rounded-md bg-slate-100" />
              </div>
              <div className="h-10 w-32 rounded-md bg-signal/20" />
            </div>
          </BrowserMockup>
          <Link
            to="/services/mg-01"
            className="mt-4 inline-block text-sm font-semibold text-signal hover:underline"
          >
            View this service →
          </Link>
        </Reveal>

        {/* SaaS platform */}
        <Reveal>
          <span className="mb-3 inline-block rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-signal">
            ILLUSTRATIVE EXAMPLE
          </span>
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">
            Multi-Tenant SaaS / ERP Platform
          </h2>
          <p className="mb-6 font-body text-sm text-slate-500">
            RBAC, ledger and invoicing, admin dashboard, and full API layer.
          </p>
          <BrowserMockup url="app.yourplatform.example.com">
            <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wide text-slate-400">
              Monthly active tenants
            </h3>
            <AnimatedBarChart
              data={[
                { label: "Jan", value: 8 },
                { label: "Feb", value: 12 },
                { label: "Mar", value: 15 },
                { label: "Apr", value: 19 },
                { label: "May", value: 24 },
              ]}
            />
          </BrowserMockup>
          <Link
            to="/services/saas-01"
            className="mt-4 inline-block text-sm font-semibold text-signal hover:underline"
          >
            View this service →
          </Link>
        </Reveal>

        {/* Full-stack web app */}
        <Reveal>
          <span className="mb-3 inline-block rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-signal">
            ILLUSTRATIVE EXAMPLE
          </span>
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">
            Full-Stack Web Application
          </h2>
          <p className="mb-6 font-body text-sm text-slate-500">
            A custom-built application from the ground up — not a template, not a page builder.
          </p>
          <BrowserMockup url="yourapp.example.com">
            <div className="flex gap-3">
              <div className="flex w-24 flex-col gap-2">
                <div className="h-6 rounded bg-slate-100" />
                <div className="h-6 rounded bg-signal/20" />
                <div className="h-6 rounded bg-slate-100" />
                <div className="h-6 rounded bg-slate-100" />
              </div>
              <div className="flex-1 rounded-md bg-slate-50 p-3">
                <div className="mb-2 h-4 w-1/2 rounded bg-slate-200" />
                <div className="h-20 rounded bg-slate-100" />
              </div>
            </div>
          </BrowserMockup>
          <Link
            to="/services/sw-01"
            className="mt-4 inline-block text-sm font-semibold text-signal hover:underline"
          >
            View this service →
          </Link>
        </Reveal>

        {/* AI automation */}
        <Reveal>
          <span className="mb-3 inline-block rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-signal">
            ILLUSTRATIVE EXAMPLE
          </span>
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">
            Store Automation & AI Agents
          </h2>
          <p className="mb-6 font-body text-sm text-slate-500">
            Automate repetitive operations — inventory alerts, order triage, customer
            follow-ups.
          </p>
          <BrowserMockup url="automation.example.com">
            <div className="flex flex-col gap-2">
              {["Inventory alert sent", "Order #4821 triaged", "Follow-up email queued"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 font-mono text-xs text-slate-500"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                    {item}
                  </div>
                ),
              )}
            </div>
          </BrowserMockup>
          <Link
            to="/services/ai-02"
            className="mt-4 inline-block text-sm font-semibold text-signal hover:underline"
          >
            View this service →
          </Link>
        </Reveal>
      </div>

      <SiteFooter />
      <SupportWidget audience="public" />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <JoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
      <NewsletterModal open={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
    </div>
  );
}

import { useState, useEffect, lazy, Suspense } from "react";
import { useParallax } from "../hooks/useParallax";
import Reveal from "../components/Reveal";
import NewsletterModal from "../components/NewsletterModal";
import { useScrollTrigger } from "../hooks/useScrollTrigger";
import PlatformMarquee from "../components/PlatformMarquee";
import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import CartDrawer from "../components/CartDrawer";
import ServiceCard from "../components/ServiceCard";
import JoinModal from "../components/JoinModal";
import Button from "../components/ui/Button";
import { catalog, sectionTitles, type CatalogSection } from "../data/catalog";
import AnimatedCounter from "../components/AnimatedCounter";
import { apiFetch } from "../lib/api";
import { useTranslation } from "react-i18next";
import SupportWidget from "../components/SupportWidget";
const HeroSphere = lazy(() => import("../components/HeroSphere"));

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

const platforms = [
  "Magento",
  "Shopify",
  "WooCommerce",
  "WordPress",
  "Custom SaaS",
  "AI Development",
  "Software Development",
  "Cloud & Cybersecurity",
  "Website Maintenance",
];

const deployLines = [
  { text: "❯ interquark deploy storefront", type: "cmd" },
  { text: "✓ Dependencies resolved", type: "ok" },
  { text: "✓ SSL configured", type: "ok" },
  { text: "✓ Payment gateway verified", type: "ok" },
  { text: "✓ Security audit passed", type: "ok" },
  { text: "✓ Store live — 0 downtime", type: "ok" },
];

export default function Home() {
  const { t } = useTranslation();
  const consoleParallax = useParallax(6);
  const showNewsletter = useScrollTrigger(40);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  useEffect(() => {
    if (showNewsletter) setNewsletterOpen(true);
  }, [showNewsletter]);
  const [cartOpen, setCartOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [contact, setContact] = useState({ name: "", email: "", message: "" });

  async function submitContact() {
    if (!contact.name || !contact.email || !contact.message) return;
    setContactStatus("sending");
    const { ok } = await apiFetch("/contact", {
      method: "POST",
      body: JSON.stringify(contact),
    }).catch(() => ({ ok: false }));
    setContactStatus(ok ? "sent" : "error");
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar onCartClick={() => setCartOpen(true)} onJoinClick={() => setJoinOpen(true)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-ink">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <Suspense fallback={null}>
            <HeroSphere />
          </Suspense>
        </div>
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:py-24">
          <div>
            <span className="mb-5 inline-block rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-signal">
              {t("hero.eyebrow").toUpperCase()}
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl sm:leading-[1] lg:text-7xl lg:leading-[0.98]">
              {t("hero.headline1")}
              <br />
              {t("hero.headline2")}
            </h1>
            <p className="mt-6 max-w-lg font-body text-lg text-slate-400">
              {t("hero.subhead")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#webdev">
                <Button>{t("hero.browseServices")}</Button>
              </a>
              <a href="#contact">
                <Button
                  variant="secondary"
                  className="!border-slate-600 !bg-transparent !text-white hover:!border-signal hover:!text-signal"
                >
                  {t("hero.getInTouch")}
                </Button>
              </a>
            </div>
          </div>

          {/* Signature: deploy console */}
          <div
            ref={consoleParallax.ref}
            style={{ transform: consoleParallax.transform, transition: "transform 0.15s ease-out" }}
            className="rounded-xl border border-line bg-ink-light font-mono text-sm shadow-2xl [transform-style:preserve-3d]"
          >
            <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-mint/70" />
            </div>
            <div className="flex flex-col gap-2.5 p-5">
              {deployLines.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.type === "cmd"
                      ? "text-white"
                      : "text-mint"
                  }
                >
                  {line.text}
                </div>
              ))}
              <div className="mt-1 flex items-center gap-1 text-white">
                <span>❯</span>
                <span className="h-4 w-2 animate-pulse bg-signal" />
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="border-t border-line">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5">
            <span className="font-mono text-[11px] font-semibold tracking-wide text-slate-500">
              {t("hero.platformsLabel").toUpperCase()}
            </span>
            {platforms.map((p) => (
              <span key={p} className="font-mono text-[13px] text-slate-300">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      <PlatformMarquee />

      {/* Stats */}
      <section className="border-b border-slate-200 bg-ink">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 px-6 py-14 sm:grid-cols-3">
          <div className="text-center">
            <div className="font-display text-4xl font-bold text-signal">
              <AnimatedCounter end={27} suffix="+" />
            </div>
            <p className="mt-1 font-body text-sm text-slate-400">Services offered</p>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl font-bold text-signal">
              <AnimatedCounter end={10} />
            </div>
            <p className="mt-1 font-body text-sm text-slate-400">Areas of specialization</p>
          </div>
          <div className="text-center">
            <div className="font-display text-4xl font-bold text-signal">
              <AnimatedCounter end={7} suffix="+" />
            </div>
            <p className="mt-1 font-body text-sm text-slate-400">Years of experience</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="mb-12 text-center font-display text-3xl font-bold text-ink">
            How it works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                num: "01",
                title: "Tell us what you need",
                desc: "Browse services or send a message describing your project — new build, migration, security fix, or ongoing support.",
              },
              {
                num: "02",
                title: "Get matched with a developer",
                desc: "We pair you with a freelancer experienced in your platform, ready to start.",
              },
              {
                num: "03",
                title: "Track it end to end",
                desc: "Message your developer, share files, and follow project status from your customer portal until delivery.",
              },
            ].map((step) => (
              <div key={step.num} className="rounded-xl border border-slate-200 p-6">
                <span className="mb-3 block font-mono text-2xl font-bold text-signal">
                  {step.num}
                </span>
                <h3 className="mb-2 font-display text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="font-body text-sm leading-relaxed text-slate-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Freelancer network */}
      <section className="border-b border-slate-200 bg-paper">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="mb-3 block font-mono text-[11px] font-semibold tracking-wide text-signal">
                WHO BUILDS YOUR PROJECT
              </span>
              <h2 className="mb-5 font-display text-3xl font-bold leading-tight text-ink">
                A vetted network, not a single team.
              </h2>
              <p className="mb-8 font-body text-base leading-relaxed text-slate-600">
                Every freelancer on Interquark goes through admin verification before they can
                take on client work — so when you're matched with a developer, you're getting
                someone reviewed and approved to work on real projects, not an anonymous bid from
                an open marketplace.
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  {
                    title: "Verified before they work",
                    desc: "Freelancers are reviewed and approved by our team before being assigned to any client project.",
                  },
                  {
                    title: "Matched to your platform",
                    desc: "You're paired with a developer experienced in the specific platform your project needs — Magento, Shopify, WooCommerce, WordPress, or custom SaaS.",
                  },
                  {
                    title: "One thread, no relays",
                    desc: "You message your assigned developer directly from your customer portal — not through a middleman.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-signal/10 text-xs text-signal">
                      ✓
                    </span>
                    <div>
                      <b className="block font-body text-sm font-semibold text-ink">
                        {item.title}
                      </b>
                      <span className="font-body text-sm text-slate-500">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="animated-gradient-glow rounded-xl border border-slate-200 bg-white p-6 font-mono text-sm shadow-sm">
              <div className="mb-4 text-slate-400">freelancer.status</div>
              <div className="flex flex-col gap-3">
                {[
                  { name: "M. Ali", tier: "Magento", status: "verified" },
                  { name: "S. Khan", tier: "Shopify", status: "verified" },
                  { name: "R. Ahmed", tier: "Full-stack", status: "verified" },
                ].map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5"
                  >
                    <div>
                      <span className="block text-ink">{f.name}</span>
                      <span className="text-xs text-slate-400">{f.tier}</span>
                    </div>
                    <span className="rounded-full bg-mint/10 px-2 py-0.5 text-[11px] font-semibold text-mint">
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog sections */}
      {sectionOrder.map((section) => (
        <section key={section} id={section} className="mx-auto max-w-7xl px-6 py-10">
          <h2 className="mb-8 font-display text-2xl font-bold text-ink">
            {sectionTitles[section]}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {catalog[section].map((item) => (
              <ServiceCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}

      {/* Contact */}
      <section id="contact" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-2xl px-6 py-20">
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">{t("contact.title")}</h2>
          <p className="mb-8 font-body text-sm text-slate-500">
            {t("contact.subtitle")}
          </p>

          {contactStatus === "sent" ? (
            <div className="rounded-xl border border-mint/30 bg-mint/10 p-6 text-center font-body text-mint">
              {t("contact.sent")}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <input
                placeholder={t("contact.namePlaceholder")}
                value={contact.name}
                onChange={(e) => setContact({ ...contact, name: e.target.value })}
                className="rounded-lg border border-slate-300 px-4 py-3 font-body text-sm focus:border-signal focus:outline-none"
              />
              <input
                type="email"
                placeholder={t("contact.emailPlaceholder")}
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className="rounded-lg border border-slate-300 px-4 py-3 font-body text-sm focus:border-signal focus:outline-none"
              />
              <textarea
                placeholder={t("contact.messagePlaceholder")}
                rows={4}
                value={contact.message}
                onChange={(e) => setContact({ ...contact, message: e.target.value })}
                className="rounded-lg border border-slate-300 px-4 py-3 font-body text-sm focus:border-signal focus:outline-none"
              />
              <Button onClick={submitContact} disabled={contactStatus === "sending"}>
                {contactStatus === "sending" ? t("contact.sending") : t("contact.send")}
              </Button>
              {contactStatus === "error" && (
                <p className="font-body text-sm text-red-500">
                  {t("contact.error")}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Getting started is simple */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="mb-3 block font-mono text-[11px] font-semibold tracking-wide text-signal">
              GETTING STARTED
            </span>
            <h2 className="mb-8 font-display text-3xl font-bold leading-tight text-ink">
              Working with us is simple.
            </h2>
            <div className="flex flex-col gap-6">
              {[
                {
                  title: "No lengthy onboarding",
                  desc: "Pick a service, tell us what you need, and a developer is matched to your project — no sales calls required to get started.",
                },
                {
                  title: "Clear tier-based pricing",
                  desc: "Every service is priced by tier upfront, so you know the cost before committing to anything.",
                },
                {
                  title: "One thread, start to finish",
                  desc: "Message your developer directly from your customer portal — the same place you track project status and invoices.",
                },
              ].map((item, i) => (
                <div key={item.title} className="flex gap-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-signal/30 bg-signal/10 font-mono text-sm font-bold text-signal">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="mb-1 font-display text-base font-semibold text-ink">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm leading-relaxed text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-ink p-6 font-mono text-sm shadow-2xl">
            <div className="mb-4 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-mint/70" />
            </div>
            <div className="flex flex-col gap-3 text-slate-300">
              <div className="text-white">❯ project.status</div>
              <div className="rounded-lg border border-line bg-ink-light p-3">
                <div className="mb-1 flex justify-between text-xs">
                  <span>WooCommerce Store Build</span>
                  <span className="text-mint">in_progress</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div className="h-full w-3/5 rounded-full bg-signal" />
                </div>
              </div>
              <div className="rounded-lg border border-line bg-ink-light p-3 text-xs">
                <span className="text-slate-500">developer:</span> assigned
                <br />
                <span className="text-slate-500">last message:</span> 2h ago
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Interquark */}
      <section className="border-t border-slate-200 bg-ink">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:py-24">
          <span className="mb-3 block font-mono text-[11px] font-semibold tracking-wide text-signal">
            WHY INTERQUARK
          </span>
          <h2 className="mb-16 max-w-xl font-display text-3xl font-bold leading-tight text-white">
            Built like a product team, not a freelance marketplace.
          </h2>

          <div className="flex flex-col gap-6">
            {/* Row 1 */}
            <Reveal delay={0}>
            <div className="glass-panel grid grid-cols-1 items-center gap-8 rounded-xl p-8 lg:grid-cols-2">
              <div>
                <div className="mb-4 h-px w-8 bg-signal" />
                <h3 className="mb-2 font-display text-xl font-semibold text-white">
                  You talk to the developer, not a middleman
                </h3>
                <p className="font-body text-sm leading-relaxed text-slate-400">
                  No account managers, no relayed messages. You message the person actually
                  writing your code, directly from your customer portal.
                </p>
              </div>
              <div className="rounded-lg border border-line bg-ink p-5 font-mono text-xs">
                <div className="mb-3 text-slate-500">customer_portal / messages</div>
                <div className="mb-2 flex items-start gap-2">
                  <span className="text-signal">you:</span>
                  <span className="text-slate-300">Can we adjust the checkout flow?</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-mint">developer:</span>
                  <span className="text-slate-300">Yep, pushing that update now.</span>
                </div>
              </div>
            </div>
            </Reveal>

            {/* Row 2 */}
            <Reveal delay={100}>
            <div className="glass-panel grid grid-cols-1 items-center gap-8 rounded-xl p-8 lg:grid-cols-2">
              <div className="order-2 rounded-lg border border-line bg-ink-light p-5 font-mono text-xs lg:order-1">
                <div className="mb-3 flex justify-between text-slate-500">
                  <span>tier</span>
                  <span>price</span>
                </div>
                <div className="mb-2 flex justify-between border-t border-line pt-2 text-slate-300">
                  <span>Standard</span>
                  <span className="text-signal">£600</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Custom theme dev</span>
                  <span className="text-signal">£950</span>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="mb-4 h-px w-8 bg-signal" />
                <h3 className="mb-2 font-display text-xl font-semibold text-white">
                  Fixed-tier pricing, no surprise invoices
                </h3>
                <p className="font-body text-sm leading-relaxed text-slate-400">
                  Every service is priced upfront by tier. You know the cost before you commit —
                  no hourly guesswork.
                </p>
              </div>
            </div>
            </Reveal>

            {/* Row 3 */}
            <Reveal delay={200}>
            <div className="glass-panel grid grid-cols-1 items-center gap-8 rounded-xl p-8 lg:grid-cols-2">
              <div>
                <div className="mb-4 h-px w-8 bg-signal" />
                <h3 className="mb-2 font-display text-xl font-semibold text-white">
                  Platforms we've actually shipped on
                </h3>
                <p className="font-body text-sm leading-relaxed text-slate-400">
                  Magento, Shopify, WooCommerce, WordPress, and custom SaaS — chosen based on
                  what your business needs, not what we're used to.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-line bg-ink px-3 py-1.5 font-mono text-xs text-slate-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            </Reveal>

            {/* Row 4 */}
            <Reveal delay={300}>
            <div className="glass-panel grid grid-cols-1 items-center gap-8 rounded-xl p-8 lg:grid-cols-2">
              <div className="order-2 rounded-lg border border-line bg-ink-light p-5 font-mono text-xs lg:order-1">
                <div className="mb-2 flex justify-between text-slate-300">
                  <span>store.uptime</span>
                  <span className="text-mint">99.9%</span>
                </div>
                <div className="mb-2 flex justify-between text-slate-300">
                  <span>security.patches</span>
                  <span className="text-mint">up_to_date</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>retainer.status</span>
                  <span className="text-mint">active</span>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="mb-4 h-px w-8 bg-signal" />
                <h3 className="mb-2 font-display text-xl font-semibold text-white">
                  Support doesn't end at launch
                </h3>
                <p className="font-body text-sm leading-relaxed text-slate-400">
                  Retainer plans keep your store maintained, secure, and updated long after the
                  initial build is done.
                </p>
              </div>
            </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ink">
        <div className="mx-auto max-w-3xl px-6 pb-24 text-center">
          <div className="rounded-2xl bg-signal/10 border border-signal/20 px-8 py-14">
            <h2 className="mb-3 font-display text-2xl font-bold text-white">
              Not sure which service fits?
            </h2>
            <p className="mb-7 font-body text-sm text-slate-300">
              Browse the full catalog and compare pricing across every tier.
            </p>
            <a href="#webdev">
              <Button>{t("hero.browseServices")}</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <SiteFooter />
      <SupportWidget audience="public" />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <JoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
      <NewsletterModal open={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
    </div>
  );
}

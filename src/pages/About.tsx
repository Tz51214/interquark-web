import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import Reveal from "../components/Reveal";
import Button from "../components/ui/Button";
import { useDocumentHead } from "../hooks/useDocumentHead";

const solutions = [
  {
    title: "Interquark Marketplace",
    desc: "Businesses come to Interquark to find developers and agencies across web development, AI integration, security, cloud, and migrations — vetted in advance, so you're never gambling on an anonymous bid.",
  },
  {
    title: "Interquark for Growth & Retainers",
    desc: "Beyond one-off builds, Interquark connects you with ongoing support: maintenance, security monitoring, and growth-stage development on a fixed retainer, so your store or platform keeps moving after launch.",
  },
];

const values = [
  {
    title: "Quality over volume",
    desc: "We stay a small, focused team on purpose — not a large agency, not an open marketplace. That's how we keep standards high and pricing fair.",
  },
  {
    title: "Transparency first",
    desc: "No hourly billing surprises. Every service is priced by tier and shown before you commit to anything.",
  },
  {
    title: "Direct access",
    desc: "You talk to the developer building your project — not a relay.",
  },
  {
    title: "Vetted, not open",
    desc: "Every freelancer is reviewed before taking on client work.",
  },
];

export default function About() {
  useDocumentHead(
    "About Interquark — Ecommerce & SaaS, built properly",
    "Interquark connects businesses with vetted developers and agencies who build and maintain ecommerce stores and custom software.",
  );

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />

      <section className="border-b border-slate-200 bg-ink">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="mb-5 inline-block rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-signal">
            ABOUT US
          </span>
          <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Ecommerce and SaaS, built properly.
          </h1>
          <p className="mx-auto mb-4 max-w-xl font-body text-lg text-slate-400">
            Interquark connects businesses with vetted developers and agencies who build and
            maintain ecommerce stores and custom software — without the guesswork of an open
            marketplace.
          </p>
          <p className="mx-auto max-w-xl font-body text-sm leading-relaxed text-slate-500">
            We work across Magento, Shopify, WooCommerce, WordPress, and bespoke SaaS platforms.
            Every freelancer on Interquark is reviewed before they touch client work, every
            service is priced upfront by tier, and every project runs through direct developer
            access — no account managers relaying messages in between.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="mb-10 text-center font-display text-2xl font-bold text-ink">
            Our solutions
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {solutions.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <div className="h-full rounded-xl border border-slate-200 p-6">
                  <div className="mb-3 h-px w-8 bg-signal" />
                  <h3 className="mb-2 font-display text-base font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-slate-500">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-paper">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <span className="mb-3 block font-mono text-[11px] font-semibold tracking-wide text-signal">
            OUR MISSION
          </span>
          <h2 className="font-display text-2xl font-bold text-ink">
            Make serious software work accessible without the agency markup or the marketplace
            lottery.
          </h2>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="mb-10 text-center font-display text-2xl font-bold text-ink">
            Our values
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 80}>
                <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-6">
                  <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-signal/10 text-xs text-signal">
                    ✓
                  </span>
                  <div>
                    <h3 className="mb-1.5 font-display text-base font-semibold text-ink">
                      {v.title}
                    </h3>
                    <p className="font-body text-sm leading-relaxed text-slate-500">{v.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="mb-5 font-body text-sm text-slate-600">
                Are you a business needing an ecommerce store or SaaS platform built?
              </p>
              <a href="/#contact">
                <Button>Get in touch</Button>
              </a>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="mb-5 font-body text-sm text-slate-600">
                Are you a developer or agency looking for vetted client work?
              </p>
              <Link to="/subscribe">
                <Button variant="secondary">Freelancer sign in</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

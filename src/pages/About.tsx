import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import Reveal from "../components/Reveal";
import Button from "../components/ui/Button";

const values = [
  {
    title: "Fixed pricing, always",
    desc: "No hourly billing. Every service is priced by tier, shown upfront, before you commit to anything.",
  },
  {
    title: "Vetted, not open marketplace",
    desc: "Every freelancer is reviewed before taking on client work. You're not gambling on an anonymous bid.",
  },
  {
    title: "Direct access, no relays",
    desc: "You talk to the developer building your project — not an account manager relaying messages.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />

      <section className="border-b border-slate-200 bg-ink">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="mb-5 inline-block rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-signal">
            ABOUT INTERQUARK
          </span>
          <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Ecommerce and SaaS development, built properly.
          </h1>
          <p className="mx-auto max-w-xl font-body text-lg text-slate-400">
            A UK-based studio building and maintaining ecommerce stores and custom SaaS
            platforms — Magento, Shopify, WooCommerce, WordPress, and bespoke software.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <div className="h-full rounded-xl border border-slate-200 p-6">
                  <div className="mb-3 h-px w-8 bg-signal" />
                  <h2 className="mb-2 font-display text-base font-semibold text-ink">
                    {v.title}
                  </h2>
                  <p className="font-body text-sm leading-relaxed text-slate-500">{v.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="mb-3 font-display text-2xl font-bold text-ink">
            We're a small, focused team.
          </h2>
          <p className="mb-8 font-body text-sm leading-relaxed text-slate-600">
            Not a large agency, not an open marketplace. That's deliberate — it's how we keep
            quality high and pricing fair.
          </p>
          <a href="/#contact">
            <Button>Get in touch</Button>
          </a>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

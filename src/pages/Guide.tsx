import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import Reveal from "../components/Reveal";

const steps = [
  {
    title: "Every service is priced upfront",
    desc: "No hourly billing, no scope creep surprises. Each service has clear tiers with a fixed price shown before you commit.",
  },
  {
    title: "Freelancers are verified before they work",
    desc: "Every developer on Interquark goes through an admin review before being matched to any client project.",
  },
  {
    title: "You're matched to your platform",
    desc: "Magento, Shopify, WooCommerce, WordPress, or custom SaaS — we match you with someone experienced in the specific platform your project needs.",
  },
  {
    title: "Direct communication, no relays",
    desc: "You message your assigned developer directly from your customer portal — not through an account manager passing messages back and forth.",
  },
  {
    title: "Support doesn't stop at launch",
    desc: "Retainer plans and one-off maintenance services keep your store running long after the initial build.",
  },
];

export default function Guide() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />

      <section className="border-b border-slate-200 bg-ink">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="mb-5 inline-block rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-signal">
            INTERQUARK GUIDE
          </span>
          <h1 className="mb-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            How we work, and what to expect.
          </h1>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-5">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 80}>
                <div className="flex gap-4 rounded-xl border border-slate-200 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-signal/40 hover:shadow-lg hover:shadow-signal/10">
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-signal/30 bg-signal/10 font-mono text-sm font-bold text-signal">
                    {i + 1}
                  </span>
                  <div>
                    <h2 className="mb-1.5 font-display text-base font-semibold text-ink">
                      {step.title}
                    </h2>
                    <p className="font-body text-sm leading-relaxed text-slate-600">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

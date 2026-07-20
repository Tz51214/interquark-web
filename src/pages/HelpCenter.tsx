import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import Reveal from "../components/Reveal";

const faqs = [
  {
    q: "How does pricing work?",
    a: "Every service on Interquark is priced by tier upfront — you pick the tier that fits your project and see the exact price before committing. There's no hourly billing or surprise invoices.",
  },
  {
    q: "How do I get matched with a developer?",
    a: "Once you place an order, our team assigns a freelancer experienced in the specific platform your project needs. You can then message them directly from your customer portal.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept payment via Stripe (debit/credit card) and PayPal, processed securely — we never store your card details.",
  },
  {
    q: "Can I get a refund?",
    a: "Refund requests are reviewed case by case. See our Terms of Service for full details on cancellation rights.",
  },
  {
    q: "How do I track my project?",
    a: "Sign in to your customer portal to see project status, message your developer, and view invoices — everything in one place.",
  },
  {
    q: "How do I become a freelancer on Interquark?",
    a: "Freelancers apply and go through a verification step before being matched to client work. You can start the process from our membership plans page.",
  },
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />

      <section className="border-b border-slate-200 bg-ink">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="mb-5 inline-block rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-signal">
            HELP CENTER
          </span>
          <h1 className="mb-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            Frequently asked questions
          </h1>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-5">
            {faqs.map((item, i) => (
              <Reveal key={item.q} delay={i * 80}>
                <div className="rounded-xl border border-slate-200 p-6 transition-all duration-200 hover:-translate-y-1 hover:border-signal/40 hover:shadow-lg hover:shadow-signal/10">
                  <h2 className="mb-2 font-display text-base font-semibold text-ink">{item.q}</h2>
                  <p className="font-body text-sm leading-relaxed text-slate-600">{item.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-10 text-center font-body text-sm text-slate-500">
            Can't find what you're looking for?{" "}
            <a href="/#contact" className="text-signal hover:underline">
              Get in touch
            </a>
            .
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

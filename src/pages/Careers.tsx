import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import Button from "../components/ui/Button";
import Reveal from "../components/Reveal";
import PageMeta from "../components/PageMeta";

const points = [
  {
    title: "Matched, not bidding",
    desc: "You're assigned to projects that fit your platform expertise — no competing against dozens of proposals for one job.",
  },
  {
    title: "Paid per project",
    desc: "No subscription-for-nothing risk once matched — you're paid for the work you actually deliver, tracked in your own payout dashboard.",
  },
  {
    title: "Flexible, remote",
    desc: "Work from anywhere, on your own schedule, matched to projects that fit your platform expertise.",
  },
];

export default function Careers() {
  const pageMeta = <PageMeta title="Careers — Interquark" description="Interquark works with a network of vetted freelance developers, matched to real client projects." path="/careers" />;

  return (
    <div className="min-h-screen bg-paper text-ink">
      {pageMeta}
      <Navbar />

      <section className="border-b border-slate-200 bg-ink">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="mb-5 inline-block rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-signal">
            CAREERS
          </span>
          <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            We work with freelancers, not traditional employees.
          </h1>
          <p className="mx-auto max-w-xl font-body text-lg text-slate-400">
            Interquark doesn't have open employee positions right now. Instead, we work with a
            network of vetted freelance developers matched to real client projects.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {points.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}>
                <div className="h-full rounded-xl border border-slate-200 p-6">
                  <div className="mb-3 h-px w-8 bg-signal" />
                  <h2 className="mb-2 font-display text-base font-semibold text-ink">
                    {p.title}
                  </h2>
                  <p className="font-body text-sm leading-relaxed text-slate-500">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <Link to="/subscribe">
            <Button>View membership plans</Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

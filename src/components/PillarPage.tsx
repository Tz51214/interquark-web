import { Link } from "react-router-dom";
import Navbar from "./layout/Navbar";
import SiteFooter from "./layout/SiteFooter";
import Reveal from "./Reveal";
import Button from "./ui/Button";
import PageMeta from "./PageMeta";
import { Helmet } from "react-helmet-async";

interface Section {
  title: string;
  desc: string;
}

interface Faq {
  q: string;
  a: string;
}

interface PillarPageProps {
  path: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  intro: string;
  sections: Section[];
  faqs?: Faq[];
  metaTitle: string;
  metaDescription: string;
}

export default function PillarPage({
  path,
  eyebrow,
  headline,
  subhead,
  intro,
  sections,
  faqs,
  metaTitle,
  metaDescription,
}: PillarPageProps) {
  const faqSchema = faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.interquark.co.uk/" },
      { "@type": "ListItem", position: 2, name: headline, item: `https://www.interquark.co.uk${path}` },
    ],
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <PageMeta title={metaTitle} description={metaDescription} path={path} />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && (
          <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        )}
      </Helmet>

      <Navbar />

      <section className="border-b border-slate-200 bg-ink">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="mb-5 inline-block rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-signal">
            {eyebrow}
          </span>
          <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            {headline}
          </h1>
          <p className="mx-auto max-w-xl font-body text-lg text-slate-400">{subhead}</p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="font-body text-base leading-relaxed text-slate-600">{intro}</p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-paper">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {sections.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <div className="h-full rounded-xl border border-slate-200 bg-white p-6">
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

      {faqs?.length ? (
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
            <h2 className="mb-8 text-center font-display text-2xl font-bold text-ink">
              Frequently asked questions
            </h2>
            <div className="flex flex-col gap-6">
              {faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="mb-1.5 font-display text-base font-semibold text-ink">{f.q}</h3>
                  <p className="font-body text-sm leading-relaxed text-slate-500">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-paper">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="mb-5 font-display text-2xl font-bold text-ink">
            Ready to talk about your project?
          </h2>
          <a href="/#contact">
            <Button>Get in touch</Button>
          </a>
          <p className="mt-4 font-body text-sm text-slate-500">
            Or browse our{" "}
            <Link to="/" className="text-signal hover:underline">
              full range of services
            </Link>
            .
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

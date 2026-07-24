import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import Reveal from "../components/Reveal";
import Button from "../components/ui/Button";
import PageMeta from "../components/PageMeta";

export default function About() {
  const { t } = useTranslation();

  const solutions = [
    { title: t("about.solution1Title"), desc: t("about.solution1Desc") },
    { title: t("about.solution2Title"), desc: t("about.solution2Desc") },
  ];

  const values = [
    { title: t("about.value1Title"), desc: t("about.value1Desc") },
    { title: t("about.value2Title"), desc: t("about.value2Desc") },
    { title: t("about.value3Title"), desc: t("about.value3Desc") },
    { title: t("about.value4Title"), desc: t("about.value4Desc") },
  ];

  const pageMeta = <PageMeta title="About Interquark — Ecommerce & SaaS, built properly" description="Interquark connects businesses with vetted developers and agencies who build and maintain ecommerce stores and custom software." path="/about" />;

  return (
    <div className="min-h-screen bg-paper text-ink">
      {pageMeta}
      <Navbar />

      <section className="border-b border-slate-200 bg-ink">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="mb-5 inline-block rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-signal">
            {t("about.eyebrow").toUpperCase()}
          </span>
          <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            {t("about.heroTitle")}
          </h1>
          <p className="mx-auto mb-4 max-w-xl font-body text-lg text-slate-400">
            {t("about.heroLead")}
          </p>
          <p className="mx-auto max-w-xl font-body text-sm leading-relaxed text-slate-500">
            {t("about.heroBody")}
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="mb-10 text-center font-display text-2xl font-bold text-ink">
            {t("about.solutionsTitle")}
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
            {t("about.missionLabel").toUpperCase()}
          </span>
          <h2 className="font-display text-2xl font-bold text-ink">
            {t("about.missionText")}
          </h2>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="mb-10 text-center font-display text-2xl font-bold text-ink">
            {t("about.valuesTitle")}
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
                {t("about.ctaBusiness")}
              </p>
              <a href="/#contact">
                <Button>{t("about.ctaBusinessButton")}</Button>
              </a>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="mb-5 font-body text-sm text-slate-600">
                {t("about.ctaDeveloper")}
              </p>
              <Link to="/subscribe">
                <Button variant="secondary">{t("about.ctaDeveloperButton")}</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

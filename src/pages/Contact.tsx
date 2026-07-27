import { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import SupportWidget from "../components/SupportWidget";
import CartDrawer from "../components/CartDrawer";
import JoinModal from "../components/JoinModal";
import NewsletterModal from "../components/NewsletterModal";
import Button from "../components/ui/Button";
import PageMeta from "../components/PageMeta";
import { apiFetch } from "../lib/api";
import Reveal from "../components/Reveal";

export default function Contact() {
  const { t } = useTranslation();
  const [cartOpen, setCartOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [contact, setContact] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    timeline: "",
    message: "",
  });

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
      <PageMeta
        path="/contact"
        title="Contact | Interquark"
        description="Tell us about your project — AI, custom software, web apps, or SaaS — and we'll get back to you."
      />
      <Navbar onCartClick={() => setCartOpen(true)} onJoinClick={() => setJoinOpen(true)} />

      <section className="relative overflow-hidden border-b border-slate-200 bg-ink py-24">
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
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <h1 className="mb-3 font-display text-5xl font-bold text-white">{t("contact.title")}</h1>
          <p className="font-body text-base text-slate-400">{t("contact.subtitle")}</p>
        </div>
      </section>

      <section id="contact" className="light-section-depth border-b border-slate-200 bg-paper">
        <div className="mx-auto max-w-2xl px-6 py-16">
          {contactStatus === "sent" ? (
            <div className="rounded-xl border border-mint/30 bg-mint/10 p-6 text-center font-body text-mint">
              {t("contact.sent")}
            </div>
          ) : (
            <Reveal>
            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
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
              <input
                placeholder="Company (optional)"
                value={contact.company}
                onChange={(e) => setContact({ ...contact, company: e.target.value })}
                className="rounded-lg border border-slate-300 px-4 py-3 font-body text-sm focus:border-signal focus:outline-none"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <select
                  value={contact.projectType}
                  onChange={(e) => setContact({ ...contact, projectType: e.target.value })}
                  className="rounded-lg border border-slate-300 px-4 py-3 font-body text-sm text-slate-500 focus:border-signal focus:outline-none"
                >
                  <option value="">Project type</option>
                  <option value="Website / Web app">Website / Web app</option>
                  <option value="AI / Automation">AI / Automation</option>
                  <option value="SaaS platform">SaaS platform</option>
                  <option value="Ecommerce">Ecommerce</option>
                  <option value="Other">Other</option>
                </select>
                <select
                  value={contact.budget}
                  onChange={(e) => setContact({ ...contact, budget: e.target.value })}
                  className="rounded-lg border border-slate-300 px-4 py-3 font-body text-sm text-slate-500 focus:border-signal focus:outline-none"
                >
                  <option value="">Budget</option>
                  <option value="Under £2,000">Under £2,000</option>
                  <option value="£2,000 – £5,000">£2,000 – £5,000</option>
                  <option value="£5,000 – £15,000">£5,000 – £15,000</option>
                  <option value="£15,000+">£15,000+</option>
                </select>
                <select
                  value={contact.timeline}
                  onChange={(e) => setContact({ ...contact, timeline: e.target.value })}
                  className="rounded-lg border border-slate-300 px-4 py-3 font-body text-sm text-slate-500 focus:border-signal focus:outline-none"
                >
                  <option value="">Timeline</option>
                  <option value="ASAP">ASAP</option>
                  <option value="1–4 weeks">1–4 weeks</option>
                  <option value="1–3 months">1–3 months</option>
                  <option value="Just exploring">Just exploring</option>
                </select>
              </div>
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
            </Reveal>
          )}
        </div>
      </section>

      <SiteFooter />
      <SupportWidget audience="public" />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <JoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
      <NewsletterModal open={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
    </div>
  );
}

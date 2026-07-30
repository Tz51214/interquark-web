import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import SupportWidget from "../components/SupportWidget";
import CartDrawer from "../components/CartDrawer";
import JoinModal from "../components/JoinModal";
import NewsletterModal from "../components/NewsletterModal";
import PageMeta from "../components/PageMeta";
import Reveal from "../components/Reveal";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  label: string;
  items: FaqItem[];
}

const categories: FaqCategory[] = [
  {
    label: "Getting Started",
    items: [
      {
        q: "How do I start a project with Interquark?",
        a: "Browse our services catalog and add what you need to your cart, or book a free strategy call if you'd rather talk through your requirements first. Once you check out, an order is created and matched with a vetted freelancer.",
      },
      {
        q: "Do I need to know exactly what I want before I start?",
        a: "No — the strategy call exists for exactly this. If your requirements are still taking shape, that conversation helps scope the right service and tier before you commit to anything.",
      },
      {
        q: "Can I get a custom quote instead of using the fixed-tier pricing?",
        a: "Yes — use the contact form and describe your project. For anything outside our standard catalog, we'll follow up with a tailored quote.",
      },
    ],
  },
  {
    label: "Software Development",
    items: [
      {
        q: "What platforms do you build on?",
        a: "Depending on the project: Magento 2/Adobe Commerce, Shopify, WooCommerce, and WordPress for e-commerce and content sites, and custom full-stack builds (React/NestJS or similar) for SaaS products and web applications.",
      },
      {
        q: "Do you build custom software from scratch, or only use templates?",
        a: "Both, depending on what you need. Our WordPress/Shopify tiers use proven platforms for faster delivery. Our SaaS MVP and full-stack application tiers are built entirely to your spec — no page builder, no template.",
      },
      {
        q: "Who actually writes the code on my project?",
        a: "A freelancer from our vetted network, matched to your project's tech stack. Every freelancer goes through admin verification before they're allowed to take on client work.",
      },
    ],
  },
  {
    label: "Integrations",
    items: [
      {
        q: "Can you connect my site to my existing tools (CRM, email, etc.)?",
        a: "Yes — our AI Workflow Automation service is built specifically for this. It connects a webhook to your existing tools so events on one platform (a new order, a new lead) can trigger actions on another.",
      },
      {
        q: "What payment gateways can you integrate?",
        a: "We currently process live payments through PayPal, with broader gateway support (Stripe, regional providers, digital wallets) available depending on your project's requirements.",
      },
    ],
  },
  {
    label: "AI Solutions",
    items: [
      {
        q: "What kind of AI features can you add to my store or site?",
        a: "From simple rule-based FAQ chatbots to fully AI-powered assistants trained on your product catalog, plus workflow automations that connect your tools together — see our AI Development services for details.",
      },
      {
        q: "Do I need my own AI/LLM API key?",
        a: "For most AI features, no — we handle this as part of the build. If your project needs a specific provider or has particular data-handling requirements, we'll discuss that during scoping.",
      },
    ],
  },
  {
    label: "Cloud & Infrastructure",
    items: [
      {
        q: "Where is my site or application hosted?",
        a: "Depending on the project, we deploy to Cloudflare, AWS, or Cloudways — chosen based on your platform, traffic expectations, and budget.",
      },
      {
        q: "Do you handle ongoing hosting and infrastructure management?",
        a: "Yes, through our retainer plans, which cover maintenance, updates, and infrastructure monitoring after launch.",
      },
    ],
  },
  {
    label: "Project Process",
    items: [
      {
        q: "How do I track progress on my project?",
        a: "Through your customer portal — real-time project status, invoices, and direct messaging with your assigned developer, so you're never waiting on a vague status update.",
      },
      {
        q: "How long does a typical project take?",
        a: "It depends entirely on scope and tier — smaller builds like a business website can be days, while a full SaaS MVP or production application is typically weeks. Each service listing shows its expected delivery timeframe.",
      },
    ],
  },
  {
    label: "Pricing",
    items: [
      {
        q: "Is your pricing fixed, or does it change per project?",
        a: "Our catalog uses fixed-tier pricing so you know the cost upfront before committing. Projects outside the standard catalog are quoted individually after a scoping conversation.",
      },
      {
        q: "Do you offer discounts?",
        a: "From time to time, yes — discount codes are applied at checkout when available.",
      },
      {
        q: "What payment methods do you accept?",
        a: "PayPal is currently our live payment method for checkout.",
      },
    ],
  },
  {
    label: "Security",
    items: [
      {
        q: "Is my data handled securely?",
        a: "Yes — we follow secure development practices and are GDPR compliant. Sensitive project details can be covered under an NDA on request.",
      },
      {
        q: "Do you offer security remediation for existing sites?",
        a: "Yes, this is one of our core areas of expertise, particularly for Magento/Adobe Commerce and WordPress sites with existing vulnerabilities.",
      },
    ],
  },
  {
    label: "Support",
    items: [
      {
        q: "What happens after my project launches?",
        a: "Support doesn't end at launch — our retainer plans keep your site maintained, secure, and updated, and you can message your assigned developer directly through your customer portal for anything that comes up.",
      },
      {
        q: "Do you offer a warranty or bug-fix period after delivery?",
        a: "Post-launch support is included as standard, with retainer plans available for ongoing maintenance beyond the initial period.",
      },
    ],
  },
  {
    label: "Contact",
    items: [
      {
        q: "How do I get in touch?",
        a: "Use our contact form, book a free strategy call, or reach us directly at hello@interquark.co.uk.",
      },
      {
        q: "Where is Interquark based?",
        a: "Interquark Ltd is a UK-registered company, based at 23 Abbot Street, Wrexham, LL11 1TA.",
      },
    ],
  },
];

export default function Faq() {
  const [cartOpen, setCartOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((cat) =>
      cat.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <PageMeta
        path="/faq"
        title="FAQ | Interquark"
        description="Answers to common questions about starting a project, pricing, security, support, and more."
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar onCartClick={() => setCartOpen(true)} onJoinClick={() => setJoinOpen(true)} />

      <section className="relative overflow-hidden border-b border-slate-200 bg-ink py-24">
        <div className="hero-grid opacity-40" />
        <div className="hero-blob h-72 w-72 bg-signal/30" style={{ top: "10%", left: "5%" }} />
        <div
          className="hero-blob h-96 w-96 bg-mint/20"
          style={{ bottom: "5%", right: "10%", animationDelay: "3s" }}
        />
        <div className="relative mx-auto max-w-2xl px-6 text-center">
          <h1 className="mb-3 font-display text-5xl font-bold text-white">
            Frequently asked questions
          </h1>
          <p className="font-body text-base text-slate-400">
            Everything you need to know before starting a project.
          </p>
        </div>
      </section>

      <section className="light-section-depth border-b border-slate-200 bg-paper">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((cat, i) => (
              <button
                key={cat.label}
                onClick={() => {
                  setActiveCategory(i);
                  setOpenIndex(null);
                }}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  activeCategory === i
                    ? "border-signal bg-signal text-white"
                    : "border-slate-300 text-slate-600 hover:border-signal hover:text-signal"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <Reveal>
            <div className="flex flex-col gap-3">
              {categories[activeCategory].items.map((item, i) => (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="font-display text-sm font-semibold text-ink">{item.q}</span>
                    <span className="shrink-0 text-slate-400">{openIndex === i ? "−" : "+"}</span>
                  </button>
                  {openIndex === i && (
                    <div className="border-t border-slate-100 px-5 py-4">
                      <p className="font-body text-sm leading-relaxed text-slate-600">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
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

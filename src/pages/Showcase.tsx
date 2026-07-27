import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import SupportWidget from "../components/SupportWidget";
import CartDrawer from "../components/CartDrawer";
import JoinModal from "../components/JoinModal";
import NewsletterModal from "../components/NewsletterModal";
import Button from "../components/ui/Button";
import PageMeta from "../components/PageMeta";
import BrowserMockup, { AnimatedBarChart } from "../components/BrowserMockup";
import Reveal from "../components/Reveal";

const accentColors: Record<string, { text: string; bg: string; border: string }> = {
  signal: { text: "text-signal", bg: "bg-signal/10", border: "border-signal/30" },
  mint: { text: "text-mint", bg: "bg-mint/10", border: "border-mint/30" },
  amber: { text: "text-amber-600", bg: "bg-amber-100", border: "border-amber-300" },
  purple: { text: "text-purple-600", bg: "bg-purple-100", border: "border-purple-300" },
  blue: { text: "text-blue-600", bg: "bg-blue-100", border: "border-blue-300" },
  teal: { text: "text-teal-600", bg: "bg-teal-100", border: "border-teal-300" },
  green: { text: "text-green-600", bg: "bg-green-100", border: "border-green-300" },
  orange: { text: "text-orange-600", bg: "bg-orange-100", border: "border-orange-300" },
  rose: { text: "text-rose-600", bg: "bg-rose-100", border: "border-rose-300" },
  yellow: { text: "text-yellow-700", bg: "bg-yellow-100", border: "border-yellow-300" },
};

function ShowcaseCard({
  title,
  sentence,
  chips,
  color,
  ctaLink,
  ctaText,
  children,
}: {
  title: string;
  sentence: string;
  chips: string[];
  color: keyof typeof accentColors;
  ctaLink: string;
  ctaText: string;
  children: ReactNode;
}) {
  const c = accentColors[color];
  return (
    <Reveal>
      <h2 className="mb-2 font-display text-2xl font-bold text-ink">{title}</h2>
      <p className="mb-3 max-w-xl font-body text-sm text-slate-500">{sentence}</p>
      <div className="mb-5 flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <span
            key={chip}
            className={`rounded-full border ${c.border} ${c.bg} px-2.5 py-1 font-mono text-[10px] font-semibold ${c.text}`}
          >
            {chip}
          </span>
        ))}
      </div>
      {children}
      {ctaLink && (
        <Link
          to={ctaLink}
          className={`mt-4 inline-block text-sm font-semibold ${c.text} hover:underline`}
        >
          {ctaText} →
        </Link>
      )}
    </Reveal>
  );
}

function MidCta() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
      <h3 className="mb-2 font-display text-xl font-bold text-ink">
        Ready to build something similar?
      </h3>
      <p className="mb-5 font-body text-sm text-slate-500">Let's discuss your project.</p>
      <Link to="/contact">
        <Button>Book a consultation</Button>
      </Link>
    </div>
  );
}

export default function Showcase() {
  const [cartOpen, setCartOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <PageMeta
        path="/showcase"
        title="Showcase | Interquark"
        description="Realistic examples of enterprise software we can build for your business — across ecommerce, SaaS, healthcare, logistics, and more."
      />
      <Navbar onCartClick={() => setCartOpen(true)} onJoinClick={() => setJoinOpen(true)} />

      <section className="relative overflow-hidden border-b border-slate-200 bg-ink py-24 text-center">
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
        <div className="relative mx-auto max-w-3xl px-6">
          <h1 className="mb-3 font-display text-5xl font-bold text-white">
            Realistic examples of enterprise software we can build
          </h1>
          <p className="mb-4 font-body text-base text-slate-400">
            Custom software concepts across multiple industries. Illustrative examples of what
            these builds look like when delivered — not real client screenshots.
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 font-mono text-[11px] text-slate-500">
            <span className="text-mint">✓ Scalable architecture</span>
            <span className="text-mint">✓ Security-first development</span>
            <span className="text-mint">✓ Cloud-ready deployments</span>
            <span className="text-mint">✓ UK-based project management</span>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
        {/* Magento build */}
        <ShowcaseCard
          title="Magento 2 / Adobe Commerce Build"
          sentence="Turn browsers into buyers with a fast, secure storefront built to handle real sales volume."
          chips={["🛒 Multi-gateway checkout", "⚡ Performance-tuned", "🔒 PCI-ready"]}
          color="yellow"
          ctaLink="/services/mg-01"
          ctaText="Build this for my business"
        >
          <BrowserMockup url="yourstore.example.com">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="h-3 w-20 rounded bg-ink/80" />
                <div className="flex gap-3">
                  <div className="h-2.5 w-10 rounded bg-slate-200" />
                  <div className="h-2.5 w-10 rounded bg-slate-200" />
                  <div className="h-2.5 w-10 rounded bg-slate-200" />
                </div>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-signal/10 text-[10px]">
                  🛒
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { color: "from-signal/20 to-signal/5", price: "£49" },
                  { color: "from-mint/20 to-mint/5", price: "£89" },
                  { color: "from-amber-200/40 to-amber-100/10", price: "£129" },
                ].map((p, i) => (
                  <div key={i} className="overflow-hidden rounded-lg border border-slate-100 shadow-sm">
                    <div className={`h-16 bg-gradient-to-br ${p.color}`} />
                    <div className="p-2">
                      <div className="mb-1 h-2 w-3/4 rounded bg-slate-200" />
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-ink">{p.price}</span>
                        <span className="rounded bg-signal px-1.5 py-0.5 text-[8px] font-semibold text-white">
                          Add
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BrowserMockup>
        </ShowcaseCard>

        {/* SaaS platform */}
        <ShowcaseCard
          title="Multi-Tenant SaaS / ERP Platform"
          sentence="Launch a subscription platform with billing, role-based access, and multi-tenant data isolation built in from day one."
          chips={["🔑 RBAC", "💳 Billing built-in", "🏢 Multi-tenant"]}
          color="blue"
          ctaLink="/services/saas-01"
          ctaText="Learn how we build this"
        >
          <BrowserMockup url="app.yourplatform.example.com">
            <div className="flex gap-4">
              <div className="flex w-20 flex-shrink-0 flex-col gap-2 border-r border-slate-100 pr-3">
                {["🏠", "📊", "👥", "💳", "⚙️"].map((icon, i) => (
                  <div
                    key={i}
                    className={`flex h-7 items-center justify-center rounded-md text-xs ${
                      i === 1 ? "bg-signal/10" : ""
                    }`}
                  >
                    {icon}
                  </div>
                ))}
              </div>
              <div className="flex-1">
                <div className="mb-3 grid grid-cols-3 gap-2">
                  {[
                    { label: "MRR", value: "£12.4k" },
                    { label: "Tenants", value: "24" },
                    { label: "Churn", value: "1.2%" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg border border-slate-100 p-2">
                      <p className="font-mono text-[9px] text-slate-400">{s.label}</p>
                      <p className="font-mono text-sm font-bold text-ink">{s.value}</p>
                    </div>
                  ))}
                </div>
                <h3 className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Monthly active tenants
                </h3>
                <AnimatedBarChart
                  data={[
                    { label: "Jan", value: 8 },
                    { label: "Feb", value: 12 },
                    { label: "Mar", value: 15 },
                    { label: "Apr", value: 19 },
                    { label: "May", value: 24 },
                  ]}
                />
              </div>
            </div>
          </BrowserMockup>
        </ShowcaseCard>

        {/* Full-stack web app */}
        <ShowcaseCard
          title="Full-Stack Web Application"
          sentence="A custom-built application designed around your exact workflow — not a template, not a page builder."
          chips={["🧩 Fully custom", "📈 Built to scale", "🔗 API-first"]}
          color="signal"
          ctaLink="/services/sw-01"
          ctaText="Request a similar solution"
        >
          <BrowserMockup url="yourapp.example.com">
            <div className="flex gap-3">
              <div className="flex w-28 flex-shrink-0 flex-col gap-1.5">
                {["Dashboard", "Projects", "Team", "Reports"].map((label, i) => (
                  <div
                    key={label}
                    className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 font-mono text-[10px] ${
                      i === 0 ? "bg-signal/10 text-signal" : "text-slate-400"
                    }`}
                  >
                    <span className={`h-1 w-1 rounded-full ${i === 0 ? "bg-signal" : "bg-slate-300"}`} />
                    {label}
                  </div>
                ))}
              </div>
              <div className="flex-1 rounded-lg bg-slate-50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="h-2.5 w-24 rounded bg-slate-300" />
                  <div className="h-5 w-14 rounded bg-signal/80" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="rounded-md border border-slate-200 bg-white p-2">
                      <div className="mb-1.5 h-2 w-full rounded bg-slate-100" />
                      <div className="h-1.5 w-2/3 rounded bg-slate-100" />
                      <div className="mt-2 h-1 w-full rounded-full bg-slate-100">
                        <div
                          className="h-1 rounded-full bg-mint"
                          style={{ width: i === 1 ? "72%" : "45%" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BrowserMockup>
        </ShowcaseCard>

        {/* AI automation */}
        <ShowcaseCard
          title="Store Automation & AI Agents"
          sentence="Cut manual busywork with agents that triage orders, flag low stock, and follow up with customers automatically."
          chips={["🤖 AI agents", "⏱ Real-time triggers", "📩 Automated follow-ups"]}
          color="purple"
          ctaLink="/services/ai-02"
          ctaText="Build this for my business"
        >
          <BrowserMockup url="automation.example.com">
            <div className="flex flex-col gap-2.5">
              {[
                { icon: "📦", title: "Inventory alert sent", sub: "12 SKUs below threshold", time: "2m ago" },
                { icon: "🔄", title: "Order #4821 triaged", sub: "Routed to fulfillment queue", time: "8m ago" },
                { icon: "✉️", title: "Follow-up email queued", sub: "3 customers, abandoned cart", time: "14m ago" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-sm shadow-sm">
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <p className="font-body text-xs font-semibold text-ink">{item.title}</p>
                    <p className="font-body text-[11px] text-slate-400">{item.sub}</p>
                  </div>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </BrowserMockup>
        </ShowcaseCard>

        <MidCta />

        {/* Healthcare dashboard */}
        <ShowcaseCard
          title="Healthcare Dashboard"
          sentence="Give care teams one place to manage scheduling, records, and coordination — securely and reliably."
          chips={["🏥 HIPAA-aware design", "📅 Scheduling", "💬 Care team messaging"]}
          color="green"
          ctaLink=""
          ctaText=""
        >
          <BrowserMockup url="portal.healthexample.com">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Today's appointments", value: "14" },
                { label: "Pending results", value: "3" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-slate-100 p-2.5">
                  <p className="font-mono text-[9px] text-slate-400">{s.label}</p>
                  <p className="font-mono text-lg font-bold text-ink">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex flex-col gap-1.5">
              {["9:00 — J. Carter", "9:30 — M. Hendricks", "10:15 — R. Osei"].map((r) => (
                <div
                  key={r}
                  className="flex items-center gap-2 rounded-md bg-slate-50 px-2.5 py-1.5 font-mono text-[10px] text-slate-500"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  {r}
                </div>
              ))}
            </div>
          </BrowserMockup>
        </ShowcaseCard>

        {/* E-commerce admin */}
        <ShowcaseCard
          title="E-commerce Admin"
          sentence="See orders, inventory, and fulfillment status in one dashboard instead of five different tabs."
          chips={["📊 Sales analytics", "📦 Inventory sync", "🚚 Fulfillment tracking"]}
          color="rose"
          ctaLink=""
          ctaText=""
        >
          <BrowserMockup url="admin.storeexample.com">
            <AnimatedBarChart
              data={[
                { label: "Mon", value: 12 },
                { label: "Tue", value: 18 },
                { label: "Wed", value: 9 },
                { label: "Thu", value: 22 },
                { label: "Fri", value: 27 },
              ]}
            />
            <div className="mt-3 flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 font-mono text-[10px] text-slate-500">
              <span>Order #4821 — Shipped</span>
              <span className="rounded-full bg-mint/10 px-2 py-0.5 text-mint">Fulfilled</span>
            </div>
          </BrowserMockup>
        </ShowcaseCard>

        {/* Logistics tracking */}
        <ShowcaseCard
          title="Logistics Tracking"
          sentence="Reduce delivery delays with real-time fleet visibility, automated status updates, and customer tracking."
          chips={["📍 Live tracking", "🔔 Automated alerts", "🚛 Fleet visibility"]}
          color="teal"
          ctaLink=""
          ctaText=""
        >
          <BrowserMockup url="track.logisticsexample.com">
            <div className="flex flex-col gap-2">
              {[
                { id: "SHP-3021", status: "In transit", pct: 65 },
                { id: "SHP-3022", status: "Out for delivery", pct: 90 },
                { id: "SHP-3023", status: "Delivered", pct: 100 },
              ].map((s) => (
                <div key={s.id} className="rounded-md border border-slate-100 p-2">
                  <div className="mb-1 flex items-center justify-between font-mono text-[10px] text-slate-500">
                    <span>{s.id}</span>
                    <span>{s.status}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-teal-500" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </BrowserMockup>
        </ShowcaseCard>

        <MidCta />

        {/* Restaurant ordering */}
        <ShowcaseCard
          title="Restaurant Ordering"
          sentence="Speed up service with table-side ordering that syncs straight to the kitchen — no relayed tickets, no mistakes."
          chips={["🍽 Table-side ordering", "👨‍🍳 Live kitchen sync", "💳 Integrated payments"]}
          color="orange"
          ctaLink=""
          ctaText=""
        >
          <BrowserMockup url="order.restaurantexample.com">
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: "Margherita Pizza", price: "£12" },
                { name: "Caesar Salad", price: "£8" },
                { name: "Grilled Salmon", price: "£18" },
                { name: "Tiramisu", price: "£6" },
              ].map((item) => (
                <div key={item.name} className="rounded-md border border-slate-100 p-2">
                  <div className="mb-1 h-10 rounded bg-gradient-to-br from-amber-100 to-amber-50" />
                  <p className="font-body text-[10px] font-semibold text-ink">{item.name}</p>
                  <p className="font-mono text-[10px] text-orange-600">{item.price}</p>
                </div>
              ))}
            </div>
          </BrowserMockup>
        </ShowcaseCard>

        {/* Property management */}
        <ShowcaseCard
          title="Property Management"
          sentence="Cut down on phone-tag with a tenant portal for rent, maintenance requests, and building updates."
          chips={["🏠 Tenant portal", "🔧 Maintenance requests", "💰 Rent tracking"]}
          color="amber"
          ctaLink=""
          ctaText=""
        >
          <BrowserMockup url="portal.propertyexample.com">
            <div className="flex flex-col gap-2">
              {[
                { unit: "Unit 4B", status: "Rent paid", ok: true },
                { unit: "Unit 2A", status: "Maintenance requested", ok: false },
                { unit: "Unit 6C", status: "Rent paid", ok: true },
              ].map((u) => (
                <div
                  key={u.unit}
                  className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2 font-mono text-[10px] text-slate-500"
                >
                  <span>{u.unit}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 ${
                      u.ok ? "bg-mint/10 text-mint" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </div>
              ))}
            </div>
          </BrowserMockup>
        </ShowcaseCard>

        {/* Manufacturing ERP */}
        <ShowcaseCard
          title="Manufacturing ERP"
          sentence="Keep production lines, inventory, and supplier orders visible in one system instead of scattered spreadsheets."
          chips={["🏭 Production tracking", "📦 Inventory control", "🤝 Supplier orders"]}
          color="blue"
          ctaLink=""
          ctaText=""
        >
          <BrowserMockup url="erp.manufacturingexample.com">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Line A", pct: 82 },
                { label: "Line B", pct: 45 },
                { label: "Line C", pct: 97 },
              ].map((l) => (
                <div key={l.label} className="rounded-md border border-slate-100 p-2 text-center">
                  <p className="mb-1 font-mono text-[9px] text-slate-400">{l.label}</p>
                  <p className="font-mono text-sm font-bold text-ink">{l.pct}%</p>
                </div>
              ))}
            </div>
          </BrowserMockup>
        </ShowcaseCard>

        <MidCta />
      </div>

      <SiteFooter />
      <SupportWidget audience="public" />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <JoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
      <NewsletterModal open={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
    </div>
  );
}

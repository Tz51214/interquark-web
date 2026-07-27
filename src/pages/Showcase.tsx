import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import SupportWidget from "../components/SupportWidget";
import CartDrawer from "../components/CartDrawer";
import JoinModal from "../components/JoinModal";
import NewsletterModal from "../components/NewsletterModal";
import PageMeta from "../components/PageMeta";
import BrowserMockup, { AnimatedBarChart } from "../components/BrowserMockup";
import Reveal from "../components/Reveal";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-3 inline-block rounded-full border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-[11px] font-semibold tracking-wide text-signal">
      {children}
    </span>
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
        description="Illustrative examples of what our flagship services look like when delivered — Magento builds, SaaS platforms, custom web applications, and AI automation."
      />
      <Navbar onCartClick={() => setCartOpen(true)} onJoinClick={() => setJoinOpen(true)} />

      <section className="border-b border-slate-200 bg-white py-14 text-center">
        <div className="mx-auto max-w-3xl px-6">
          <h1 className="mb-3 font-display text-4xl font-bold text-ink">Showcase</h1>
          <p className="font-body text-base text-slate-500">
            Illustrative examples of what these builds look like when delivered — not real
            client screenshots.
          </p>
        </div>
      </section>

      <div className="mx-auto flex max-w-5xl flex-col gap-20 px-6 py-16">
        {/* Magento build — realistic storefront */}
        <Reveal>
          <Badge>ILLUSTRATIVE EXAMPLE</Badge>
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">
            Magento 2 / Adobe Commerce Build
          </h2>
          <p className="mb-6 font-body text-sm text-slate-500">
            A full enterprise storefront — custom theme, multiple payment gateways, and cloud
            infrastructure.
          </p>
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
          <Link
            to="/services/mg-01"
            className="mt-4 inline-block text-sm font-semibold text-signal hover:underline"
          >
            View this service →
          </Link>
        </Reveal>

        {/* SaaS platform — realistic dashboard */}
        <Reveal>
          <Badge>ILLUSTRATIVE EXAMPLE</Badge>
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">
            Multi-Tenant SaaS / ERP Platform
          </h2>
          <p className="mb-6 font-body text-sm text-slate-500">
            RBAC, ledger and invoicing, admin dashboard, and full API layer.
          </p>
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
          <Link
            to="/services/saas-01"
            className="mt-4 inline-block text-sm font-semibold text-signal hover:underline"
          >
            View this service →
          </Link>
        </Reveal>

        {/* Full-stack web app — realistic app layout */}
        <Reveal>
          <Badge>ILLUSTRATIVE EXAMPLE</Badge>
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">
            Full-Stack Web Application
          </h2>
          <p className="mb-6 font-body text-sm text-slate-500">
            A custom-built application from the ground up — not a template, not a page builder.
          </p>
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
          <Link
            to="/services/sw-01"
            className="mt-4 inline-block text-sm font-semibold text-signal hover:underline"
          >
            View this service →
          </Link>
        </Reveal>

        {/* AI automation — realistic agent/chat interface */}
        <Reveal>
          <Badge>ILLUSTRATIVE EXAMPLE</Badge>
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">
            Store Automation & AI Agents
          </h2>
          <p className="mb-6 font-body text-sm text-slate-500">
            Automate repetitive operations — inventory alerts, order triage, customer
            follow-ups.
          </p>
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
          <Link
            to="/services/ai-02"
            className="mt-4 inline-block text-sm font-semibold text-signal hover:underline"
          >
            View this service →
          </Link>
        </Reveal>

        {/* Healthcare dashboard */}
        <Reveal>
          <Badge>ILLUSTRATIVE EXAMPLE</Badge>
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">Healthcare Dashboard</h2>
          <p className="mb-6 font-body text-sm text-slate-500">
            Patient scheduling, records access, and care team coordination.
          </p>
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
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                  {r}
                </div>
              ))}
            </div>
          </BrowserMockup>
        </Reveal>

        {/* E-commerce admin */}
        <Reveal>
          <Badge>ILLUSTRATIVE EXAMPLE</Badge>
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">E-commerce Admin</h2>
          <p className="mb-6 font-body text-sm text-slate-500">
            Order management, inventory, and fulfillment at a glance.
          </p>
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
        </Reveal>

        {/* Logistics tracking */}
        <Reveal>
          <Badge>ILLUSTRATIVE EXAMPLE</Badge>
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">Logistics Tracking</h2>
          <p className="mb-6 font-body text-sm text-slate-500">
            Real-time shipment status across a delivery fleet.
          </p>
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
                    <div className="h-full rounded-full bg-signal" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </BrowserMockup>
        </Reveal>

        {/* Restaurant ordering */}
        <Reveal>
          <Badge>ILLUSTRATIVE EXAMPLE</Badge>
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">Restaurant Ordering</h2>
          <p className="mb-6 font-body text-sm text-slate-500">
            Table-side ordering with live kitchen ticket sync.
          </p>
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
                  <p className="font-mono text-[10px] text-signal">{item.price}</p>
                </div>
              ))}
            </div>
          </BrowserMockup>
        </Reveal>

        {/* Property management */}
        <Reveal>
          <Badge>ILLUSTRATIVE EXAMPLE</Badge>
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">Property Management</h2>
          <p className="mb-6 font-body text-sm text-slate-500">
            Tenant portal, maintenance requests, and rent tracking.
          </p>
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
        </Reveal>

        {/* Manufacturing ERP */}
        <Reveal>
          <Badge>ILLUSTRATIVE EXAMPLE</Badge>
          <h2 className="mb-2 font-display text-2xl font-bold text-ink">Manufacturing ERP</h2>
          <p className="mb-6 font-body text-sm text-slate-500">
            Production line status, inventory, and supplier orders.
          </p>
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
        </Reveal>
      </div>

      <SiteFooter />
      <SupportWidget audience="public" />

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <JoinModal open={joinOpen} onClose={() => setJoinOpen(false)} />
      <NewsletterModal open={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
    </div>
  );
}

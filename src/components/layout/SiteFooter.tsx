import { useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../lib/api";
import logo from "../../assets/interquark-wordmark-white.png";

const categoriesA = [
  { label: "AI Development", href: "/ai-development" },
  { label: "Custom Software", href: "/custom-software-development" },
  { label: "Web Development", href: "/web-application-development" },
  { label: "SaaS Platforms", href: "/saas-development" },
];

const categoriesB = [
  { label: "Cybersecurity", href: "/services#security" },
  { label: "Cloud & Migrations", href: "/services#cloud" },
  { label: "Website Maintenance", href: "/services#maintenance" },
  { label: "Retainers", href: "/services#retainer" },
];

const trustBadges = [
  { icon: "✓", label: "GDPR Compliant" },
  { icon: "✓", label: "UK Registered" },
  { icon: "🔒", label: "SSL Secured" },
  { icon: "✓", label: "Secure Payments" },
  { icon: "✓", label: "PayPal" },
  { icon: "✓", label: "Visa" },
  { icon: "✓", label: "Mastercard" },
];

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit() {
    if (!email) return;
    setStatus("sending");
    const { ok } = await apiFetch("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    setStatus(ok ? "sent" : "error");
  }

  return (
    <footer className="border-t border-line bg-ink pb-24">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        {/* Newsletter — luxurious card with subtle glow */}
        <div className="relative mb-20 overflow-hidden rounded-2xl border border-line bg-ink-light p-8 text-center sm:p-10">
          <div
            className="pointer-events-none absolute -top-1/2 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-signal/10 opacity-90 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <h3 className="mb-2 font-display text-xl font-semibold text-white">
              Stay ahead with Interquark
            </h3>
            <p className="mx-auto mb-6 max-w-md font-body text-sm text-slate-400">
              Receive occasional insights on AI, software engineering, and product development.
            </p>
            {status === "sent" ? (
              <p className="font-body text-sm text-mint">You're subscribed — thank you.</p>
            ) : (
              <div className="mx-auto flex max-w-md flex-col gap-2.5 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 rounded-lg border border-line bg-ink px-4 py-3 font-body text-sm text-white placeholder:text-slate-500 focus:border-signal focus:outline-none"
                />
                <button
                  onClick={submit}
                  disabled={status === "sending"}
                  className="rounded-lg bg-signal px-6 py-3 font-body text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-signal-dark disabled:opacity-60"
                >
                  {status === "sending" ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
            )}
            {status === "error" && (
              <p className="mt-3 font-body text-xs text-red-400">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>

        {/* Footer links — more spacing, stronger hierarchy */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-6">
          <div className="col-span-2 sm:col-span-1">
            <img src={logo} alt="Interquark" className="mb-1 h-7 w-auto transition-opacity hover:opacity-80" />
            <p className="mb-5 font-mono text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Software Engineering · Built in the UK
            </p>
            <p className="mb-6 max-w-[220px] font-body text-xs leading-relaxed text-slate-500">
              Building secure software, AI solutions, and digital products for businesses across
              the UK.
            </p>
            <div className="font-body text-xs leading-loose text-slate-500">
              <p>📍 Wrexham, United Kingdom</p>
              <p>
                <a
                  href="mailto:hello@interquark.co.uk"
                  className="font-semibold text-signal hover:underline"
                >
                  ✉ hello@interquark.co.uk
                </a>
              </p>
              <p>☎ +44 7438 269993</p>
              <p className="mt-3 text-slate-600">
                Business Hours
                <br />
                Mon–Fri, 9:00–18:00 GMT
              </p>
            </div>
          </div>
          <div>
            <h4 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
              SERVICES
            </h4>
            <ul className="flex flex-col gap-3 font-body text-sm text-slate-400">
              {categoriesA.map((c) => (
                <li key={c.href}>
                  <Link
                    to={c.href}
                    className="inline-block transition-transform hover:translate-x-0.5 hover:text-signal"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4
              className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-400 invisible"
              aria-hidden="true"
            >
              SERVICES
            </h4>
            <ul className="flex flex-col gap-3 font-body text-sm text-slate-400">
              {categoriesB.map((c) => (
                <li key={c.href}>
                  <Link
                    to={c.href}
                    className="inline-block transition-transform hover:translate-x-0.5 hover:text-signal"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
              FOR CLIENTS
            </h4>
            <ul className="flex flex-col gap-3 font-body text-sm text-slate-400">
              <li>
                <Link to="/services" className="inline-block transition-transform hover:translate-x-0.5 hover:text-signal">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/help" className="inline-block transition-transform hover:translate-x-0.5 hover:text-signal">
                  Interquark Answers
                </Link>
              </li>
              <li>
                <Link to="/faq" className="inline-block transition-transform hover:translate-x-0.5 hover:text-signal">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="inline-block transition-transform hover:translate-x-0.5 hover:text-signal">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
              FOR FREELANCERS
            </h4>
            <ul className="flex flex-col gap-3 font-body text-sm text-slate-400">
              <li>
                <Link to="/subscribe" className="inline-block transition-transform hover:translate-x-0.5 hover:text-signal">
                  Membership plans
                </Link>
              </li>
              <li>
                <Link to="/freelancer" className="inline-block transition-transform hover:translate-x-0.5 hover:text-signal">
                  Freelancer sign in
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-slate-400">
              COMPANY
            </h4>
            <ul className="flex flex-col gap-3 font-body text-sm text-slate-400">
              <li><Link to="/about" className="inline-block transition-transform hover:translate-x-0.5 hover:text-signal">About us</Link></li>
              <li><Link to="/help" className="inline-block transition-transform hover:translate-x-0.5 hover:text-signal">Help Center</Link></li>
              <li><Link to="/careers" className="inline-block transition-transform hover:translate-x-0.5 hover:text-signal">Careers</Link></li>
              <li><Link to="/terms" className="inline-block transition-transform hover:translate-x-0.5 hover:text-signal">Terms of Service</Link></li>
              <li><Link to="/privacy" className="inline-block transition-transform hover:translate-x-0.5 hover:text-signal">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Trust badges — subtle dark monochrome chips, no container */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
          {trustBadges.map((badge) => (
            <span
              key={badge.label}
              className="flex items-center gap-1.5 rounded-md border border-line bg-ink-light px-3 py-1.5 font-mono text-[10px] font-medium text-slate-400 transition-all hover:border-slate-600 hover:text-slate-300"
            >
              <span className="text-slate-500">{badge.icon}</span>
              {badge.label}
            </span>
          ))}
        </div>

        {/* Soft gradient divider */}
        <div
          className="mt-16 h-px w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(148,163,184,0.25), transparent)",
          }}
        />

        <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <span className="font-mono text-xs font-semibold tracking-wide text-signal">
            AI • SaaS • Custom Software
          </span>
          <span className="font-mono text-xs text-slate-500">
            © {new Date().getFullYear()} Interquark Ltd. Built with precision in the United
            Kingdom.
          </span>
        </div>
      </div>
    </footer>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import NewsletterModal from "../NewsletterModal";
import logo from "../../assets/interquark-wordmark-white.png";

const categoriesA = [
  { label: "AI Development", href: "/ai-development" },
  { label: "Custom Software", href: "/custom-software-development" },
  { label: "Web Development", href: "/web-application-development" },
  { label: "SaaS Platforms", href: "/saas-development" },
];

const categoriesB = [
  { label: "Cybersecurity", href: "/#security" },
  { label: "Cloud & Migrations", href: "/#cloud" },
  { label: "Website Maintenance", href: "/#maintenance" },
  { label: "Retainers", href: "/#retainer" },
];

export default function SiteFooter() {
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  return (
    <footer className="border-t border-line bg-ink pb-24">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-12 rounded-xl border border-line bg-ink-light p-6 text-center">
          <h3 className="mb-1.5 font-display text-base font-semibold text-white">
            Get updates from Interquark
          </h3>
          <p className="mb-4 font-body text-xs text-slate-400">
            New services and platform updates, occasionally. No spam.
          </p>
          <button
            onClick={() => setNewsletterOpen(true)}
            className="rounded-lg bg-signal px-5 py-2.5 font-body text-sm font-semibold text-white hover:bg-signal-dark"
          >
            Subscribe
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-6">
          <div className="col-span-2 sm:col-span-1">
            <img src={logo} alt="Interquark" className="mb-3 h-6 w-auto" />
            <div className="font-body text-xs leading-relaxed text-slate-500">
              <p>📍 Wrexham, United Kingdom</p>
              <p className="mt-2">
                <a
                  href="mailto:hello@interquark.co.uk"
                  className="font-semibold text-signal hover:underline"
                >
                  📧 hello@interquark.co.uk
                </a>
              </p>
              <p className="mt-2">📞 +44 7438 269993</p>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-mono text-[11px] font-semibold tracking-wide text-slate-500">
              SERVICES
            </h4>
            <ul className="flex flex-col gap-2 font-body text-sm text-slate-400">
              {categoriesA.map((c) => (
                <li key={c.href}>
                  <Link to={c.href} className="hover:text-signal">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-mono text-[11px] font-semibold tracking-wide text-slate-500 sm:invisible">
              SERVICES
            </h4>
            <ul className="flex flex-col gap-2 font-body text-sm text-slate-400">
              {categoriesB.map((c) => (
                <li key={c.href}>
                  <Link to={c.href} className="hover:text-signal">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-mono text-[11px] font-semibold tracking-wide text-slate-500">
              FOR CLIENTS
            </h4>
            <ul className="flex flex-col gap-2 font-body text-sm text-slate-400">
              <li><Link to="/#how-it-works" className="hover:text-signal">How it works</Link></li>
              <li><Link to="/guide" className="hover:text-signal">Interquark Guide</Link></li>
              <li><Link to="/help" className="hover:text-signal">Interquark Answers</Link></li>
              <li><Link to="/#contact" className="hover:text-signal">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-mono text-[11px] font-semibold tracking-wide text-slate-500">
              FOR FREELANCERS
            </h4>
            <ul className="flex flex-col gap-2 font-body text-sm text-slate-400">
              <li><Link to="/subscribe" className="hover:text-signal">Membership plans</Link></li>
              <li><Link to="/freelancer" className="hover:text-signal">Freelancer sign in</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-mono text-[11px] font-semibold tracking-wide text-slate-500">
              COMPANY
            </h4>
            <ul className="flex flex-col gap-2 font-body text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-signal">About us</Link></li>
              <li><Link to="/help" className="hover:text-signal">Help Center</Link></li>
              <li><Link to="/careers" className="hover:text-signal">Careers</Link></li>
              <li><Link to="/terms" className="hover:text-signal">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-signal">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-8 sm:flex-row">
          <span className="font-mono text-xs font-semibold tracking-wide text-signal">
            AI • SaaS • Custom Software
          </span>
          <span className="font-mono text-xs text-slate-500">
            © {new Date().getFullYear()} Interquark. All rights reserved. UK registered company.
          </span>
        </div>
      </div>
      <NewsletterModal open={newsletterOpen} onClose={() => setNewsletterOpen(false)} />
    </footer>
  );
}

import { useState } from "react";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Button from "../ui/Button";
import logo from "../../assets/interquark-wordmark-navy.png";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface NavbarProps {
  onCartClick?: () => void;
  onJoinClick?: () => void;
}

export default function Navbar({ onCartClick, onJoinClick }: NavbarProps) {
  const { items } = useCart();
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#webdev", label: t("nav.services"), id: "webdev" },
    { href: "/#growth", label: t("nav.growth"), id: "growth" },
    { href: "/#retainer", label: t("nav.retainers"), id: "retainer" },
    { href: "/#contact", label: t("nav.contact"), id: "contact" },
  ];
  const activeSection = useScrollSpy(navLinks.map((l) => l.id));

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Interquark" className="h-6 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 font-body text-sm font-medium text-slate-600 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`transition-colors hover:text-signal ${
                activeSection === link.id ? "font-semibold text-signal" : ""
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          {onCartClick && (
            <button
              onClick={onCartClick}
              className="relative rounded-lg border border-slate-300 px-3 py-2 font-body text-sm font-semibold text-slate-700 transition-colors hover:border-signal hover:text-signal"
              aria-label="Open cart"
            >
              {t("cart.cart")}
              {items.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-signal font-mono text-[11px] font-bold text-white">
                  {items.length}
                </span>
              )}
            </button>
          )}
          {onJoinClick ? (
            <Button onClick={onJoinClick}>{t("nav.join")}</Button>
          ) : (
            <Link to="/">
              <Button variant="secondary">{t("nav.backToStore")}</Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {onCartClick && (
            <button
              onClick={onCartClick}
              className="relative rounded-lg border border-slate-300 px-3 py-2 font-body text-sm font-semibold text-slate-700"
              aria-label="Open cart"
            >
              {t("cart.cart")}
              {items.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-signal font-mono text-[11px] font-bold text-white">
                  {items.length}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-slate-700"
            aria-label="Toggle menu"
          >
            {menuOpen ? "\u2715" : "\u2630"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="mb-4 flex flex-col gap-3 font-body text-sm font-medium text-slate-600">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-1.5 transition-colors hover:text-signal"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mb-4">
            <LanguageSwitcher />
          </div>
          {onJoinClick ? (
            <Button onClick={onJoinClick} className="w-full">
              {t("nav.join")}
            </Button>
          ) : (
            <Link to="/" className="block">
              <Button variant="secondary" className="w-full">
                {t("nav.backToStore")}
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

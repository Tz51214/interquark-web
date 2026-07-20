import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-300 p-0.5">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`rounded-md px-2 py-1 font-mono text-[11px] font-semibold transition-colors ${
            i18n.language === lang.code
              ? "bg-signal text-white"
              : "text-slate-500 hover:text-signal"
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

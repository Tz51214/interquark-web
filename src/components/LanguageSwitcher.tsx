import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-2 font-mono text-[11px] font-semibold">
      {languages.map((lang, i) => (
        <div key={lang.code} className="flex items-center gap-2">
          <button
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`transition-colors ${
              i18n.language === lang.code
                ? "text-signal"
                : "text-slate-400 hover:text-signal"
            }`}
          >
            {lang.label}
          </button>
          {i < languages.length - 1 && (
            <span className="text-slate-300">/</span>
          )}
        </div>
      ))}
    </div>
  );
}

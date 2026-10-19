import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useLanguage } from "../lib/i18n";
export default function Header() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const links = [
    [t("works"), "/projects"],
    [t("about"), "/about"],
    [t("contact"), "/contact"],
  ];
  return (
    <header className="site-header">
      <Link to="/" className="brand" onClick={() => setOpen(false)}>
        <span className="brand-symbol">HTT</span>
        <span>Tart</span>
      </Link>
      <button
        className="mobile-toggle"
        onClick={() => setOpen(!open)}
        aria-label={t("toggleMenu")}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? "nav-open" : ""}>
        <NavLink to="/" end onClick={() => setOpen(false)}>
          {t("home")}
        </NavLink>
        {links.map(([label, path]) => (
          <NavLink key={path} to={path} onClick={() => setOpen(false)}>
            {label}
          </NavLink>
        ))}
        <span className="nav-language">
          <button
            className={language === "en" ? "language-active" : ""}
            onClick={() => setLanguage("en")}
            aria-pressed={language === "en"}
          >
            EN
          </button>
          <span>/</span>
          <button
            className={language === "fr" ? "language-active" : ""}
            onClick={() => setLanguage("fr")}
            aria-pressed={language === "fr"}
          >
            FR
          </button>
        </span>
      </nav>
    </header>
  );
}

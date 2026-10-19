import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../lib/i18n";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <p className="eyebrow">{t("footerThanks")}</p>
          <h2>
            {t("footerLine1")}
            <br />
            <em>{t("footerLine2")}</em>
          </h2>
        </div>
        <Link to="/contact" className="round-link" aria-label={t("contact")}>
          <ArrowUpRight size={25} />
        </Link>
      </div>
      <div className="footer-bottom">
        <Link to="/" className="footer-brand">
          HTT Tart <span>{t("footerBrandSubtitle")}</span>
        </Link>
        <span>
          {t("footerMeta")} · {new Date().getFullYear()}
        </span>
        <Link to="/contact">{t("footerContact")}</Link>
      </div>
    </footer>
  );
}

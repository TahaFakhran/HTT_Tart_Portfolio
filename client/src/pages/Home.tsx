import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import MediaRenderer from "../components/MediaRenderer";
import { getProjects, getSettings } from "../lib/api";
import type { Project, SiteSettings } from "../types";
import { useLanguage } from "../lib/i18n";

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const { language, t } = useLanguage();

  useEffect(() => {
    getProjects()
      .then(setProjects)
      .catch(() => setProjects([]));
    getSettings()
      .then(setSettings)
      .catch(() => setSettings({}));
  }, []);

  const featured = projects.filter((project) => project.featured).slice(0, 4);
  const heroTitle =
    settings[language === "fr" ? "hero_title_fr" : "hero_title_en"] ?? "";
  const heroSubtitle =
    settings[language === "fr" ? "hero_subtitle_fr" : "hero_subtitle_en"] ?? "";
  const heroImage = settings.home_hero_image;
  const heroMediaType = settings.home_hero_media_type;

  return (
    <>
      <section className="hero page-shell">
        <div className="hero-topline">
          <span>
            <i className="status-dot" /> {t("available")}
          </span>
          <span>{t("heroTypes")}</span>
        </div>
        <div className={`hero-main ${heroImage ? "" : "hero-main-no-media"}`}>
          <div className="hero-copy">
            <p className="eyebrow hero-kicker">
              <span className="red-line" /> {t("heroKicker")}
            </p>
            {heroTitle && (
              <h1>
                {heroTitle.split("\n").map((line, index) => (
                  <span
                    key={`${index}-${line}`}
                    className={index === 1 ? "headline-italic" : undefined}
                  >
                    {line}
                    <br />
                  </span>
                ))}
              </h1>
            )}
            {heroSubtitle && <p className="hero-description">{heroSubtitle}</p>}
            <div className="hero-actions">
              <Link className="button-primary" to="/projects">
                {t("explore")} <ArrowUpRight size={17} />
              </Link>
              <span className="hero-note">
                {t("heroNote")
                  .split("\n")
                  .map((line) => (
                    <span key={line}>
                      {line}
                      <br />
                    </span>
                  ))}
              </span>
            </div>
          </div>
          {heroImage && (
            <div className="hero-art">
              <div className="art-frame">
                <MediaRenderer
                  src={heroImage}
                  type={heroMediaType}
                  alt={t("heroImageAlt")}
                  muted
                  autoPlay
                  loop
                  playsInline
                  loading="eager"
                />
                <span className="art-label art-label-top">
                  {t("heroImageTop")}
                </span>
                <span className="art-label art-label-bottom">
                  {t("heroImageBottom")}
                </span>
              </div>
              <div className="hero-stamp">
                HTT
                <br />
                <span>{t("heroStamp")}</span>
              </div>
              <div className="vertical-note">{t("heroVerticalNote")}</div>
            </div>
          )}
        </div>
        <a className="scroll-cue" href="#selected-work">
          <ArrowDown size={14} /> {t("scrollCue")}
        </a>
        <span className="hero-number">
          01 <span>/</span> 04
        </span>
      </section>

      <section className="selected-section page-shell" id="selected-work">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span className="red-line" /> {t("favourites")}
            </p>
            <h2>
              {t("selectedHeading")} <em>{t("selectedHeadingAccent")}</em>
            </h2>
          </div>
          <Link className="text-link" to="/projects">
            {t("allProjects")} <ArrowUpRight size={16} />
          </Link>
        </div>
        {featured.length > 0 && (
          <div className="masonry-grid">
            {featured.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
        <div className="all-work-row">
          <span>{t("workFooterNote")}</span>
          <Link to="/projects">
            {t("workFooterLink")} <ArrowUpRight size={15} />
          </Link>
        </div>
      </section>

      <section className="manifesto">
        <div className="manifesto-kanji">تارت</div>
        <div className="manifesto-content">
          <p className="eyebrow">{t("note")}</p>
          <h2>
            {t("manifestoHeadingLine1")}
            <br />
            <em>{t("manifestoHeadingLine2")}</em>
          </h2>
          <p>{t("manifestoBody")}</p>
          <Link to="/about" className="text-link">
            {t("manifestoLink")} <ArrowUpRight size={16} />
          </Link>
        </div>
        <span className="manifesto-side">{t("manifestoSide")}</span>
      </section>
    </>
  );
}

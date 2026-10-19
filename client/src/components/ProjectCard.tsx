import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../types";
import { translateCategory, useLanguage } from "../lib/i18n";
import MediaRenderer from "./MediaRenderer";

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const { language, t } = useLanguage();
  const title = language === "fr" ? project.title_fr : project.title_en;
  const src = project.cover_image;
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`project-card group block ${index % 4 === 1 ? "card-offset" : ""}`}
    >
      <div className="project-image-wrap">
        <MediaRenderer
          className="project-image"
          src={src}
          type={project.cover_media_type}
          alt={title}
          muted
          autoPlay
          loop
          playsInline
        />
        <span className="project-open">
          <ArrowUpRight size={18} />
        </span>
        {project.featured && (
          <span className="featured-mark">{t("featured")}</span>
        )}
      </div>
      <div className="project-caption">
        <div>
          <p className="eyebrow">
            {translateCategory(project.category, t)}{" "}
            <span className="caption-dot">/</span> {project.year ?? "—"}
          </p>
          <h3>{title}</h3>
        </div>
        <span className="project-index">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </Link>
  );
}

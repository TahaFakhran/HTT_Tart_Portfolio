import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { adminRequest } from "../lib/api";
import MediaRenderer from "../components/MediaRenderer";
import type { Project, SiteSettings } from "../types";
import { translateCategory, useLanguage } from "../lib/i18n";

const blank = {
  title_en: "",
  title_fr: "",
  slug: "",
  description_en: "",
  description_fr: "",
  category: "Illustration",
  year: String(new Date().getFullYear()),
  featured: false,
  published: true,
};

export default function AdminProjects() {
  const [token, setToken] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({});
  const [form, setForm] = useState(blank);
  const [cover, setCover] = useState<File | null>(null);
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [aboutImage, setAboutImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("adminToken");
    if (!storedToken) {
      navigate("/admin");
      return;
    }
    setToken(storedToken);
    Promise.all([
      adminRequest<Project[]>("/projects", storedToken),
      adminRequest<SiteSettings>("/settings", storedToken),
    ])
      .then(([projectRows, siteSettings]) => {
        setProjects(projectRows);
        setSettings(siteSettings);
      })
      .catch(() => {
        sessionStorage.removeItem("adminToken");
        navigate("/admin");
      });
  }, [navigate]);

  function change(key: keyof typeof blank, value: string | boolean) {
    setForm((current) => ({
      ...current,
      [key]: value,
      ...(key === "title_en" && !current.slug
        ? {
            slug: String(value)
              .toLowerCase()
              .trim()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
          }
        : {}),
    }));
  }

  async function refreshProjects() {
    if (token) setProjects(await adminRequest<Project[]>("/projects", token));
  }

  async function saveSettings(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const body = new FormData();
    Object.entries(settings).forEach(([key, value]) =>
      body.append(key, String(value)),
    );
    if (heroImage) body.append("home_hero_image_file", heroImage);
    if (aboutImage) body.append("about_image_file", aboutImage);
    try {
      const result = await adminRequest<{ settings: SiteSettings }>(
        "/settings",
        token,
        { method: "PUT", body },
      );
      setSettings(result.settings);
      setHeroImage(null);
      setAboutImage(null);
      setMessage(t("siteContentSaved"));
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : t("siteContentError"),
      );
    }
  }

  async function createProject(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      body.append(key, String(value)),
    );
    if (cover) body.append("cover", cover);
    try {
      await adminRequest("/projects", token, { method: "POST", body });
      setForm(blank);
      setCover(null);
      setMessage(t("projectCreated"));
      await refreshProjects();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : t("projectCreateError"),
      );
    }
  }

  async function removeProject(project: Project) {
    if (!confirm(`${t("delete")} “${project.title_en}”? ${t("deleteConfirm")}`))
      return;
    try {
      await adminRequest(`/projects/${project.id}`, token, {
        method: "DELETE",
      });
      setMessage(t("projectDeleted"));
      await refreshProjects();
    } catch {
      setMessage(t("projectDeleteError"));
    }
  }

  return (
    <section className="admin-page page-shell">
      <div className="admin-top">
        <div>
          <p className="eyebrow">{t("adminBrand")}</p>
          <h1>
            {t("adminTitleFirst")} <em>{t("adminTitleAccent")}</em>
          </h1>
        </div>
        <div className="admin-actions">
          <a className="text-link" href="/">
            {t("viewPortfolio")} ↗
          </a>
          <button
            onClick={() => {
              sessionStorage.removeItem("adminToken");
              navigate("/admin");
            }}
          >
            {t("logout")}
          </button>
        </div>
      </div>

      <form className="admin-form settings-form" onSubmit={saveSettings}>
        <h2>{t("homepageAbout")}</h2>
        <label>
          {t("heroHeadlineEn")}
          <textarea
            rows={2}
            value={settings.hero_title_en ?? ""}
            onChange={(event) =>
              setSettings({ ...settings, hero_title_en: event.target.value })
            }
          />
        </label>
        <label>
          {t("heroHeadlineFr")}
          <textarea
            rows={2}
            value={settings.hero_title_fr ?? ""}
            onChange={(event) =>
              setSettings({ ...settings, hero_title_fr: event.target.value })
            }
          />
        </label>
        <label>
          {t("heroSubtitleEn")}
          <input
            value={settings.hero_subtitle_en ?? ""}
            onChange={(event) =>
              setSettings({ ...settings, hero_subtitle_en: event.target.value })
            }
          />
        </label>
        <label>
          {t("heroSubtitleFr")}
          <input
            value={settings.hero_subtitle_fr ?? ""}
            onChange={(event) =>
              setSettings({ ...settings, hero_subtitle_fr: event.target.value })
            }
          />
        </label>
        <label>
          {t("aboutBioEn")}
          <textarea
            rows={4}
            value={settings.about_en ?? ""}
            onChange={(event) =>
              setSettings({ ...settings, about_en: event.target.value })
            }
          />
        </label>
        <label>
          {t("aboutBioFr")}
          <textarea
            rows={4}
            value={settings.about_fr ?? ""}
            onChange={(event) =>
              setSettings({ ...settings, about_fr: event.target.value })
            }
          />
        </label>
        <label>
          {t("heroImage")}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
            onChange={(event) => setHeroImage(event.target.files?.[0] ?? null)}
          />
          <small>
            {t("coverHelp")}
            {settings.home_hero_image
              ? ` · ${t("currentImage")}: ${settings.home_hero_image}`
              : ""}
          </small>
        </label>
        {settings.home_hero_image && (
          <div className="admin-media-preview">
            <MediaRenderer
              src={settings.home_hero_image}
              type={settings.home_hero_media_type}
              alt={t("heroImage")}
              controls
            />
          </div>
        )}
        <label>
          {t("aboutImage")}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(event) => setAboutImage(event.target.files?.[0] ?? null)}
          />
          <small>
            {t("coverHelp")}
            {settings.about_image
              ? ` · ${t("currentImage")}: ${settings.about_image}`
              : ""}
          </small>
        </label>
        {settings.about_image && (
          <div className="admin-media-preview">
            <MediaRenderer src={settings.about_image} alt={t("aboutImage")} />
          </div>
        )}
        <label>
          {t("email")}
          <input
            type="email"
            value={settings.contact_email ?? ""}
            onChange={(event) =>
              setSettings({ ...settings, contact_email: event.target.value })
            }
          />
        </label>
        <label>
          {t("instagramUrl")}
          <input
            type="url"
            value={settings.instagram_url ?? ""}
            onChange={(event) =>
              setSettings({ ...settings, instagram_url: event.target.value })
            }
          />
        </label>
        <label>
          {t("artstationUrl")}
          <input
            type="url"
            value={settings.artstation_url ?? ""}
            onChange={(event) =>
              setSettings({ ...settings, artstation_url: event.target.value })
            }
          />
        </label>
        <button className="button-primary">{t("saveSiteContent")}</button>
        {message && <p className="admin-message">{message}</p>}
      </form>

      <div className="admin-columns">
        <form className="admin-form" onSubmit={createProject}>
          <h2>{t("addProject")}</h2>
          <label>
            {t("titleEn")}
            <input
              required
              value={form.title_en}
              onChange={(event) => change("title_en", event.target.value)}
            />
          </label>
          <label>
            {t("titleFr")}
            <input
              required
              value={form.title_fr}
              onChange={(event) => change("title_fr", event.target.value)}
            />
          </label>
          <label>
            {t("slug")}
            <input
              required
              value={form.slug}
              onChange={(event) => change("slug", event.target.value)}
            />
          </label>
          <label>
            {t("descriptionEn")}
            <textarea
              required
              rows={4}
              value={form.description_en}
              onChange={(event) => change("description_en", event.target.value)}
            />
          </label>
          <label>
            {t("descriptionFr")}
            <textarea
              required
              rows={4}
              value={form.description_fr}
              onChange={(event) => change("description_fr", event.target.value)}
            />
          </label>
          <div className="admin-form-row">
            <label>
              {t("category")}
              <select
                value={form.category}
                onChange={(event) => change("category", event.target.value)}
              >
                {[
                  { value: "Illustration", label: t("categoryIllustration") },
                  { value: "Animation", label: t("categoryAnimation") },
                  { value: "Digital Art", label: t("categoryDigitalArt") },
                  { value: "Studies", label: t("categoryStudies") },
                  {
                    value: "Character Design",
                    label: t("categoryCharacterDesign"),
                  },
                ].map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {t("year")}
              <input
                type="number"
                value={form.year}
                onChange={(event) => change("year", event.target.value)}
              />
            </label>
          </div>
          <label>
            {t("cover")}
            <input
              type="file"
              required
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
              onChange={(event) => setCover(event.target.files?.[0] ?? null)}
            />
            <small>{t("coverHelp")}</small>
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => change("featured", event.target.checked)}
            />{" "}
            {t("featureHome")}
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) => change("published", event.target.checked)}
            />{" "}
            {t("published")}
          </label>
          <button className="button-primary">{t("createProject")}</button>
          {message && <p className="admin-message">{message}</p>}
        </form>
        <div className="admin-list">
          <div className="admin-list-heading">
            <h2>{t("projects")}</h2>
            <span>
              {projects.length} {t("total")}
            </span>
          </div>
          {projects.map((project) => (
            <div className="admin-project" key={project.id}>
              <MediaRenderer
                src={project.cover_image}
                type={project.cover_media_type}
                alt={project.title_en}
                muted
              />
              <div className="admin-project-info">
                <strong>{project.title_en}</strong>
                <span>
                  {translateCategory(project.category, t)} ·{" "}
                  {project.published ? t("publishedStatus") : t("draftStatus")}
                  {project.featured ? ` · ${t("featuredStatus")}` : ""}
                </span>
              </div>
              <button
                className="delete-button"
                onClick={() => removeProject(project)}
                aria-label={`${t("delete")} ${project.title_en}`}
              >
                {t("delete")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

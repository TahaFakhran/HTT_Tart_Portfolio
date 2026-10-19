import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getProject } from '../lib/api';
import MediaRenderer from '../components/MediaRenderer';
import type { Project } from '../types';
import { translateCategory, useLanguage } from '../lib/i18n';

export default function ProjectDetail() {
  const { slug = '' } = useParams();
  const [project, setProject] = useState<Project>();
  const [missing, setMissing] = useState(false);
  const { language, t } = useLanguage();
  useEffect(() => {
    setProject(undefined); setMissing(false);
    getProject(slug).then((result) => { setProject(result); setMissing(!result); }).catch(() => setMissing(true));
  }, [slug]);
  if (!project) return <section className="page-shell inner-page"><p className="eyebrow">{t('project')}</p><h1>{missing ? t('noProject') : t('loading')}</h1><Link className="text-link" to="/projects"><ArrowLeft size={16} /> {t('back')}</Link></section>;
  const title = language === 'fr' ? project.title_fr : project.title_en;
  const description = language === 'fr' ? project.description_fr : project.description_en;
  const media = project.media?.length ? project.media : [{ file_path: project.cover_image, media_type: project.cover_media_type, alt_text: title }];
  return <article className="page-shell project-detail">
    <Link className="back-link" to="/projects"><ArrowLeft size={15} /> {t('back')}</Link>
    <div className="detail-heading"><p className="eyebrow">{translateCategory(project.category, t)} / {project.year ?? '—'}</p><h1>{title}</h1><p>{description}</p></div>
    <div className="detail-media-gallery">{media.map((item, index) => <div className="detail-image" key={`${item.file_path}-${index}`}><MediaRenderer src={item.file_path} type={item.media_type} alt={item.alt_text || title} controls /></div>)}</div>
    <div className="detail-meta"><div><p className="eyebrow">{t('aboutPiece')}</p><p>{description}</p></div><div><p className="eyebrow">{t('details')}</p><p>{t('category')} — {translateCategory(project.category, t)}<br />{t('year')} — {project.year ?? '—'}<br />{t('format')} — {project.cover_media_type === 'video' ? t('video') : t('digitalArtwork')}</p></div></div>
    <Link className="text-link" to="/contact">{t('contactCta')} <ArrowUpRight size={16} /></Link>
  </article>;
}

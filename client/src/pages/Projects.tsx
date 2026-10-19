import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ProjectCard from '../components/ProjectCard';
import { getProjects } from '../lib/api';
import type { Project } from '../types';
import { translateCategory, useLanguage } from '../lib/i18n';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [category, setCategory] = useState('__all__');
  const [search, setSearch] = useState('');
  const { t } = useLanguage();
  useEffect(() => { getProjects().then(setProjects).catch(() => setProjects([])); }, []);
  const categories = [{ value: '__all__', label: t('allWork') }, ...Array.from(new Set(projects.map((project) => project.category))).map((value) => ({ value, label: translateCategory(value, t) }))];
  const filtered = useMemo(() => projects.filter((project) =>
    (category === '__all__' || project.category === category) &&
    `${project.title_en} ${project.title_fr} ${project.description_en} ${project.description_fr}`.toLowerCase().includes(search.toLowerCase()),
  ), [projects, category, search]);

  return <section className="page-shell inner-page">
    <div className="page-intro"><p className="eyebrow"><span className="red-line" /> {t('archive')}</p><h1>{t('archiveTitle')}</h1><p className="intro-description">{t('archiveIntro')}</p></div>
    <div className="gallery-toolbar"><div className="filter-list">{categories.map((item) => <button key={item.value} className={category === item.value ? 'filter-active' : ''} onClick={() => setCategory(item.value)}>{item.label}</button>)}</div><label className="search-box"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t('search')} /></label></div>
    {filtered.length > 0 ? <div className="masonry-grid gallery-grid">{filtered.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div> : <div className="empty-state">{t('noResults')}</div>}
    <p className="gallery-count">{t('showing')} {String(filtered.length).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} {t('projectsLabel')}</p>
  </section>;
}

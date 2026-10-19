import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSettings } from '../lib/api';
import MediaRenderer from '../components/MediaRenderer';
import type { SiteSettings } from '../types';
import { useLanguage } from '../lib/i18n';

export default function About() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const { language, t } = useLanguage();

  useEffect(() => {
    getSettings().then(setSettings).catch(() => setSettings({}));
  }, []);

  const biography = settings[language === 'fr' ? 'about_fr' : 'about_en'] ?? '';
  const closing = t('aboutClosing');
  const aboutImage = settings.about_image;
  const skills = [t('skillIllustration'), t('skillCharacterDesign'), t('skillAnimation'), t('skillStorytelling')];

  return <section className="page-shell inner-page about-page">
    <div className="page-intro">
      <p className="eyebrow"><span className="red-line" /> {t('aboutIntro')}</p>
      <h1>{t('aboutTitleLine1')}<br /><em>{t('aboutTitleLine2')}</em></h1>
    </div>
    <div className="about-layout">
      {aboutImage && <div className="about-image"><MediaRenderer src={aboutImage} alt={t('aboutImageAlt')} loading="eager" /><span className="image-note">{t('aboutImageLabel')}</span></div>}
      <div className="about-copy">
        <p className="eyebrow">{t('aboutShortIntro')}</p>
        <h2>{t('aboutHeadingLine1')}<br /><em>{t('aboutHeadingLine2')}</em></h2>
        {biography && <p>{biography}</p>}
        {closing && <p>{closing}</p>}
        <div className="skills-list">{skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
        <Link to="/contact" className="button-primary">{t('hello')} <ArrowUpRight size={16} /></Link>
      </div>
    </div>
  </section>;
}

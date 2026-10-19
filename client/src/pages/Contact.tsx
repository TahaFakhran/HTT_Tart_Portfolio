import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { getSettings, sendContact } from '../lib/api';
import type { SiteSettings } from '../types';
import { useLanguage } from '../lib/i18n';
import { useEffect } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [settings, setSettings] = useState<SiteSettings>({});
  const { t } = useLanguage();

  useEffect(() => { getSettings().then(setSettings).catch(() => setSettings({})); }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('sending');
    try {
      await sendContact(form);
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  return <section className="page-shell inner-page contact-page">
    <div className="page-intro">
      <p className="eyebrow"><span className="red-line" /> {t('contactIntro')}</p>
      <h1>{t('contactTitle')}</h1>
      <p className="intro-description">{t('contactDesc')}</p>
    </div>
    <div className="contact-layout">
      <form className="contact-form" onSubmit={submit}>
        <label>{t('name')}<input required minLength={2} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder={t('namePlaceholder')} /></label>
        <label>{t('email')}<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder={t('emailPlaceholder')} /></label>
        <label>{t('message')}<textarea required minLength={10} rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder={t('messagePlaceholder')} /></label>
        <button className="button-primary" disabled={status === 'sending'}>{status === 'sending' ? t('sending') : t('send')} <ArrowUpRight size={16} /></button>
        {status === 'sent' && <p className="form-success"><CheckCircle2 size={17} /> {t('sent')}</p>}
        {status === 'error' && <p className="form-error">{t('sendError')}</p>}
      </form>
      <aside className="contact-aside">
        <span className="aside-kanji">縁</span>
        <p className="eyebrow">{t('contactAsideEyebrow')}</p>
        <h2>{t('contactAsideLine1')}<br /><em>{t('contactAsideLine2')}</em></h2>
        <p>{t('contactAsideDescription')}</p>
        {settings.contact_email && <a className="text-link" href={`mailto:${settings.contact_email}`}>{settings.contact_email} <ArrowUpRight size={15} /></a>}
        <p className="eyebrow socials-label">{t('socialLinksLabel')}</p>
        {settings.instagram_url && <a className="social-link" href={settings.instagram_url} target="_blank" rel="noreferrer">{t('socialInstagram')} <ArrowUpRight size={14} /></a>}
        {settings.artstation_url && <a className="social-link" href={settings.artstation_url} target="_blank" rel="noreferrer">{t('socialArtstation')} <ArrowUpRight size={14} /></a>}
      </aside>
    </div>
  </section>;
}

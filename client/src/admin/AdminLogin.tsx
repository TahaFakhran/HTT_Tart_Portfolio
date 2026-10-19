import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../lib/api';
import { useLanguage } from '../lib/i18n';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const token = await login(email, password);
      sessionStorage.setItem('adminToken', token);
      navigate('/admin/projects');
    } catch {
      setError(t('adminLoginError'));
    } finally { setLoading(false); }
  }

  return <section className="admin-login page-shell"><div className="admin-login-card">
    <p className="eyebrow">{t('adminBrand')}</p><h1>{t('adminLoginTitle')}</h1>
    <form onSubmit={submit}>
      <label>{t('adminEmail')}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" /></label>
      <label>{t('adminPassword')}<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="button-primary" disabled={loading}>{loading ? t('adminLoggingIn') : t('adminLogin')}</button>
    </form>
    <a href="/" className="text-link">← {t('viewPortfolio')}</a>
  </div></section>;
}

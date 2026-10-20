import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ChevronDown, CircleCheck, LogIn, UserPlus } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import FormField from '../components/FormField';
import LeafMotif from '../components/LeafMotif';
import SiteFooter from '../components/SiteFooter';
import LandingHeader from '../components/landing/LandingHeader';
import LandingSections from '../components/landing/LandingSections';
import { HERO } from '../content/clinic';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage, getFieldErrors } from '../utils/errors';
import styles from './AuthPage.module.css';

const EMPTY_FORM = { email: '', password: '', fullName: '', phone: '' };

/** Login and registration share one page; `mode` picks which fields are shown. */
export default function AuthPage({ mode }) {
  const isRegister = mode === 'register';
  const { user, login, register } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const update = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    setFormError('');
    try {
      if (isRegister) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
      // AuthContext now has a user -> the <Navigate> above redirects to the home page
    } catch (error) {
      setFieldErrors(getFieldErrors(error));
      setFormError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div id="top" className={styles.wrapper}>
      <LandingHeader />

      <div className={styles.page}>
        <aside className={styles.intro}>
          <LeafMotif className={styles.art} animated />
          <h1>{HERO.title}</h1>
          <p className={styles.subtitle}>{HERO.subtitle}</p>
          <p>{HERO.text}</p>
          <ul className={styles.points}>
            {HERO.points.map((point) => (
              <li key={point}><CircleCheck size={18} aria-hidden />{point}</li>
            ))}
          </ul>
        </aside>

        <Card id="auth" className={styles.card}>
          <h2>{isRegister ? 'הרשמה' : 'כניסה'}</h2>
          <p className={styles.lead}>{isRegister ? 'כמה פרטים, ואפשר לקבוע תור.' : 'טוב לראות אותך שוב.'}</p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <FormField label="שם מלא" autoComplete="name" value={form.fullName} onChange={update('fullName')}
                error={fieldErrors.fullName} required />
            )}
            <FormField label="אימייל" type="email" autoComplete="email" dir="ltr" value={form.email}
              onChange={update('email')} error={fieldErrors.email} required />
            {isRegister && (
              <FormField label="טלפון" type="tel" autoComplete="tel" dir="ltr" value={form.phone}
                onChange={update('phone')} error={fieldErrors.phone} required />
            )}
            <FormField label="סיסמה" type="password" dir="ltr" value={form.password} onChange={update('password')}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              hint={isRegister ? 'לפחות 8 תווים' : undefined} error={fieldErrors.password} required />

            {formError && Object.keys(fieldErrors).length === 0 && (
              <p className={styles.formError} role="alert">{formError}</p>
            )}

            <Button type="submit" fullWidth loading={submitting} icon={isRegister ? UserPlus : LogIn}>
              {isRegister ? 'יצירת חשבון' : 'כניסה'}
            </Button>
          </form>

          <p className={styles.switch}>
            {isRegister ? 'כבר יש לך חשבון? ' : 'עוד אין לך חשבון? '}
            <Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'לכניסה' : 'להרשמה'}</Link>
          </p>

          {import.meta.env.DEV && !isRegister && (
            <p className={styles.demo}>
              משתמשי דמו (סיסמה <bdi>Demo1234!</bdi>): <bdi>client1@demo.local</bdi> · <bdi>therapist@demo.local</bdi>
            </p>
          )}
        </Card>

        <a href="#about" className={styles.scrollHint}>
          {HERO.scrollHint}
          <ChevronDown size={20} aria-hidden />
        </a>
      </div>

      <div className={styles.content}>
        <LandingSections />
      </div>

      <SiteFooter />
    </div>
  );
}

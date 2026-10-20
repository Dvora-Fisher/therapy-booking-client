import { Clock, MapPin, Moon, Phone } from 'lucide-react';
import { CLINIC, CONTACT } from '../content/clinic';
import styles from './SiteFooter.module.css';

/** Clinic details. `compact` (inside the app) keeps one short line. Texts: content/clinic.js */
export default function SiteFooter({ compact = false }) {
  const year = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} ${compact ? styles.compact : ''}`}>
      <div className={styles.inner}>
        {!compact && (
          <div className={styles.brand}>
            <img src="/leaf.svg" alt="" width="28" height="28" />
            <div>
              <strong>{CLINIC.name}</strong>
              <span>{CLINIC.tagline}</span>
            </div>
          </div>
        )}

        <ul className={styles.details}>
          <li><MapPin size={16} aria-hidden />{CONTACT.address}</li>
          <li><Phone size={16} aria-hidden /><a href={`tel:${CONTACT.phone.replace(/\D/g, '')}`} dir="ltr">{CONTACT.phone}</a></li>
          <li><Clock size={16} aria-hidden />{CONTACT.hours}</li>
          {!compact && <li><Moon size={16} aria-hidden />{CONTACT.closed}</li>}
        </ul>

        <p className={styles.copy}>© {year} {CLINIC.name} · {CONTACT.copyright}</p>
      </div>
    </footer>
  );
}

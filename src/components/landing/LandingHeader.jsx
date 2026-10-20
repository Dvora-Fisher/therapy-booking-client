import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, Menu, X } from 'lucide-react';
import { CLINIC, HEADER } from '../../content/clinic';
import styles from './LandingHeader.module.css';

const SECTION_IDS = HEADER.links.map((link) => link.href.slice(1));

/** Highlights the link of the section currently in the middle of the screen. */
function useActiveSection() {
  const [active, setActive] = useState('');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' }, // a thin line across the middle of the viewport
    );
    SECTION_IDS.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  // Back at the top (hero) - nothing is highlighted
  useEffect(() => {
    const onScroll = () => window.scrollY < 200 && setActive('');
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return active;
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
}

// The form is already on this page: after switching login/register, bring it into view
const scrollToForm = () => requestAnimationFrame(() => document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));

/** Sticky header of the landing (login / register) page. Texts: content/clinic.js */
export default function LandingHeader() {
  const active = useActiveSection();
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <span className={styles.topNote}>{CLINIC.topNote}</span>

      <div className={styles.inner}>
        <a href="#top" className={styles.brand} onClick={close}>
          <img src="/leaf.svg" alt="" width="32" height="32" className={styles.logo} />
          <span>{CLINIC.name}</span>
        </a>

        <nav id="landing-nav" className={`${styles.nav} ${menuOpen ? styles.open : ''}`} aria-label="ניווט באתר">
          {HEADER.links.map((link) => (
            <a key={link.href} href={link.href} onClick={close}
              className={`${styles.link} ${active === link.href.slice(1) ? styles.active : ''}`}>
              {link.label}
            </a>
          ))}
          <Link to="/login" className={`${styles.link} ${styles.menuOnly}`} onClick={() => { close(); scrollToForm(); }}>
            {HEADER.login}
          </Link>
        </nav>

        <div className={styles.actions}>
          <Link to="/login" className={styles.login} onClick={() => { close(); scrollToForm(); }}>{HEADER.login}</Link>
          <Link to="/register" className={styles.cta} onClick={() => { close(); scrollToForm(); }}>
            <CalendarPlus size={18} aria-hidden />
            {HEADER.cta}
          </Link>
          <button type="button" className={styles.menuButton} onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen} aria-controls="landing-nav" aria-label={menuOpen ? 'סגירת התפריט' : 'פתיחת התפריט'}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}

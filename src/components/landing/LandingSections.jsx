import { Link } from 'react-router-dom';
import { ChevronDown, Quote } from 'lucide-react';
import LeafMotif from '../LeafMotif';
import CountUp from './CountUp';
import Reveal from './Reveal';
import { Icon } from './icons';
import { ABOUT, FAQ, STEPS, TESTIMONIALS, TREATMENTS, VALUES } from '../../content/clinic';
import styles from './Landing.module.css';

const STAGGER_MS = 90;

function SectionTitle({ eyebrow, title }) {
  return (
    <Reveal className={styles.sectionTitle}>
      <span className={styles.eyebrow}>{eyebrow}</span>
      <h2>{title}</h2>
    </Reveal>
  );
}

function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-title">
      <div className={styles.about}>
        <Reveal className={styles.aboutText}>
          <span className={styles.eyebrow}>{ABOUT.eyebrow}</span>
          <h2 id="about-title">{ABOUT.title}</h2>
          <p className={styles.role}>{ABOUT.role}</p>
          {ABOUT.paragraphs.map((text) => <p key={text}>{text}</p>)}
        </Reveal>

        <Reveal delay={120} className={styles.aboutSide}>
          <LeafMotif className={styles.aboutArt} animated />
          <dl className={styles.stats}>
            {ABOUT.stats.map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <dt>{stat.label}</dt>
                <dd><CountUp value={stat.value} prefix={stat.prefix} /></dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

function Treatments() {
  return (
    <section id="treatments" className={styles.section}>
      <SectionTitle eyebrow={TREATMENTS.eyebrow} title={TREATMENTS.title} />
      <div className={styles.grid}>
        {TREATMENTS.items.map((item, i) => (
          <Reveal as="article" key={item.title} delay={i * STAGGER_MS} className={styles.tile}>
            <span className={styles.tileIcon}><Icon name={item.icon} size={24} /></span>
            <h3>{item.title}</h3>
            <span className={styles.duration}>{item.duration}</span>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Values() {
  return (
    <section id="values" className={`${styles.section} ${styles.band}`}>
      <SectionTitle eyebrow={VALUES.eyebrow} title={VALUES.title} />
      <div className={styles.values}>
        {VALUES.items.map((item, i) => (
          <Reveal key={item.title} delay={i * STAGGER_MS} className={styles.value}>
            <span className={styles.valueIcon}><Icon name={item.icon} size={22} /></span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section id="steps" className={styles.section}>
      <SectionTitle eyebrow={STEPS.eyebrow} title={STEPS.title} />
      <ol className={styles.steps}>
        {STEPS.items.map((item, i) => (
          <Reveal as="li" key={item.title} delay={i * 140} className={styles.step}>
            <span className={styles.stepNumber}>{i + 1}</span>
            <Icon name={item.icon} size={22} className={styles.stepIcon} />
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </Reveal>
        ))}
      </ol>
      <Reveal className={styles.ctaRow}>
        <Link to="/register" className={styles.cta}>{STEPS.cta}</Link>
      </Reveal>
    </section>
  );
}

function Testimonials() {
  if (TESTIMONIALS.items.length === 0) return null;
  return (
    <section id="testimonials" className={`${styles.section} ${styles.band}`}>
      <SectionTitle eyebrow={TESTIMONIALS.eyebrow} title={TESTIMONIALS.title} />
      <div className={styles.quotes}>
        {TESTIMONIALS.items.map((item, i) => (
          <Reveal as="figure" key={item.author} delay={i * STAGGER_MS} className={styles.quote}>
            <Quote size={26} aria-hidden className={styles.quoteMark} />
            <blockquote>{item.quote}</blockquote>
            <figcaption>{item.author}</figcaption>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section id="faq" className={styles.section}>
      <SectionTitle eyebrow={FAQ.eyebrow} title={FAQ.title} />
      <div className={styles.faq}>
        {FAQ.items.map((item, i) => (
          <Reveal as="details" key={item.q} delay={i * 60} className={styles.faqItem}>
            <summary>
              {item.q}
              <ChevronDown size={20} aria-hidden className={styles.faqChevron} />
            </summary>
            <div className={styles.faqAnswer}><p>{item.a}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** The content under the login form: about, treatments, values, steps, testimonials, FAQ. Texts: content/clinic.js */
export default function LandingSections() {
  return (
    <div className={styles.sections}>
      <About />
      <Treatments />
      <Values />
      <Steps />
      <Testimonials />
      <Faq />
    </div>
  );
}

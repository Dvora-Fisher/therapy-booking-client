import styles from './Badge.module.css';

/** A small rounded label. tone: neutral | green | warm | danger */
export default function Badge({ tone = 'neutral', children }) {
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>;
}

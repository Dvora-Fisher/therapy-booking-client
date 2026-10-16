import LeafMotif from './LeafMotif';
import styles from './Feedback.module.css';

/** Gray placeholder blocks shown while data loads, shaped like the content that will replace them. */
export function Skeleton({ lines = 3, height = 56 }) {
  return (
    <div className={styles.skeletonList} aria-busy="true" aria-label="טוען…">
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className={styles.skeleton} style={{ height }} />
      ))}
    </div>
  );
}

/** A friendly "nothing here" message with a calm illustration and an optional action. */
export function EmptyState({ title, text, action }) {
  return (
    <div className={styles.empty}>
      <LeafMotif className={styles.emptyArt} />
      <h3>{title}</h3>
      {text && <p className={styles.emptyText}>{text}</p>}
      {action}
    </div>
  );
}

/** Inline error box for a failed load, with a retry button. */
export function ErrorNotice({ message, onRetry }) {
  return (
    <div className={styles.error} role="alert">
      <p>{message}</p>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          לנסות שוב
        </button>
      )}
    </div>
  );
}

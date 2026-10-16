import { useId } from 'react';
import styles from './FormField.module.css';

/**
 * Label + input + hint and/or error under the field, wired for screen readers (aria-invalid, aria-describedby).
 * The hint stays visible when there is an error (e.g. the Hebrew date under a date field).
 * Pass `as="select"` with <option> children for a select box.
 */
export default function FormField({ label, error, hint, as: Control = 'input', children, ...props }) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <Control
        id={id}
        className={`${styles.control} ${error ? styles.invalid : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </Control>
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

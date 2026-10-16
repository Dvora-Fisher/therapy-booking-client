import { useId } from 'react';
import styles from './FormField.module.css';

/**
 * Label + input + error message under the field, wired for screen readers (aria-invalid, aria-describedby).
 * Pass `as="select"` with <option> children for a select box.
 */
export default function FormField({ label, error, hint, as: Control = 'input', children, ...props }) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error || hint;

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <Control
        id={id}
        className={`${styles.control} ${error ? styles.invalid : ''}`}
        aria-invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        {...props}
      >
        {children}
      </Control>
      {message && (
        <p id={messageId} className={error ? styles.error : styles.hint} role={error ? 'alert' : undefined}>
          {message}
        </p>
      )}
    </div>
  );
}

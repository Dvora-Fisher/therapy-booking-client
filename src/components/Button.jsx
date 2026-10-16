import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

/**
 * The single button of the app.
 * variant: primary | secondary | ghost | danger, size: md | sm.
 * While `loading` the button is disabled and shows a spinner (prevents double submits).
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...props
}) {
  const classes = [styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} aria-busy={loading} {...props}>
      {loading ? <Loader2 className={styles.spinner} size={18} aria-hidden /> : Icon && <Icon size={18} aria-hidden />}
      <span>{children}</span>
    </button>
  );
}

import { useEffect, useRef, useState } from 'react';
import styles from './Landing.module.css';

/** Reports once when the element first scrolls into view. */
export function useInView(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return undefined;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, inView];
}

/** Fades and lifts its content in the first time it is scrolled into view. `delay` is in ms. */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...props }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`${styles.reveal} ${inView ? styles.revealed : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  );
}

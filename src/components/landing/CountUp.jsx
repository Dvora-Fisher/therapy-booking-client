import { useEffect, useState } from 'react';
import { useInView } from './Reveal';

const DURATION_MS = 1400;

/** Counts from 0 to `value` once it is visible (jumps straight to it when reduced motion is requested). */
export default function CountUp({ value, prefix = '' }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(value);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 3; // ease-out
      setCurrent(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref} dir="ltr">
      {prefix}
      {current.toLocaleString('he-IL')}
    </span>
  );
}

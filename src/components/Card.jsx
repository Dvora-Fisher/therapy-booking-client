import styles from './Card.module.css';

export default function Card({ as: Tag = 'section', className = '', children, ...props }) {
  return (
    <Tag className={`${styles.card} ${className}`} {...props}>
      {children}
    </Tag>
  );
}

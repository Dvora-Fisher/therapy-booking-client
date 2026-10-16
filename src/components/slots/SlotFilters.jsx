import FormField from '../FormField';
import styles from './SlotFilters.module.css';

/** Date range + treatment type filters. Values are Israel dates ("YYYY-MM-DD") and a type id. */
export default function SlotFilters({ filters, onChange, treatmentTypes, children }) {
  const set = (field) => (event) => onChange({ ...filters, [field]: event.target.value });

  return (
    <div className={styles.filters} role="search">
      <FormField label="מתאריך" type="date" value={filters.from} onChange={set('from')} />
      <FormField label="עד תאריך" type="date" value={filters.to} min={filters.from} onChange={set('to')} />
      <FormField label="סוג טיפול" as="select" value={filters.treatmentTypeId} onChange={set('treatmentTypeId')}>
        <option value="">כל סוגי הטיפול</option>
        {treatmentTypes.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </FormField>
      {children}
    </div>
  );
}

import FormField from './FormField';
import { hebrewDateOfDay } from '../utils/dates';

/**
 * A date picker that always shows the Hebrew date of the chosen day under the field.
 * (The native picker shows only the civil date.) An error, if any, appears below it.
 */
export default function DateField({ value, error, ...props }) {
  return <FormField type="date" value={value} hint={value ? hebrewDateOfDay(value) : undefined} error={error} {...props} />;
}

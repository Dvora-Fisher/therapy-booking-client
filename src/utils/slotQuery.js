import { addDays, israelTimeToUtcIso } from './dates';

/**
 * Filter form values (Israel dates) -> query string for GET /api/slots (UTC).
 * "to" is inclusive in the form, so the query uses midnight at the start of the next day.
 */
export function buildSlotQuery({ from, to, treatmentTypeId, status }, page, pageSize) {
  return {
    from: from ? israelTimeToUtcIso(from) : undefined,
    to: to ? israelTimeToUtcIso(addDays(to, 1)) : undefined,
    treatmentTypeId: treatmentTypeId || undefined,
    status: status || undefined,
    page,
    pageSize,
  };
}

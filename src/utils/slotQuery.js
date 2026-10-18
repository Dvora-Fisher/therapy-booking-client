import { addDays, israelTimeToUtcIso, todayInIsrael } from './dates';

/**
 * Filter form values (Israel dates) -> query string for GET /api/slots (UTC).
 * "to" is inclusive in the form, so the query uses midnight at the start of the next day.
 * "from" = today starts at this moment, not at midnight, so slots that already passed today are left out.
 */
export function buildSlotQuery({ from, to, treatmentTypeId, status }, page, pageSize) {
  const fromUtc = from === todayInIsrael() ? new Date().toISOString() : from && israelTimeToUtcIso(from);
  return {
    from: fromUtc || undefined,
    to: to ? israelTimeToUtcIso(addDays(to, 1)) : undefined,
    treatmentTypeId: treatmentTypeId || undefined,
    status: status || undefined,
    page,
    pageSize,
  };
}

import { formatHebrewDate } from './hebrewDate';

/**
 * The server works in UTC only. Conversion to Israel time happens here, in the client, and nowhere else.
 */
export const ISRAEL_TIME_ZONE = 'Asia/Jerusalem';

const dayFormatter = new Intl.DateTimeFormat('he-IL', {
  timeZone: ISRAEL_TIME_ZONE,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

const timeFormatter = new Intl.DateTimeFormat('he-IL', {
  timeZone: ISRAEL_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

// "YYYY-MM-DD" of a moment as seen in Israel (en-CA happens to format dates exactly like that)
const dateKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: ISRAEL_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const partsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: ISRAEL_TIME_ZONE,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hourCycle: 'h23',
});

/** "יום שלישי, 20 באוקטובר · ח׳ בחשוון תשפ״ז" - the Hebrew date is always shown next to the civil one */
export const formatDay = (isoUtc) => `${dayFormatter.format(new Date(isoUtc))} · ${formatHebrewDate(isoUtc)}`;

/** "09:00" */
export const formatTime = (isoUtc) => timeFormatter.format(new Date(isoUtc));

/** "09:00–10:00" */
export const formatTimeRange = (startUtc, endUtc) => `${formatTime(startUtc)}–${formatTime(endUtc)}`;

/** "יום שלישי, 20 באוקטובר · 09:00" */
export const formatDayAndTime = (isoUtc) => `${formatDay(isoUtc)} · ${formatTime(isoUtc)}`;

export const israelDateKey = (isoUtc) => dateKeyFormatter.format(new Date(isoUtc));

export const todayInIsrael = () => israelDateKey(new Date().toISOString());

export function addDays(dateKey, days) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

// How many minutes Israel is ahead of UTC at a given moment (+120 in winter, +180 in summer)
function israelOffsetMinutes(utcMs) {
  const parts = Object.fromEntries(partsFormatter.formatToParts(new Date(utcMs)).map((p) => [p.type, p.value]));
  const wallAsUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour % 24, parts.minute);
  return Math.round((wallAsUtc - utcMs) / 60000);
}

/**
 * Israel wall-clock time ("2026-10-20", "09:00") -> UTC ISO string for the API.
 * Two passes, so a time right after a daylight-saving switch gets the correct offset.
 */
export function israelTimeToUtcIso(dateKey, time = '00:00') {
  const [y, m, d] = dateKey.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const wall = Date.UTC(y, m - 1, d, hour, minute);

  let utc = wall - israelOffsetMinutes(wall) * 60000;
  utc = wall - israelOffsetMinutes(utc) * 60000;
  return new Date(utc).toISOString();
}

/** Hebrew date of a form date ("2026-10-20") - shown under date pickers */
export const hebrewDateOfDay = (dateKey) => formatHebrewDate(israelTimeToUtcIso(dateKey, '12:00'));

// Shabbat window - mirrors Booking:ShabbatStartsOnFridayAt / ShabbatEndsOnSaturdayAt on the server
export const SHABBAT = { startsOnFridayAt: '14:00', endsOnSaturdayAt: '21:00' };

/**
 * True if a slot on dateKey from `start` to `end` ("HH:mm", Israel time) touches Shabbat.
 * "HH:mm" strings compare correctly as text ("13:30" < "14:00").
 * The server enforces the same rule; this only warns the therapist before submitting.
 */
export function overlapsShabbat(dateKey, start, end) {
  const weekday = weekdayOf(dateKey);
  if (weekday === FRIDAY) return end > SHABBAT.startsOnFridayAt;
  if (weekday === SATURDAY) return start < SHABBAT.endsOnSaturdayAt;
  return false;
}

/** The next calendar day after `dateKey` that is not a Saturday - a sensible default for new slots. */
export function nextWeekdayAfter(dateKey) {
  const next = addDays(dateKey, 1);
  return weekdayOf(next) === SATURDAY ? addDays(next, 1) : next;
}

const FRIDAY = 5;
const SATURDAY = 6;
const weekdayOf = (dateKey) => new Date(`${dateKey}T12:00:00Z`).getUTCDay();

/** Groups items by their Israel calendar day, keeping the server's order. */
export function groupByIsraelDay(items, getIsoUtc) {
  const groups = new Map();
  for (const item of items) {
    const iso = getIsoUtc(item);
    const key = israelDateKey(iso);
    if (!groups.has(key)) groups.set(key, { key, label: formatDay(iso), items: [] });
    groups.get(key).items.push(item);
  }
  return [...groups.values()];
}

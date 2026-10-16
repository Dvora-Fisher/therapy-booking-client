/**
 * Hebrew (Jewish calendar) date in Hebrew letters: "ה׳ בחשוון תשפ״ז".
 * The calendar math comes from the browser (Intl with the "hebrew" calendar);
 * this file only turns the numbers into letters (gematria).
 * Like printed calendars, the date follows the civil day (it does not switch at sunset).
 */
const hebrewCalendarFormatter = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', {
  timeZone: 'Asia/Jerusalem',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const ONES = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט'];
const TENS = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ'];
const HUNDREDS = ['', 'ק', 'ר', 'ש', 'ת'];

/** 1..999 -> Hebrew numeral with geresh / gershayim: 5 -> ה׳, 15 -> ט״ו, 787 -> תשפ״ז */
export function toHebrewNumeral(number) {
  let hundreds = Math.floor(number / 100);
  const rest = number % 100;
  let letters = '';

  while (hundreds > 4) {
    letters += 'ת'; // 500-900 are written as ת + the remaining hundreds
    hundreds -= 4;
  }
  letters += HUNDREDS[hundreds];

  // 15 and 16 are written ט״ו / ט״ז so they do not spell a name of God
  if (rest === 15) letters += 'טו';
  else if (rest === 16) letters += 'טז';
  else letters += TENS[Math.floor(rest / 10)] + ONES[rest % 10];

  return letters.length === 1 ? `${letters}׳` : `${letters.slice(0, -1)}״${letters.slice(-1)}`;
}

/** "ה׳ בחשוון תשפ״ז" for a UTC ISO string */
export function formatHebrewDate(isoUtc) {
  const parts = Object.fromEntries(
    hebrewCalendarFormatter.formatToParts(new Date(isoUtc)).map((p) => [p.type, p.value]),
  );
  const year = Number(parts.year) % 1000; // 5787 -> 787 (the thousands are omitted, as usual)
  return `${toHebrewNumeral(Number(parts.day))} ב${parts.month} ${toHebrewNumeral(year)}`;
}

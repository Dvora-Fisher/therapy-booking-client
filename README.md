# therapy-booking-client — לקוח React למערכת זימון התורים

לקוח Vite + React שמדגים את השרת [TherapyBooking](../Clean-ic_server). הממשק כולו בעברית ומימין לשמאל, מותאם לנייד, ובשפה עיצובית "שקט ובטוח": ירוק מרווה, רקע חול וטרקוטה עדינה.

## מסכים

| מסך | נתיב | מי |
|---|---|---|
| כניסה / הרשמה | `/login`, `/register` | כולם |
| קביעת תור: חלונות פנויים מקובצים לפי יום, סינון לפי תאריכים וסוג טיפול, pagination מהשרת, "השעה הפנויה הקרובה" | `/slots` | Client |
| **409: "החלון נתפס ממש עכשיו"**, עם החלופות שהשרת החזיר וכפתור "לקביעה מהירה" | חלון קופץ במסך הקביעה | Client |
| התורים שלי / כל התורים, עם ביטול (ומדיניות 24 שעות) | `/appointments` | Client / Therapist |
| ניהול חלונות: פרסום חלון, חסימה ופתיחה, מחיקה | `/therapist/slots` | Therapist |

## מבנה

```
src/
  api/          axios instance + interceptors (client.js), ופונקציה לכל endpoint
  context/      AuthContext - המשתמש המחובר, login/register/logout
  hooks/        useAsync (טעינה/שגיאה/רענון), useBooking (קביעה + טיפול ב-409), useTreatmentTypes
  pages/        AuthPage, SlotsPage, AppointmentsPage, TherapistSlotsPage, NotFoundPage
  components/   Button, FormField, Card, Modal, ConfirmModal, Pagination, Badge, Feedback (skeleton/empty/error),
                Layout, ProtectedRoute, slots/ (SlotChip, SlotsByDay, SlotFilters, BookingModal, ConflictModal)
  styles/       tokens.css (כל הצבעים, הגדלים והצללים) + global.css
  utils/        dates (המרה לשעון ישראל וממנו), errors (ProblemDetails להודעה), labels, authStorage, slotQuery
```

- **JWT:** נשמר ב-`localStorage`, ו-interceptor של axios מוסיף אותו לכל בקשה ככותרת `Authorization: Bearer`. תשובת 401 מנתקת את המשתמש.
- **שעון:** השרת עובד ב-UTC בלבד. ההמרה לשעון ישראל (`Asia/Jerusalem`, כולל שעון קיץ) נעשית רק ב-`utils/dates.js`.
- **הרשאות:** `ProtectedRoute` מסתיר מסכים לפי role כדי שהממשק יהיה נוח, אבל האכיפה האמיתית נעשית בשרת.
- **ספריות:** React Router, axios, react-hot-toast ו-lucide-react. העיצוב ב-CSS Modules, בלי ספריית UI.

## הרצה מקומית

```
npm install
cp .env.example .env.development      # VITE_API_URL=http://localhost:5148
npm run dev                           # http://localhost:5173
```

השרת צריך לרוץ (`dotnet run --project src/TherapyBooking.API --launch-profile http`). הוא מאפשר CORS מ-`http://localhost:5173`.

משתמשי דמו (סיסמה `Demo1234!`): ‏`client1@demo.local`, ‏`client2@demo.local`, ‏`therapist@demo.local`.

## פריסה ל-Render

‏Static Site עם Build Command ‏`npm install && npm run build` ו-Publish Directory ‏`dist`. במשתנה הסביבה `VITE_API_URL` שמים את כתובת השרת. צריך להוסיף Rewrite Rule מ-`/*` ל-`/index.html`, כדי שרענון עמוד בנתיב פנימי יעבוד. בשרת מגדירים את `Cors__AllowedOrigins__0` לכתובת של האתר הזה.

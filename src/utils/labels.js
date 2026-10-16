// Hebrew labels and badge tones for the enums the API sends as strings

export const SLOT_STATUS = {
  Open: { label: 'פנוי', tone: 'green' },
  Booked: { label: 'תפוס', tone: 'warm' },
  Blocked: { label: 'חסום', tone: 'neutral' },
};

export const APPOINTMENT_STATUS = {
  Active: { label: 'פעיל', tone: 'green' },
  CancelledByClient: { label: 'בוטל על ידי המטופל/ת', tone: 'neutral' },
  CancelledByTherapist: { label: 'בוטל על ידי המטפלת', tone: 'danger' },
  Completed: { label: 'הושלם', tone: 'neutral' },
};

export const ROLES = {
  Therapist: 'Therapist',
  Client: 'Client',
};

import { api, unwrap } from './client';

/** { slotId, treatmentTypeId } -> 201 appointment, or 409 with { detail, alternatives } */
export const bookAppointment = (booking) => unwrap(api.post('/appointments', booking));

/** params: { from, to, status, page, pageSize } -> PagedResult (the server filters a client to their own) */
export const getAppointments = (params) => unwrap(api.get('/appointments', { params }));

export const cancelAppointment = (id) => unwrap(api.delete(`/appointments/${id}`));

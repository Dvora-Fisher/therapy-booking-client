import { api, unwrap } from './client';

/** params: { from, to, treatmentTypeId, status, page, pageSize, sortBy } -> PagedResult */
export const getSlots = (params) => unwrap(api.get('/slots', { params }));

export const getNextAvailableSlot = (treatmentTypeId) =>
  unwrap(api.get('/slots/next-available', { params: { treatmentTypeId } }));

export const createSlot = (slot) => unwrap(api.post('/slots', slot));

export const updateSlot = (id, slot) => unwrap(api.put(`/slots/${id}`, slot));

export const deleteSlot = (id) => unwrap(api.delete(`/slots/${id}`));

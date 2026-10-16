import { api, unwrap } from './client';

export const getTreatmentTypes = () => unwrap(api.get('/treatment-types'));

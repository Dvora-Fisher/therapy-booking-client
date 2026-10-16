import { api, unwrap } from './client';

export const login = (credentials) => unwrap(api.post('/auth/login', credentials));

export const register = (details) => unwrap(api.post('/auth/register', details));

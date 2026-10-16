import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The API address comes from VITE_API_URL (.env.development / Render environment), not from this file
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});

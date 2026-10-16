import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The API address comes from VITE_API_URL (.env.development / Render environment), not from this file
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // The server's CORS allows exactly http://localhost:5173 in Development.
    // Without strictPort a second "npm run dev" silently moves to 5174, and every API call
    // from there is blocked by CORS (shown as "no connection to the server").
    strictPort: true,
  },
});

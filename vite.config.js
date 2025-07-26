import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/smart-tic-tac-toe/", // 🔥 important!
  plugins: [react()],
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' để build ra thư mục dist chạy được ở bất kỳ đâu
// (Netlify, Vercel, GitHub Pages, hosting tĩnh, kể cả mở bằng sub-folder).
export default defineConfig({
  plugins: [react()],
  base: './',
});

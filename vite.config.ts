import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'static',
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        chapterOne: 'chapter-1/index.html',
        chapterTwo: 'chapter-2/index.html',
        about: 'about/index.html',
        notFound: '404.html',
      },
    },
  },
})

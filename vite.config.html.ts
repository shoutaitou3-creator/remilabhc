import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// HTML用の共有コンポーネントビルド設定
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/html',
    lib: {
      entry: resolve(__dirname, 'src/shared/html/index.ts'),
      name: 'RemilaSections',
      fileName: 'remila-shared-components',
      formats: ['umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  }
});
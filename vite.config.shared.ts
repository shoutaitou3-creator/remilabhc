import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 共有コンポーネントライブラリのビルド設定
    lib: {
      entry: resolve(__dirname, 'src/shared/index.ts'), // 共有コンポーネントのエントリーポイント
      name: 'RemilaSharedComponents', // グローバル変数名 (UMD/IIFEフォーマット用)
      fileName: (format) => `remila-shared-components.${format}.js`, // 出力ファイル名
      formats: ['es', 'umd'] // ES Modules と UMD フォーマットで出力
    },
    rollupOptions: {
      // 外部依存関係を指定 (バンドルに含めない)
      external: ['react', 'react-dom'],
      output: {
        // 外部依存関係のグローバル変数名を指定 (UMDフォーマット用)
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        }
      },
    }
  },
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ command, mode }) => {
  const isInline = mode === 'inline';

  return {
    plugins: [react(), ...(isInline ? [viteSingleFile()] : [])],
    server: {
      open: true,
    },
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@hooks': '/src/hooks',
      },
    },
    build: {
      ...(isInline && {
        cssCodeSplit: false,
        // 에셋을 base64로 인라인 처리 필요시 아래 옵션 사용 (100000000 => 약 100MB)
        // assetsInlineLimit: 100000000,
      }),
    },
  };
});

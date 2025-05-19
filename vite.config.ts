// vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    // react(),            ← 제거
    tailwindcss(),
    reactRouter(),        // 라우팅 + HMR 담당
    tsconfigPaths(),
  ],
  // 필요하다면 esbuild 옵션으로 JSX 변환 설정 추가
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});

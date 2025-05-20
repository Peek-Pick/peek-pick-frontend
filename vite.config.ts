// vite.config.ts
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),        // 라우팅 + HMR 담당
    tsconfigPaths(),
  ],
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  // ↓ 여기에 proxy, cors 옵션 추가
  server: {
    cors: true,
    proxy: {
      // 브라우저가 /uploads/** 요청을 localhost:8080 으로 포워딩
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});

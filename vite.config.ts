import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // ✅ 이 줄을 추가하면 다른 기기에서 접근 가능!
    port: 5173         // 기본 포트 그대로 유지
  }
})

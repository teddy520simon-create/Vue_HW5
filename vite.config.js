import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/Vue_HW5/', // 填寫你的 GitHub Repo 名稱，前後都要有斜線
})
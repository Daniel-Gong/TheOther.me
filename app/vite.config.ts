import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages: site is served from https://oria.me/app/
export default defineConfig({
  plugins: [react()],
  base: "/app/",
});

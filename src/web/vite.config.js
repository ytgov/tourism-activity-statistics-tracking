// Plugins
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

// Utilities
import { defineConfig } from "vite";
import path from "path";

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const _dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : dirname(fileURLToPath(import.meta.url))



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
    }),
  ],
  build: {
    outDir: "../app/dist/web",
  },
  define: { "process.env": {} },
  resolve: {
    alias: {
      '@/': `${path.resolve(_dirname, 'src')}/`
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    port: 8080,
  },
});

import { copyFileSync, mkdirSync, existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Plugin to copy manifest.json to dist
function copyManifest() {
  return {
    name: "copy-manifest",
    writeBundle() {
      const manifestPath = resolve(__dirname, "manifest.json");
      const distPath = resolve(__dirname, "dist");
      const distManifestPath = resolve(distPath, "manifest.json");

      if (!existsSync(distPath)) {
        mkdirSync(distPath, { recursive: true });
      }

      copyFileSync(manifestPath, distManifestPath);
      console.log("✓ Copied manifest.json to dist");
    },
  };
}

// Plugin to copy static assets (placeholder for future use)
function copyStaticAssets() {
  return {
    name: "copy-static-assets",
    writeBundle() {
      // Copy any static assets from src if needed
      // This is a placeholder for future asset copying
    },
  };
}

export default defineConfig({
  // Use relative base path for Chrome extension
  base: "./",

  plugins: [
    react(),
    copyManifest(),
    copyStaticAssets(),
    // Plugin to fix paths in HTML to be relative to the HTML file location
    {
      name: "fix-html-paths",
      transformIndexHtml(html, ctx) {
        // For popup.html, the JS and CSS are in the same directory
        if (ctx.path.includes("popup.html")) {
          return html
            .replace(/src="[^"]*\/main\.js"/g, 'src="./main.js"')
            .replace(/href="[^"]*\/popup\.css"/g, 'href="./popup.css"');
        }
        // For options.html, similar handling
        if (ctx.path.includes("options.html")) {
          return html.replace(/src="[^"]*\/options\.js"/g, 'src="./options.js"');
        }
        return html;
      },
    },
  ],

  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Popup entry
        popup: resolve(__dirname, "src/popup/popup.html"),
        // Background service worker
        background: resolve(__dirname, "src/background/index.ts"),
        // Content script
        contentScript: resolve(__dirname, "src/contentScript/index.ts"),
        // Options page (if needed)
        options: resolve(__dirname, "src/options/options.html"),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Keep background and content scripts in their original structure
          if (chunkInfo.name === "background") {
            return "src/background/index.js";
          }
          if (chunkInfo.name === "contentScript") {
            return "src/contentScript/index.js";
          }
          // Popup main entry
          if (chunkInfo.name === "popup") {
            return "src/popup/main.js";
          }
          // Options page
          if (chunkInfo.name === "options") {
            return "src/options/options.js";
          }
          return "src/[name]/[name].js";
        },
        chunkFileNames: "src/chunks/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          // Preserve HTML and CSS structure
          const info = assetInfo.name?.split(".") || [];
          const ext = info[info.length - 1];
          const name = info.slice(0, -1).join(".");

          if (ext === "html") {
            // Keep HTML files in their original location
            if (name === "popup") return "src/popup/popup.html";
            if (name === "options") return "src/options/options.html";
            return `src/${name}.html`;
          }
          if (ext === "css") {
            // CSS files go with their components
            if (name.includes("popup")) return "src/popup/popup.css";
            if (name.includes("options")) return "src/options/options.css";
            return `src/${name}.css`;
          }
          return `src/assets/[name]-[hash][extname]`;
        },
      },
    },
    // Don't minify in development
    minify: process.env.NODE_ENV === "production" ? "esbuild" : false,
    sourcemap: process.env.NODE_ENV === "development",
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  // Development server config (for testing popup/options pages)
  server: {
    port: 5173,
    strictPort: true,
  },
});

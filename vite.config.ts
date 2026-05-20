import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { Plugin } from "vite";

function ignoreMissingAssets(): Plugin {
  return {
    name: "ignore-missing-assets",
    load(id) {
      if (id.includes("/assets/vehicles/") || id.includes("/assets/brands/") || id.includes("/assets/banks/")) {
        return "export default ''";
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), ignoreMissingAssets()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MISSING_EXPORT") return;
        warn(warning);
      },
    },
  },
});

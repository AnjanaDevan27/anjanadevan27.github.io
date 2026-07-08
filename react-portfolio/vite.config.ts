import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deployed at anjanadevan27.github.io/portfolio/ alongside the existing static
// site at the root. A relative base ("./") makes the built asset paths work
// under any subpath (and at "/" during local dev). Output lands in dist/.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: true,
  },
});

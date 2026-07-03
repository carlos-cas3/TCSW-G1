import { defineConfig } from "vite";
import tailwind from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
    plugins: [
        tailwind(),
        svgr({
            svgrOptions: {
                exportType: "default",
                ref: true,
            },
        }),
        react(),
    ],
    test: {
        environment: 'jsdom',
        globals: true,
        exclude: ['e2e/**', 'node_modules/**'],
    },
});

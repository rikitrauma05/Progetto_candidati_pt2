import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./pages/**/*.{ts,tsx}",
        "./lib/**/*.{ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                surface: "var(--surface)",
                border: "var(--border)",
                accent: "var(--accent)",
                muted: "var(--muted)"
            },
            borderRadius: {
                xl: "0.75rem",
                "2xl": "1rem"
            },
            boxShadow: {
                card: "0 6px 24px rgba(0,0,0,0.08)"
            }
        }
    },
    plugins: []
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#1A1A1A",
                secondary: "#D4A853",
                tertiary: "#F5F0E8",
                accent: "#7A8B6E",
                warmWhite: "#F8F8F8",
                darkGray: "#2D2D2D",
            },
            fontFamily: {
                playfair: ["'Playfair Display'", "serif"],
                inter: ["'Inter'", "sans-serif"],
                space: ["'Space Grotesk'", "sans-serif"],
            },
            spacing: {
                '120': '120px',
                '80': '80px',
                '60': '60px',
            },
            maxWidth: {
                '1400': '1400px',
            }
        },
    },
    plugins: [],
}

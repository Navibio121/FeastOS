import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
            DEFAULT: '#EAB308', // Gold/Yellow
            foreground: '#000000',
        },
        secondary: {
            DEFAULT: '#18181B', // Dark zinc
            foreground: '#FFFFFF',
        }
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
      },
      animation: {
        shine: 'shine 2s infinite',
        blob: 'blob 7s infinite',
      }
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      addUtilities({
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.rotate-x-2': { transform: 'rotateX(2deg)' },
        '.rotate-y-2': { transform: 'rotateY(2deg)' },
        '.animation-delay-2000': { 'animation-delay': '2000ms' },
        '.animation-delay-4000': { 'animation-delay': '4000ms' },
      })
    }
  ],
};
export default config;

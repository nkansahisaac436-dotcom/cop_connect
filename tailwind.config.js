/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cop: {
          blue: {
            50: '#f0f5fc',
            100: '#dce8f8',
            200: '#bfd5f2',
            300: '#94bce9',
            400: '#619cdc',
            500: '#3d7dcb',
            600: '#2862b1',
            700: '#133e87', // Brand Ultramarine Blue
            800: '#0b2545', // Brand Deep Blue
            900: '#07182d', // Darkest Navy
            950: '#030c17',
          },
          gold: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b', // Brand Gold
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          red: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            500: '#ef4444',
            600: '#dc2626', // Brand Flame Red
            700: '#b91c1c',
          },
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'cop': '0 4px 20px -2px rgba(11, 37, 69, 0.08), 0 2px 6px -2px rgba(11, 37, 69, 0.04)',
        'cop-lg': '0 10px 25px -3px rgba(11, 37, 69, 0.12), 0 4px 10px -4px rgba(11, 37, 69, 0.06)',
        'gold-glow': '0 0 15px rgba(245, 158, 11, 0.35)',
      }
    },
  },
  plugins: [],
}

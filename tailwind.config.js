/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'alarm-shake': 'alarm-shake 0.5s infinite',
      },
      keyframes: {
        'alarm-shake': {
          '0%, 100%': { transform: 'translateX(0) scale(1)' },
          '25%': { transform: 'translateX(-10px) scale(1.02)' },
          '50%': { transform: 'translateX(10px) scale(0.98)' },
          '75%': { transform: 'translateX(-10px) scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}

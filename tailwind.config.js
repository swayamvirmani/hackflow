/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f0',
          100: '#ffe3c6',
          200: '#ffd08c',
          300: '#ffb84d',
          400: '#ff9a1f',
          500: '#ff6f00',
          600: '#e65100',
          700: '#bf360c',
          800: '#a31515',
          900: '#7f0000',
        },
        secondary: {
          50: '#fffbe6',
          100: '#fff3b0',
          200: '#ffe066',
          300: '#ffd700',
          400: '#ffb300',
          500: '#ff9800',
          600: '#f57c00',
          700: '#e65100',
          800: '#bf360c',
          900: '#7f0000',
        },
      },
      fontFamily: {
        sans: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #ff6f00 0%, #ffd700 100%)',
        'card-gradient': 'linear-gradient(135deg, #fff5f0 0%, #ffe066 100%)',
        'reddish-yellowish': 'linear-gradient(120deg, #ff6f00 0%, #ffd700 100%)',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        }
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out forwards',
      }
    },
  },
  plugins: [],
}
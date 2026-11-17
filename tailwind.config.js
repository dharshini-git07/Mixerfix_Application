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
          DEFAULT: '#087F75',
          dark: '#06635B',
          light: '#0AA396',
          50: '#F0F9F8',
          100: '#DDF4EF',
          500: '#087F75',
          600: '#06635B',
          700: '#054C46',
        },
        secondary: {
          DEFAULT: '#142D3A',
          dark: '#0D1E27',
          light: '#1F4356',
        },
        bgLight: '#F5F8F8',
        cardBg: '#FFFFFF',
        accent: '#DDF4EF',
        textPrimary: '#263238',
        textSecondary: '#718096',
        success: '#16A34A',
        warning: '#F59E0B',
        danger: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px 0 rgba(8, 127, 117, 0.06)',
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Direct brand names with kebab-case
        'brand-primary': '#087F75',
        'brand-secondary': '#142D3A',
        'brand-accent': '#DDF4EF',
        
        // Semantic text and background
        'primary-text': '#263238',
        'secondary-text': '#718096',
        'bg-light': '#F5F8F8',
        'card-bg': '#FFFFFF',

        'success-text': '#16A34A',
        'warning-text': '#F59E0B',
        'danger-text': '#DC2626',
        'secondary-light': '#1F4356',

        // Object notation for standard colors
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
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px 0 rgba(8, 127, 117, 0.06)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      borderRadius: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}

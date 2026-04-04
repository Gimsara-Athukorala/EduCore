/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f9',
          100: '#e0e9f3',
          200: '#c1d3e7',
          300: '#a2bddb',
          400: '#6b95be',
          500: '#3B82F6',
          600: '#2563eb',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#172554',
        },
        accent: {
          50: '#fafbfc',
          100: '#f5f7fa',
          200: '#ebeef5',
          500: '#ffffff',
        },
      },
    },
  },
  plugins: [],
};

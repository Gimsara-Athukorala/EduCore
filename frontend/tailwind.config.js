module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#c9e0ff',
          300: '#aed4ff',
          400: '#88bfff',
          500: '#1E3A8A',
          600: '#1E3A8A',
          700: '#1a2f6a',
          800: '#162456',
          900: '#131d45',
        },
        secondary: '#3B82F6',
        accent: '#FFFFFF',
        light: '#F3F4F6',
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Oxygen"',
          '"Ubuntu"',
          '"Cantarell"',
          '"Fira Sans"',
          '"Droid Sans"',
          '"Helvetica Neue"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}

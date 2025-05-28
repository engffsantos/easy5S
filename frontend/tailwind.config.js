// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#3B82F6',  // azul padrão, substitua se quiser
          600: '#2563EB',
        },
        secondary: {
          500: '#10B981',
          600: '#059669',
        },
        accent: {
          500: '#F59E0B',
          600: '#D97706',
        },
      },
    },
  },
  plugins: [],
}

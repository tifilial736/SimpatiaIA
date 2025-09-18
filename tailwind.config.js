/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#155EEF', // Azul principal
          dark: '#0F3BFF', // Azul escuro
          light: '#1E40AF', // Azul claro
        },
        secondary: {
          DEFAULT: '#9333EA', // Roxo principal
          dark: '#7E22CE',
          light: '#C084FC',
        },
        neutral: {
          900: '#111827', // Preto/Cinza escuro
          600: '#6B7280', // Cinza médio
          200: '#E5E7EB', // Cinza claro
          50: '#F9FAFB', // Fundo bem claro
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], // Fonte do Figma
      },
    },
  },
  plugins: [],
};

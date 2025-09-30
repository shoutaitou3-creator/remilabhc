/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'sm': '380px', // 2列表示のため調整済み
        // md, lg, xl は Tailwind のデフォルト値を使用
        // md: '768px', lg: '1024px', xl: '1280px'
      },
      fontFamily: {
        'sans': ['Noto Sans JP', 'sans-serif'],
      },
      keyframes: {
        'shine': {
          '0%': { 'background-position': '100% 0' },
          '25%': { 'background-position': '-200% 0' },
          '26%, 100%': { 'background-position': '0% 0' },
        },
      },
      animation: {
        'shine': 'shine 4s linear infinite',
        'fadeIn': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        'fadeIn': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

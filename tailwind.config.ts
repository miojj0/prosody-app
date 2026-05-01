import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        purple: {
          400: '#c084fc',
        },
        pink: {
          400: '#f472b6',
          600: '#db2777',
        },
        blue: {
          400: '#60a5fa',
        },
      },
    },
  },
  plugins: [],
};

export default config;

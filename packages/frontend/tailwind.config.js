import withMT from '@material-tailwind/react/utils/withMT';

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../../node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      zIndex: {
        tooltip: '52',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xs': '0.5rem',
      },
      colors: {
        emerald: {
          100: '#d1fae5',
          200: '#a9f1d0',
          300: '#6ee7b7',
          400: '#34d399',
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        gray: {
          0: '#ffffff',
          100: '#f1f5f9',
          200: '#e2e9f0',
          300: '#cbd6e1',
          400: '#94a7b8',
          50: '#f8fafc',
          500: '#60788f',
          600: '#475969',
          700: '#334555',
          800: '#1b2d3e',
          900: '#0b1d2e',
        },
        orange: {
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          50: '#fff7ed',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        rose: {
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          50: '#fff1f2',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        snowball: {
          100: '#e1f1fe',
          200: '#ddeefd',
          300: '#cfe6fc',
          400: '#74bafb',
          50: '#ecf6fe',
          500: '#47a4fa',
          600: '#0f86f5',
          700: '#0977dc',
          800: '#075185',
          900: '#0a3a5c',
        },
        base: {
          bg: '#ffffff',
          'bg-alternate': '#f8fafc',
          'bg-emphasized': '#f1f5f9',
          'bg-emphasized-danger': '#fff1f2',
          'bg-emphasized-info': '#ecf6fe',
          'bg-emphasized-success': '#ecfdf5',
          'bg-emphasized-warning': '#fff7ed',
        },
        border: {
          active: '#0f86f5',
          danger: '#e11d48',
          'danger-light': '#ffe4e6',
          'info-light': '#ddeefd',
          interactive: '#082f561a',
          'interactive-hovered': '#082f5624',
          separator: '#082f560f',
          'success-light': '#d1fae5',
          'warning-light': '#ffedd5',
        },
        controls: {
          danger: '#e11d48',
          'danger-hovered': '#be123c',
          disabled: '#e2e9f0',
          'disabled-active': '#74bafb',
          elevated: '#ffffff',
          inset: '#e2e9f0',
          'inset-hovered': '#cbd6e1',
          primary: '#0f86f5',
          'primary-hovered': '#0977dc',
          secondary: '#ddeefd',
          'secondary-hovered': '#cfe6fc',
          tertiary: '#ffffff',
          'tertiary-hovered': '#f8fafc',
        },
        elements: {
          danger: '#e11d48',
          disabled: '#94a7b8',
          'high-em': '#0b1d2e',
          info: '#0f86f5',
          link: '#0f86f5',
          'link-hovered': '#0977dc',
          'low-em': '#60788f',
          'mid-em': '#475969',
          'on-danger': '#ffffff',
          'on-disabled': '#60788f',
          'on-disabled-active': '#0a3a5c',
          'on-emphasized-danger': '#9f1239',
          'on-emphasized-info': '#0a3a5c',
          'on-emphasized-success': '#065f46',
          'on-emphasized-warning': '#9a3412',
          'on-high-contrast': '#ffffff',
          'on-primary': '#ffffff',
          'on-secondary': '#0977dc',
          'on-secondary-tinted': '#075185',
          'on-tertiary': '#1b2d3e',
          success: '#059669',
          warning: '#ea580c',
        },
        surface: {
          card: '#ffffff',
          'card-hovered': '#f8fafc',
          floating: '#ffffff',
          'floating-hovered': '#f1f5f9',
          'high-contrast': '#0b1d2e',
        },
      },
      boxShadow: {
        button:
          'inset 0px 0px 4px rgba(255, 255, 255, 0.25), inset 0px -2px 0px rgba(0, 0, 0, 0.04)',
        calendar:
          '0px 3px 20px rgba(8, 47, 86, 0.1), 0px 0px 4px rgba(8, 47, 86, 0.14)',
        field: '0px 1px 2px rgba(0, 0, 0, 0.04)',
      },
      spacing: {
        2.5: '0.625rem',
        3.25: '0.8125rem',
        3.5: '0.875rem',
      },
    },
  },
  plugins: [],
});

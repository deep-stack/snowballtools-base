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
      colors: {
        snowball: {
          200: '#DDEEFD',
          500: '#47A4FA',
        },
      },
    },
  },
  plugins: [],
});

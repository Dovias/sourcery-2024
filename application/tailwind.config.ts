import type { Config } from 'tailwindcss'

const config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif']
    },
    fontSize: {
      'xs': '0.625rem',
      'sm': '0.6875rem',
      'base': '0.75rem',
      'lg': '0.875rem',
      'xl': '1.25rem',
      '2xl': '2rem'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFFFFF',
      gray: {
        100: '#F7F7F7',
        200: '#F4F4F4',
        300: '#DDDDDD',
        400: '#999999',
        500: '#666666',
        600: '#333333'
      },
      red: {
        100: '#fff5f5',
        200: '#db9494',
        300: '#d70000'
      },
      magenta: {
        100: '#F4E4EF',
        200: '#B64A96'
      },
      purple: {
        100: '#EAE6F7',
        200: '#7157CB'
      },
      blue: {
        100: '#E6ECFC',
        200: '#E3EAFD',
        300: '#4072F2',
        400: '#003FE1',
        500: '#00327d',
      },
      cyan: {
        100: '#E5F3FA',
        200: '#50AEDD',
        300: '#162D3D'
      },
      teal: {
        100: '#E6F1F1',
        200: '#589DA0'
      },
      green: {
        100: '#e4f2e2',
        200: '#bde0b8',
        300: '#95cd8d',
        400: '#7BC171',
        500: '#6ead65',
        600: '#629a5a', 
      },
      yellow: {
        100: '#FDF4E3',
        200: '#F2B340'
      },
      black: '#000000'
    },
    extend: {
      size: {
        '5.5': '1.375rem'
      },
      spacing: {
        '18': '4.4375rem'
      },
      content: {
        'empty': '""'
      }
    }
  },
  plugins: [],
} satisfies Config;

export default config;

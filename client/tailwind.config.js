/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      colors: {
        ink: {
          DEFAULT: '#1a1a2e',
          light: '#2d2d4a'
        },
        gold: {
          DEFAULT: '#c9a84c',
          light: '#f0d080',
          dark: '#a07830'
        },
        cream: {
          DEFAULT: '#faf7f0',
          dark: '#f0ebe0'
        },
        slate: {
          invoice: '#4a5568'
        }
      }
    }
  },
  plugins: []
}

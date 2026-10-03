/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0b0b',
        surface: '#171717',
        'surface-subtle': '#222222',
        text: '#f5f1e8',
        muted: '#aaa59b',
        accent: '#d71920',
        'accent-hover': '#b5141a',
        warning: '#f1b434',
        success: '#2f9e66',
        border: '#3b3935',
        'border-light': '#55524c',
      },
      fontFamily: {
        wordmark: ['Impact', 'Haettenschweiler', '"Arial Narrow Bold"', 'sans-serif'],
        heading: ['"Oswald"', 'Impact', '"Arial Black"', 'sans-serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'punk': '4px 4px 0px #000000',
        'punk-accent': '4px 4px 0px #d71920',
        'punk-white': '4px 4px 0px #f5f1e8',
        'punk-lg': '8px 8px 0px #000000',
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}

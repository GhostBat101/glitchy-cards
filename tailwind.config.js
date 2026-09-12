/**
 * Tailwind Configuration - Defines custom palette tokens, terracotta theme accents, and optical animation keyframes.
 * Communicates with: PostCSS, Tailwind CLI, and src/index.css.
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        terracotta: '#E96C3B',
        obsidian: {
          950: '#07090e',
          900: '#0c0f17',
          800: '#131822',
          700: '#1b2332'
        },
        laser: {
          cyan: '#00f6ff',
          magenta: '#ff007f',
          lime: '#39ff14',
          amber: '#ffb703'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite'
      }
    }
  },
  plugins: []
};

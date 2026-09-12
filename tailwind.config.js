/**
 * Tailwind Configuration - Defines custom palette tokens, #7f7f7f neutral canvas shades, and animation keyframes.
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
        canvas: '#7f7f7f',
        neutralGray: {
          950: '#111111',
          900: '#1a1a1a',
          850: '#222222',
          800: '#2b2b2b',
          700: '#3d3d3d',
          600: '#525252',
          500: '#7f7f7f',
          400: '#9e9e9e',
          300: '#bfbfbf',
          200: '#d9d9d9',
          100: '#f0f0f0'
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

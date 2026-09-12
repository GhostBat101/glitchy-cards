/**
 * Tailwind Configuration - Defines custom glitch palettes, typography, and optical animation keyframes.
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
        obsidian: {
          900: '#07090e',
          800: '#0c1017',
          700: '#141a24',
          600: '#1d2634'
        },
        laser: {
          cyan: '#00f6ff',
          magenta: '#ff007f',
          lime: '#39ff14',
          amber: '#ffb703',
          violet: '#a855f7'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite'
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        }
      }
    }
  },
  plugins: []
};

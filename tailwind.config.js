/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Holiday Extras brand colors
        primary: {
          50: '#F4F1F8',
          100: '#E9E3F1',
          200: '#D3C7E3',
          300: '#BDABD5',
          400: '#A78FC7',
          500: '#4F2D7F', // Primary brand color (purple)
          600: '#3F2466',
          700: '#2F1B4C',
          800: '#1F1233',
          900: '#100919',
        },
        secondary: {
          50: '#FFF9E6',
          100: '#FFF3CC',
          200: '#FFE799',
          300: '#FFDB66',
          400: '#FFCF33',
          500: '#FFB81C', // Secondary brand color (golden yellow)
          600: '#CC9316',
          700: '#996E11',
          800: '#66490B',
          900: '#332506',
        },
        accent: {
          50: '#F7F1F8',
          100: '#EFE3F1',
          200: '#DFC7E3',
          300: '#CFABD5',
          400: '#BF8FC7',
          500: '#AF73B9', // Accent color (light purple)
          600: '#8C5C94',
          700: '#69456F',
          800: '#462E4A',
          900: '#231725',
        },
        success: {
          500: '#10B981',
        },
        warning: {
          500: '#F59E0B',
        },
        error: {
          500: '#EF4444',
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.08)',
        dropdown: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-once': 'pulse 1.5s ease-in-out 1',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
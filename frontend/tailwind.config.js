/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 8s ease-in-out infinite 2s',
        'float-slow': 'float-slow 10s ease-in-out infinite 1s',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'text-shimmer': 'text-shimmer 2s infinite',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'fade-in-scale': 'fade-in-scale 0.5s ease-out forwards',
        'bounce-in': 'bounce-in 0.8s ease-out forwards',
        'typing': 'typing 3s steps(40, end), blink 1s infinite',
      },
      keyframes: {
        'gradient-shift': {
          '0%': {
            background: 'linear-gradient(45deg, #8b5cf6, #ec4899, #f97316)',
          },
          '25%': {
            background: 'linear-gradient(45deg, #a855f7, #f472b6, #fb923c)',
          },
          '50%': {
            background: 'linear-gradient(45deg, #9333ea, #e879f9, #f59e0b)',
          },
          '75%': {
            background: 'linear-gradient(45deg, #7c3aed, #d946ef, #ea580c)',
          },
          '100%': {
            background: 'linear-gradient(45deg, #8b5cf6, #ec4899, #f97316)',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-20px) rotate(5deg)',
          },
        },
        'float-delayed': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-15px) rotate(-3deg)',
          },
        },
        'float-slow': {
          '0%, 100%': {
            transform: 'translateY(0px) rotate(0deg)',
          },
          '50%': {
            transform: 'translateY(-10px) rotate(2deg)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(255, 255, 255, 0.6)',
          },
        },
        'text-shimmer': {
          '0%': {
            backgroundPosition: '-200% center',
          },
          '100%': {
            backgroundPosition: '200% center',
          },
        },
        'slide-up': {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in-scale': {
          from: {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'bounce-in': {
          '0%': {
            opacity: '0',
            transform: 'scale(0.3)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.05)',
          },
          '70%': {
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'typing': {
          from: {
            width: '0',
          },
          to: {
            width: '100%',
          },
        },
        'blink': {
          '0%, 50%': {
            opacity: '1',
          },
          '51%, 100%': {
            opacity: '0',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
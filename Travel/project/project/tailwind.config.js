/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colors (aligned to the TripSangi logo)
        primary: '#06B6D4', // cyan
        secondary: '#7C3AED', // purple
        accent: '#1E40AF', // indigo (for accents)

        // Semantic palette for UI elements
        surface: '#ffffff',
        bg: '#f7fafc',
        muted: '#64748b',
        text: '#0f172a',
        border: '#e6edf3',

        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#0ea5e9',

        'brand-cyan': '#06B6D4',
        'brand-purple': '#7C3AED',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #06B6D4 0%, #7C3AED 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
};

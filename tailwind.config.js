module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#059494',
        'primary-light': '#E6F7F7',
        accent: '#FF6B35',
        'accent-light': '#FFF0EA',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        surface: '#FFFFFF',
        'surface-alt': '#F9FAFB',
        border: '#E5E7EB',
        veg: '#22C55E',
        nonveg: '#EF4444',
      },
      fontFamily: {
        poppins: ['Poppins'],
        inter: ['Inter'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
    },
  },
  plugins: [],
};

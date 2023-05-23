module.exports = {
  content: [
    './src/**/*.tsx'
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif']
    },
    extend: {
      colors: {
        'accent-primary': '#9D0A0E',
        'accent-secondary': '#e11218',
        'bg-light': '#ffffff',
        'bg-darken': '#f8f8f8',
        'text-primary': '#181818',
        'text-secondary': '#747474',
        'stroke': '#d7d7d7',
        'white': '#ffffff',
        'error': '#ed2121',
        'success': '#28b411'
      }
    },
  },
  plugins: [],
}

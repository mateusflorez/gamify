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
        dark: '#121214',
        cloudy: '#2A2634',
        rainy: '#1b1922'
      },
      backgroundImage: {
        'rainbow-gradient': "linear-gradient(89.86deg, #9572FC 0%, #43E7AD 33.33%, #E1D55D 66.67%, #9572FC 100%)"
      }
    },
  },
  plugins: [],
}

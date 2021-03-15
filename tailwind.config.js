module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing:{
        '100' : '30rem',
        '110' : '35rem'
      },
      gridTemplateRows:{
        '7' : 'repeat(7,minmax(0,1fr))'
      },
      gridRowEnd: {
        '8' : '8',
  
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
 
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      spacing: {
        ...Array.from({ length: 400 }, (_, i) => `${(i * .01).toFixed(2)}rem`)
      },
      borderWidth:{
        ...Array.from({ length: 400 }, (_, i) => `${i}px`)
      },
      borderRadius:{
        ...Array.from({ length: 400 }, (_, i) => `${(i * .01).toFixed(2)}rem`)
      },
      fontSize: {
        ...Array.from({ length: 400 }, (_, i) => `${(i * .01).toFixed(2)}rem`)
      },
      minHeight: {
        ...Array.from({ length: 400 }, (_, i) => `${(i * .01).toFixed(2)}rem`)
      },
      maxWidth: {
        ...Array.from({ length: 400 }, (_, i) => `${(i * .01).toFixed(2)}rem`)
      },
      colors: {
        primary: '#34D026',
        text: '#112438',
        bc: '#F6F7F9',
        error: '#f11f29',
        warn: '#faad00'
      },
      opacity: {
        ...Array.from({ length: 100 }, (_, i) => i / 100)
      }
    },
  },
  plugins: [
    plugin(({ matchComponents }) => {
      const values = Array.from({ length: 400 }, (_, i) => `${i}px`)
        if (matchComponents) {
          matchComponents(
            {
              [`b`]: val => ({ 'border': `${val} solid #F6F7F9` }),
              [`b-t`]: val => ({ 'border-top': `${val} solid #F6F7F9` }),
              [`b-r`]: val => ({ 'border-right': `${val} solid #F6F7F9` }),
              [`b-b`]: val => ({ 'border-bottom': `${val} solid #F6F7F9` }),
              [`b-l`]: val => ({ 'border-left': `${val} solid #F6F7F9` }),
            },
            { values: values }
          )
        }
    })
  ]
}

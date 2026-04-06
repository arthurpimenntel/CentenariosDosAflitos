import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        red: {
          primary: '#ED1C24',
          hover:   '#C41219',
          bright:  '#FF2020',
        },
        navy: {
          accent: '#003087',
        },
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        ultras:  ['Oswald', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config

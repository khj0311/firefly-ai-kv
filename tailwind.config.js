/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000',
        background: '#fff',
        text: '#333',
      },
      fontFamily: {
        'samsung-sharp': ['SamsungSharpSans', 'arial', 'sans-serif'],
        'samsung-one': ['SamsungOne', 'arial', 'sans-serif'],
        'samsung-one-kr': ['SamsungOneKorean', 'Dotum', '돋움', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

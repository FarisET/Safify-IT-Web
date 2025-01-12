// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ensures Tailwind scans all your React components for classes
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#1893f8', // Adjust this to match your design
        secondary: '#56aeff', // Sidebar background color
        grey: '#DFE1E6', // Border color
        lightGrey: '#F4F5F7', // Hover color
        blue: '#0065FF',
        orange: '#FF5630',
        green: '#36B37E',
      },
    },
  },
  plugins: [],
};

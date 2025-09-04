/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'quest-blue': '#3B82F6',
        'quest-blue-dark': '#2563EB',
        'quest-purple': '#8B5CF6',
        'quest-purple-dark': '#7C3AED',
        'quest-orange': '#F59E0B',
        'quest-green': '#10B981',
      }
    },
  },
  plugins: [],
}

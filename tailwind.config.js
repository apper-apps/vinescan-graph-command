/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wine-burgundy': '#722F37',
        'wine-gold': '#B8860B',
        'wine-red': '#CD5C5C',
        'wine-beige': '#F5F5DC',
        'wine-cream': '#FAF9F6',
        'wine-success': '#556B2F',
        'wine-warning': '#DAA520',
        'wine-error': '#DC143C',
        'wine-info': '#4682B4',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'cork-texture': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23F5F5DC\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"10\" cy=\"10\" r=\"2\"/%3E%3Ccircle cx=\"50\" cy=\"50\" r=\"1.5\"/%3E%3Ccircle cx=\"30\" cy=\"20\" r=\"1\"/%3E%3C/g%3E%3C/svg%3E')",
        'wine-stain': "url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M50 10c15 0 30 15 30 30 0 20-15 30-30 30s-30-10-30-30c0-15 15-30 30-30z\" fill=\"%23722F37\" fill-opacity=\"0.03\"/%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}
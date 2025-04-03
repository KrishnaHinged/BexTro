module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Ensure your files are scanned
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")], // Remove DaisyUI plugin
};
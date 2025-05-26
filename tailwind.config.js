/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
    content: [
        "./node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
        "./node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require("flowbite/plugin")
    ],
};

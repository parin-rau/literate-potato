/*eslint-env node*/
/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			keyframes: {
				slideInLeft: {
					"0%": { transform: "translateX(-100%)" },
					"100%": { transform: "translateX(0)" },
				},
				slideOutLeft: {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(-100%)" },
				},
			},
			animation: {
				slideInLeft: "slideInLeft 0.1s ease-out",
				slideOutLeft: "slideOutLeft 0.1s ease-out",
			},
		},
	},
	plugins: [require("@tailwindcss/container-queries")],
};

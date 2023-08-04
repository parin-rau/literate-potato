import { useState } from "react";

export default function Nav() {
	const [darkMode, setDarkMode] = useState(true);

	function handleToggle() {
		setDarkMode(!darkMode);
	}

	return (
		<div>
			<button className="" onClick={handleToggle} type="button">
				{darkMode ? "Light" : "Dark"}
			</button>
			<button onClick={() => console.log(localStorage.theme)}>
				Local Storage Theme
			</button>
		</div>
	);
}

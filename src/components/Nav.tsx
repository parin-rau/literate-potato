import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

export default function Nav() {
	const [darkMode, setDarkMode] = useState(true);

	function handleToggle() {
		setDarkMode(!darkMode);
	}

	return (
		<div className="fixed top-0 z-20 w-full bg-slate-100 px-1 sm:px-2">
			<div className="flex flex-grow flex-row justify-between sm:space-x-6 space-x-2 sm:px-4 px-1 py-2 items-center w-full">
				<Link to={`/`}>
					<h2 className="text-bold text-xl">Home</h2>
				</Link>
				<SearchBar />
				<div className="flex space-x-4">
					<button className="" onClick={handleToggle} type="button">
						{darkMode ? (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
								/>
							</svg>
						) : (
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
								/>
							</svg>
						)}
					</button>
					{/* <button onClick={() => console.log(localStorage.theme)}>
					Local Storage Theme
				</button> */}
					<div className="flex flex-shrink-0 pr-4 justify-start">
						<Link
							to={"login"}
							className="text-md text-white font-bold bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-lg "
						>
							Sign In
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import SignInButton from "./SignInButton";

export default function NavBar() {
	const [theme, setTheme] = useState<string>(localStorage.theme);
	const navigate = useNavigate();

	function handleThemeToggle() {
		theme === "dark" ? setTheme("light") : setTheme("dark");
	}

	useEffect(() => {
		function changeTheme() {
			if (theme === "dark") {
				document.documentElement.classList.add("dark");
				localStorage.theme = "dark";
			} else {
				document.documentElement.classList.remove("dark");
				localStorage.theme = "light";
			}
		}
		changeTheme();
	}, [theme]);

	async function logout() {
		const res = await fetch("/auth/logout", {
			credentials: "include",
		});
		if (res.ok) {
			navigate("/login");
		}
	}

	return (
		<div className="fixed top-0 z-20 w-full bg-slate-100 dark:bg-neutral-900 px-1 sm:px-2 dark:border-b dark:border-zinc-800">
			<div className="flex flex-grow flex-row justify-between sm:space-x-6 space-x-2 sm:px-4 px-1 py-2 items-center w-full ">
				<Link to={`/`}>
					<h2 className="text-bold text-xl">Home</h2>
				</Link>
				<SearchBar linkTo="/search" />
				<div className="flex space-x-4">
					<button
						className=""
						onClick={handleThemeToggle}
						type="button"
					>
						{theme === "light" ? (
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
					<div className="flex flex-shrink-0 pr-4 justify-start">
						{/* <SignInButton /> */}
						<Link
							to={"/login"}
							className="duration-200 text-md text-white font-bold bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 py-2 px-4 rounded-lg "
						>
							Sign In
						</Link>
						<button
							className="duration-200 text-md text-white font-bold bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 py-2 px-4 rounded-lg "
							onClick={logout}
						>
							Sign Out
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

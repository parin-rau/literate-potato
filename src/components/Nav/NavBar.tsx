import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import SignInButton from "./SignInButton";
import DarkModeToggle from "./DarkModeToggle";
import { SidebarToggle } from "./Sidebar";
import HamburgerToggle from "./HamburgerToggle";
import SidebarRight from "./SidebarRight";
import SidebarButton from "./SidebarButton";
import { Link } from "react-router-dom";

export default function NavBar() {
	const [theme, setTheme] = useState<string>(localStorage.theme);
	const [isOpenSidebar, setOpenSidebar] = useState(false);
	const [isOpenSecondarySidebar, setOpenSecondarySidebar] = useState(false);

	//const username = sessionStorage.getItem("username");

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

	function handleSidebarToggle(isOpen?: boolean) {
		if (isOpen === true || isOpen === false) {
			setOpenSidebar(isOpen);
		} else {
			setOpenSidebar((prev) => !prev);
		}
	}

	function handleSecondarySidebarToggle(isOpen?: boolean) {
		if (isOpen === true || isOpen === false) {
			setOpenSecondarySidebar(isOpen);
		} else {
			setOpenSecondarySidebar((prev) => !prev);
		}
	}

	return (
		<>
			<div className="fixed top-0 z-20 w-full bg-slate-100 dark:bg-neutral-900 p-2 dark:border-b dark:border-zinc-800">
				<div className="flex flex-grow flex-row justify-between gap-2 items-center w-full ">
					<HamburgerToggle
						className="block sm:hidden"
						type="button"
						onClick={handleSidebarToggle}
					/>
					<SearchBar linkTo="/search" />
					<DarkModeToggle {...{ theme, handleThemeToggle }} />
					{/* <SignInButton /> */}
					<HamburgerToggle
						type="button"
						onClick={handleSecondarySidebarToggle}
					/>
				</div>
			</div>
			<SidebarToggle {...{ isOpenSidebar, handleSidebarToggle }} />
			<SidebarRight
				{...{
					isOpenSidebar: isOpenSecondarySidebar,
					handleSidebarToggle: handleSecondarySidebarToggle,
				}}
			/>
		</>
	);
}

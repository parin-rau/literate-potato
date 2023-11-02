import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { SidebarToggle } from "./Sidebar";
import HamburgerToggle from "./HamburgerToggle";
import ToggleButton from "./ToggleButton";
import DarkModeIcon from "../Svg/DarkModeIcon";
import InboxIcon from "../Svg/InboxIcon";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
	const navigate = useNavigate();
	const [theme, setTheme] = useState<string>(localStorage.theme);
	const [isOpenSidebar, setOpenSidebar] = useState(false);

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

	function handleInboxClick() {
		navigate("/notification");
	}

	return (
		<>
			<div className="fixed top-0 z-10 w-full bg-slate-100 dark:bg-neutral-900 p-2 dark:border-b dark:border-zinc-800">
				<div className="flex flex-grow flex-row justify-between gap-2 items-center w-full ">
					<div className="hidden sm:block w-[128px] flex-shrink-0" />
					<HamburgerToggle
						className="block sm:hidden"
						type="button"
						onClick={handleSidebarToggle}
					/>
					<SearchBar linkTo="/search" />

					<ToggleButton onClick={handleInboxClick}>
						<InboxIcon notificationCount={3} />
					</ToggleButton>

					<ToggleButton onClick={handleThemeToggle}>
						<DarkModeIcon theme={theme} />
					</ToggleButton>
				</div>
			</div>
			<SidebarToggle {...{ isOpenSidebar, handleSidebarToggle }} />
		</>
	);
}

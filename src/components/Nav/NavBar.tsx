import { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import { SidebarToggle } from "./Sidebar";
import HamburgerToggle from "./HamburgerToggle";
import ToggleButton from "./ToggleButton";
import DarkModeIcon from "../Svg/DarkModeIcon";
import InboxIcon from "../Svg/InboxIcon";
import { useNavigate } from "react-router-dom";
import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";
import { useAuth } from "../../hooks/auth/useAuth";

type Props = {
	setNavbarLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NavBar({ setNavbarLoading }: Props) {
	const navigate = useNavigate();
	const [theme, setTheme] = useState<string>(localStorage.theme);
	const [isOpenSidebar, setOpenSidebar] = useState(false);
	const [notificationCount, setNotificationCount] = useState(0);
	const { protectedFetch } = useProtectedFetch();
	const { user } = useAuth();

	function handleThemeToggle() {
		//theme === "dark" ? setTheme("light") : setTheme("dark");
		if (theme === "dark") {
			document.documentElement.classList.remove("dark");
			localStorage.theme = "light";
			setTheme("light");
		} else {
			document.documentElement.classList.add("dark");
			localStorage.theme = "dark";
			setTheme("dark");
		}
	}

	useEffect(() => {
		const getNotificationCount = async () => {
			const res = await protectedFetch(
				`/api/notification/${user.current?.userId}/count`
			);

			if (res.ok) {
				const { count } = await res.json();
				setNotificationCount(count);
				setNavbarLoading(false);
			}
		};

		if (user.current?.userId) getNotificationCount();
	}, [protectedFetch, setNavbarLoading, user]);

	function handleSidebarToggle(isOpen?: boolean) {
		if (isOpen === true || isOpen === false) {
			setOpenSidebar(isOpen);
		} else {
			setOpenSidebar((prev) => !prev);
		}
	}

	function handleInboxClick() {
		setNotificationCount(0);
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
						<InboxIcon notificationCount={notificationCount} />
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

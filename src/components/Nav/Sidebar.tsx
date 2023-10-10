import SidebarButton from "./SidebarButton";
import { useAuth } from "../../hooks/useAuth";
import HamburgerToggle from "./HamburgerToggle";
import SignOutButton from "./SignOutButton";

function SidebarContent({
	handleSidebarToggle,
}: {
	handleSidebarToggle?: (_v?: boolean) => void;
}) {
	const { user } = useAuth();
	const isAdmin = user?.current?.roles.includes(0) ? true : false;

	return (
		<>
			<SidebarButton
				to={"/"}
				text="Home"
				toggleSidebar={handleSidebarToggle}
			/>
			<SidebarButton
				to={"/group"}
				text="Groups"
				toggleSidebar={handleSidebarToggle}
			/>
			<SidebarButton
				to={"/project"}
				text="Projects"
				toggleSidebar={handleSidebarToggle}
			/>
			<SidebarButton
				to={"/ticket"}
				text="Tasks"
				toggleSidebar={handleSidebarToggle}
			/>
			<SidebarButton
				to={"/user"}
				text="Profile"
				toggleSidebar={handleSidebarToggle}
			/>
			{isAdmin && (
				<SidebarButton
					to={"/admin"}
					text="Admin"
					toggleSidebar={handleSidebarToggle}
				/>
			)}
			<hr className="border-slate-300 dark:border-neutral-700" />
			<SidebarButton to="/settings" text="Settings" />
			<SignOutButton />
		</>
	);
}

export default function Sidebar() {
	return (
		<div className="fixed z-20 top-0 left-0 h-screen w-32 m-0 p-2 hidden sm:flex flex-col gap-2 dark:bg-neutral-900 bg-slate-100 border-r dark:border-r-neutral-800 border-r-slate-200">
			<SidebarContent />
		</div>
	);
}

export function SidebarToggle({
	isOpenSidebar,
	handleSidebarToggle,
}: {
	isOpenSidebar: boolean;
	handleSidebarToggle: (_v?: boolean) => void;
}) {
	return (
		isOpenSidebar && (
			<>
				<div className="fixed z-50 top-0 left-0 h-screen w-32 m-0 p-2 flex flex-col gap-2 dark:bg-neutral-900 bg-slate-100 border-r dark:border-r-neutral-800 border-r-slate-200">
					<HamburgerToggle onClick={handleSidebarToggle} />
					<SidebarContent handleSidebarToggle={handleSidebarToggle} />
				</div>
				<div
					className="fixed z-40 w-screen h-screen bg-neutral-700 opacity-50 "
					onClick={() => handleSidebarToggle(false)}
				/>
			</>
		)
	);
}

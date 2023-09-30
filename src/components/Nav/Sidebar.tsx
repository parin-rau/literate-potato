import SidebarButton from "./SidebarButton";

export default function Sidebar() {
	return (
		<div className="fixed z-10 top-0 left-0 h-screen w-32 m-0 p-2 pt-16 flex flex-col gap-2 dark:bg-neutral-900 bg-slate-100 border-r dark:border-r-neutral-800 border-r-slate-200">
			<SidebarButton to={"/group"} text="Groups" />
			<SidebarButton to={"/"} text="Projects" />
			<SidebarButton to={"/tasks"} text="Tasks" />
			<SidebarButton to={"/profile"} text="Profile" />
		</div>
	);
}

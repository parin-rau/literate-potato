import SidebarButton from "./SidebarButton";

export default function Sidebar() {
	return (
		<div className="fixed z-10 top-0 left-0 h-screen w-32 m-0 p-2 pt-16 flex flex-col gap-2 dark:bg-zinc-900">
			<SidebarButton to={"/group"} text="Groups" />
			<SidebarButton to={"/"} text="Projects" />
			<SidebarButton to={"/todo"} text="To-Do" />
			<SidebarButton to={"/profile"} text="Profile" />
		</div>
	);
}

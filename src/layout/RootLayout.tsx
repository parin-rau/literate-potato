import { Outlet } from "react-router-dom";
import NavBar from "../components/Nav/NavBar";

export default function RootLayout() {
	return (
		<div className="dark:bg-stone-950 dark:text-zinc-100 duration-200 min-h-screen">
			<NavBar />
			<Outlet />
		</div>
	);
}

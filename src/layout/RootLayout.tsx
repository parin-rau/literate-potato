import { Outlet } from "react-router-dom";
import NavBar from "../components/Nav/NavBar";
import Sidebar from "../components/Nav/Sidebar";

export default function RootLayout() {
	return (
		<>
			<NavBar />
			<div className="grid sm:grid-cols-[128px_auto]">
				<Sidebar />
				<div className="hidden sm:block" />
				<Outlet />
			</div>
		</>
	);
}

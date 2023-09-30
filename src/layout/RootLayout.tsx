import { Outlet } from "react-router-dom";
import NavBar from "../components/Nav/NavBar";
import Sidebar from "../components/Nav/Sidebar";
// import { AuthProvider } from "../contexts/AuthContext";
// import PersistLogin from "../components/Auth/PersistLogin";

export default function RootLayout() {
	return (
		// <AuthProvider>
		// 	<PersistLogin>
		// <div className="dark:bg-stone-950 dark:text-zinc-100 duration-200 min-h-screen">
		<>
			<NavBar />
			<div className="grid grid-cols-[128px_auto]">
				<Sidebar />
				<div />
				<Outlet />
			</div>
		</>
		//</div>
		// 	</PersistLogin>
		// </AuthProvider>
	);
}

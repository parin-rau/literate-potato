import { Outlet } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import PersistLogin from "../components/Auth/PersistLogin";

export default function AuthLayer() {
	return (
		<AuthProvider>
			<PersistLogin>
				<div className="dark:bg-stone-950 dark:text-zinc-100 duration-200 min-h-screen">
					<Outlet />
				</div>
			</PersistLogin>
		</AuthProvider>
	);
}

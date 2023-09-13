import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NavBar from "../components/Nav/NavBar";
import { useAuth } from "../hooks/useAuth";

export default function RootLayout() {
	const { user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) navigate("/login");
	}, [user, navigate]);

	return (
		<div className="dark:bg-stone-950 dark:text-zinc-100 duration-200 min-h-screen">
			<NavBar />
			<Outlet />
		</div>
	);
}

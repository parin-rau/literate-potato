import { Link, useNavigate } from "react-router-dom";

export default function SignInButton() {
	const navigate = useNavigate();
	const isLoggedIn = true;

	async function logout() {
		const res = await fetch("/auth/logout");
		const resMsg = await res.json();
		console.log(resMsg.message);
		navigate("/login");
	}

	return !isLoggedIn ? (
		<Link
			to={"/login"}
			className="duration-200 text-md text-white font-bold bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 py-2 px-4 rounded-lg "
		>
			Sign In
		</Link>
	) : (
		<button
			className="duration-200 text-md text-white font-bold bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 py-2 px-4 rounded-lg "
			onClick={logout}
		>
			Sign Out
		</button>
	);
}

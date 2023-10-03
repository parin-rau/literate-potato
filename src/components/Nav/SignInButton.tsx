import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function SignInButton() {
	const { user, signOut } = useAuth();

	return !user.current ? (
		<Link
			to={"/login"}
			className="duration-200 text-md text-white font-bold bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 py-2 px-4 rounded-lg whitespace-nowrap"
		>
			Sign In
		</Link>
	) : (
		<button
			className="duration-200 text-md text-white font-bold bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 py-2 px-4 rounded-lg whitespace-nowrap"
			onClick={signOut}
		>
			Sign Out
		</button>
	);
}

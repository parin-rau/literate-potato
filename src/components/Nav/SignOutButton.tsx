import { useAuth } from "../../hooks/utility/useAuth";

export default function SignOutButton() {
	const { signOut } = useAuth();

	return (
		<button
			className="px-4 py-2 text-lg text-left rounded-md hover:bg-slate-300 dark:hover:bg-neutral-700"
			onClick={signOut}
			type="button"
		>
			Sign Out
		</button>
	);
}

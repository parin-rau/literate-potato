import { Link } from "react-router-dom";
import { useProtectedFetch } from "../../hooks/useProtectedFetch";

export default function UncategorizedProjectsCard() {
	// useEffect(() => {
	// 	async function fetchData() {
	// 		try {
	// 			const res = await fetch("/api/ticket/project/uncategorized", {
	// 				headers: { "Content-Type": "application/json" },
	// 			});
	// 			const parsedData = await res.json();
	// 			if (res.ok) {
	// 				setData(parsedData.length > 0);
	// 			}
	// 		} catch (e) {
	// 			console.error(e);
	// 		}
	// 	}
	// 	fetchData();
	// }, []);

	const { isLoading } = useProtectedFetch(
		"/api/ticket/project/uncategorized"
	);

	//if ((res as Response).ok) setData(true);

	return (
		!isLoading && (
			<Link
				className="m-1 border-black border-2 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-600 hover:bg-slate-50 dark:hover:border-zinc-400"
				to={`project/uncategorized`}
			>
				<div className="flex flex-col px-4 py-2 space-y-1 dark:border-neutral-700">
					<h2 className="font-semibold text-xl sm:text-2xl ">
						Uncategorized Tasks
					</h2>
				</div>
			</Link>
		)
	);
}

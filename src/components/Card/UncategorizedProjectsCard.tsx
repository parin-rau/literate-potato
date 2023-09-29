import { Link } from "react-router-dom";
import { useInitialFetch } from "../../hooks/useInitialFetch";
import { useEffect } from "react";

type Props = {
	setCardsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UncategorizedProjectsCard(props: Props) {
	const { setCardsLoading } = props;
	const { isLoading, ok } = useInitialFetch(
		"/api/ticket/project/uncategorized"
	);

	useEffect(() => {
		if (setCardsLoading) isLoading ? null : setCardsLoading(false);
	}, [isLoading, setCardsLoading]);

	return (
		!isLoading &&
		ok && (
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

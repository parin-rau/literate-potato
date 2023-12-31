import { Link, useParams } from "react-router-dom";
import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
import { useEffect } from "react";
import { FetchedTicketData } from "../../types";
import { countTotalSubs } from "../../utility/countSubtasks";
import { useAuth } from "../../hooks/auth/useAuth";

type Props = {
	setCardsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function UncategorizedProjectsCard(props: Props) {
	const { setCardsLoading } = props;
	const { user } = useAuth();
	const { id: groupId } = useParams();
	const url = groupId
		? `/api/ticket/uncategorized/group/${groupId}`
		: `/api/ticket/uncategorized/user/${user.current!.userId}`;
	const {
		data: uncategorizedTasks,
		isLoading,
		ok,
	} = useInitialFetch<FetchedTicketData[]>(url);

	useEffect(() => {
		if (setCardsLoading) isLoading ? null : setCardsLoading(false);
	}, [isLoading, setCardsLoading]);

	return (
		!isLoading &&
		ok &&
		uncategorizedTasks.length > 0 && (
			<Link
				className="m-1 border-black border-2 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-600 hover:bg-slate-50 dark:hover:border-zinc-400"
				to={`/project/uncategorized`}
			>
				<div className="flex flex-col px-4 py-2 space-y-1 dark:border-neutral-700">
					<h2 className="font-semibold text-xl sm:text-2xl ">
						Uncategorized Tasks
					</h2>
					<p>{uncategorizedTasks.length} Tasks</p>
					<p>{countTotalSubs(uncategorizedTasks)} Subtasks</p>
				</div>
			</Link>
		)
	);
}

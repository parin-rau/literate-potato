import { useState, useEffect } from "react";
import CalendarContainer from "../../components/Calendar/CalendarContainer";
import CardContainer from "../../components/Card/CardContainer";
import { usePageTitle } from "../../hooks/utility/usePageTitle";
import {
	LoadingSkeletonCalendar,
	LoadingSkeletonCard,
} from "../../components/Nav/Loading";
import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
import { useAuth } from "../../hooks/auth/useAuth";
import { User } from "../../types";
import UnjoinedNotice from "../../components/Card/UnjoinedNotice";

export default function TicketHomePage() {
	usePageTitle("Tasks Home");
	const { user } = useAuth();

	const [cardsLoading, setCardsLoading] = useState(true);
	const [joinedGroups, setJoinedGroups] = useState(true);
	const { data: foundUser, isLoading: userLoading } = useInitialFetch<User>(
		`/api/user/${user.current?.userId}`
	);

	useEffect(() => {
		const setFalse = () => {
			setJoinedGroups(false);
			setCardsLoading(false);
		};
		if (!userLoading && foundUser.groupIds.length === 0 && joinedGroups)
			setFalse();
	}, [foundUser, joinedGroups, userLoading]);

	return (
		<div className="pt-20 flex flex-col gap-4 px-2">
			<div className="sm:container sm:mx-auto flex flex-col gap-6">
				<h1 className="px-4 font-bold text-4xl">Tasks Home</h1>
				{!userLoading && joinedGroups ? (
					<>
						<CardContainer
							{...{
								containerTitle: "Tasks",
								dataKind: "ticket",
								setCardsLoading,
								hideEditor: true,
							}}
						/>

						{cardsLoading ? (
							<LoadingSkeletonCalendar />
						) : (
							<CalendarContainer headerText="All Tasks" />
						)}
					</>
				) : cardsLoading ? (
					<div className="grid grid-cols-2 gap-4">
						<LoadingSkeletonCard />
						<LoadingSkeletonCard />
					</div>
				) : (
					<UnjoinedNotice resource="task" />
				)}
			</div>
		</div>
	);
}

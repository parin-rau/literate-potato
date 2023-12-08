import { useState, useEffect } from "react";
import CalendarContainer from "../../components/Calendar/CalendarContainer";
import CardContainer from "../../components/Card/CardContainer";
import {
	LoadingSkeletonCalendar,
	LoadingSkeletonCard,
} from "../../components/Nav/Loading";
import { usePageTitle } from "../../hooks/utility/usePageTitle";
import { useAuth } from "../../hooks/auth/useAuth";
import { User } from "../../types";
import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
import UnjoinedNotice from "../../components/Card/UnjoinedNotice";

export default function ProjectHomePage(props: {
	title: string;
	hideTitle?: boolean;
	group?: { groupId: string; groupTitle: string };
	children?: React.ReactNode;
	err?: { message?: string; hideButton?: boolean };
}) {
	usePageTitle(props.title);
	const { user } = useAuth();

	const [cardsLoading, setCardsLoading] = useState(true);
	const [joinedGroups, setJoinedGroups] = useState(true);
	const { data: foundUser, isLoading: userLoading } = useInitialFetch<User>(
		`/api/user/${user.current?.userId}`
	);

	const cardContainerStyles = "dark:bg-neutral-900";

	useEffect(() => {
		const setFalse = () => {
			setJoinedGroups(false);
			setCardsLoading(false);
		};
		if (!userLoading && foundUser.groupIds.length === 0 && joinedGroups)
			setFalse();
	}, [foundUser, joinedGroups, userLoading]);

	return (
		<div className="flex flex-col gap-4 pt-20 px-2">
			<div className="sm:container sm:mx-auto flex flex-col gap-6">
				{!props.hideTitle && (
					<h1 className="font-bold text-4xl">{props.title}</h1>
				)}
				{props.children}
				{!userLoading && joinedGroups ? (
					<div className="flex flex-col container gap-4">
						<CardContainer
							containerTitle="Projects"
							dataKind="project"
							styles={cardContainerStyles}
							setCardsLoading={setCardsLoading}
							group={props.group}
						/>

						{cardsLoading ? (
							<LoadingSkeletonCalendar />
						) : (
							<CalendarContainer headerText="All Projects" />
						)}
					</div>
				) : cardsLoading ? (
					<div className="grid grid-cols-2 gap-4">
						<LoadingSkeletonCard />
						<LoadingSkeletonCard />
					</div>
				) : props.err ? (
					<UnjoinedNotice {...{ ...props.err }} />
				) : (
					<UnjoinedNotice resource="project" />
				)}
			</div>
		</div>
	);
}

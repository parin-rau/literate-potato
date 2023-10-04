import {
	LoadingSkeletonCalendar,
	LoadingSkeletonCardGrid,
} from "../../components/Nav/Loading";
import { usePageTitle } from "../../hooks/usePageTitle";

type Props = { title: string };

export default function HomePage(props: Props) {
	usePageTitle(props.title);

	return (
		<div className="grid h-screen place-items-center">
			<p>Home Page</p>
			<LoadingSkeletonCardGrid />
			<LoadingSkeletonCalendar />
		</div>
	);
}

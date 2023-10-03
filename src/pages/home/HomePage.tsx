import {
	LoadingSkeletonCalendar,
	LoadingSkeletonCardGrid,
} from "../../components/Nav/Loading";

export default function HomePage() {
	return (
		<div className="grid h-screen place-items-center">
			<p>Home Page</p>
			<LoadingSkeletonCardGrid />
			<LoadingSkeletonCalendar />
		</div>
	);
}

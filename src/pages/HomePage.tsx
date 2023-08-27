import CardContainer from "../components/Wrapper/CardContainer";

export default function HomePage() {
	const cardContainerStyles = "dark:bg-neutral-900";

	// useEffect(() => {
	// 	async function getCompletion() {
	// 		try {
	// 			const res = await fetch("", {
	// 				headers: { "Content-Type": "appliction/json" },
	// 			});
	// 		} catch (e) {
	// 			console.error(e);
	// 		}
	// 	}
	// 	getCompletion();
	// }, []);

	// useEffect(() => {
	// 	async function get() {

	// 	}
	// }, [])

	return (
		<div className="flex flex-col space-y-4 pt-20 px-2">
			<div className="sm:container sm:mx-auto flex flex-col space-y-6">
				<h1 className="text-bold text-4xl">Projects Home</h1>
				<div className="flex flex-col sm:grid grid-cols-1 lg:grid-cols-2 container sm:place-items-start gap-4">
					<CardContainer
						containerTitle="Projects"
						dataKind="project"
						styles={cardContainerStyles}
					/>
					<CardContainer
						containerTitle="Upcoming Tasks"
						dataKind="ticket"
						styles={cardContainerStyles}
					/>
				</div>
			</div>
		</div>
	);
}

type Props = { arrowDirection: "up" | "down" };

export default function DirectionalArrow(props: Props) {
	const { arrowDirection } = props;

	return (
		<>
			{arrowDirection === "down" ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75"
					/>
				</svg>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={1.5}
					stroke="currentColor"
					className="w-6 h-6"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75"
					/>
				</svg>
			)}
		</>
	);
}

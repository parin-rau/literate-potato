import countDisplay from "../../utility/countDisplay";

interface Props {
	isSelected: boolean;
	fn: () => void;
	count: number;
}

const styles = (isSelected: boolean) => {
	const baseStyles = "p-2 rounded-md flex flex-row gap-2";

	if (!isSelected) return baseStyles;

	return `${baseStyles} dark:bg-neutral-700 bg-slate-200`;
};

export function ThumbUp({ isSelected, fn, count }: Props) {
	const className = styles(isSelected);

	return (
		<button className={className} type="button" onClick={fn}>
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
					d="M4.5 15.75l7.5-7.5 7.5 7.5"
				/>
			</svg>
			<span>{countDisplay(count)}</span>
		</button>
	);
}

export function ThumbDown({ isSelected, fn, count }: Props) {
	const className = styles(isSelected);

	return (
		<button className={className} type="button" onClick={fn}>
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
					d="M19.5 8.25l-7.5 7.5-7.5-7.5"
				/>
			</svg>
			<span>{countDisplay(count)}</span>
		</button>
	);
}

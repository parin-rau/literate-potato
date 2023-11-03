type Props = {
	count: number;
	text: string;
	className?: string;
	pluralNonS?: string;
	showZero?: boolean;
	onClick?: () => void;
};

export default function CountLabel({
	count,
	text,
	className,
	pluralNonS,
	showZero,
	onClick,
}: Props) {
	const labelText = `${count} ${text}${
		count !== 1 ? (pluralNonS ? pluralNonS : "s") : ""
	}`;

	return (
		(count > 0 || showZero) &&
		(onClick ? (
			<button
				className={className + " w-fit hover:underline"}
				onClick={onClick}
			>
				{labelText}
			</button>
		) : (
			<p className={className}>{labelText}</p>
		))
	);
}

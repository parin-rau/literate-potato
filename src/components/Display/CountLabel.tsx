type Props = {
	count: number;
	text: string;
	className?: string;
	pluralNonS?: string;
	showZero?: boolean;
};

export default function CountLabel({
	count,
	text,
	className,
	pluralNonS,
	showZero,
}: Props) {
	return (
		(count > 0 || showZero) && (
			<p className={className}>{`${count} ${text}${
				count !== 1 ? (pluralNonS ? pluralNonS : "s") : ""
			}`}</p>
		)
	);
}

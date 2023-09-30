type Props = {
	name: string; // name and value for Select parent component
	value: string;
	options: {
		label: string;
		value: string;
		sortValue?: number;
		bgColor?: string;
		textColor?: string;
	}[];
	handleChange: (_e: React.ChangeEvent<HTMLSelectElement>) => void;
	stylesOverride?: string;
	required?: true;
};

export default function SelectDropdown(props: Props) {
	const { name, value, options, handleChange, stylesOverride, required } =
		props;

	return (
		<select
			name={name}
			className={
				"text-base max-w-xs px-2 py-1 rounded-lg " + stylesOverride
			}
			value={value}
			onChange={handleChange}
			required={required}
		>
			{options.map((option, index) => (
				<option
					key={index}
					value={option.value}
					className="bg-inherit text-inherit"
				>
					{option.label}
				</option>
			))}
		</select>
	);
}

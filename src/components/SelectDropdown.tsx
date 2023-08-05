type SelectOptions = {
	name: string;
	value: string;
	options: {
		label: string;
		value: string;
	}[];
	handleChange: (_e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SelectDropdown({
	name,
	value,
	options,
	handleChange,
}: SelectOptions) {
	return (
		<select
			name={name}
			className="text-lg max-w-xs"
			value={value}
			onChange={(e) => handleChange(e)}
		>
			{options.map((option, index) => (
				<option key={index} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
}

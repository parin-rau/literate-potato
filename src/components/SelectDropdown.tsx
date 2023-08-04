type SelectOptions = {
	name: string;
	options: {
		label: string;
		value: string;
	}[];
	handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SelectDropdown({
	name,
	options,
	handleChange,
}: SelectOptions) {
	return (
		<select
			name={name}
			className="text-lg max-w-xs"
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

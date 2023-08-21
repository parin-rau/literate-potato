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
	colors?: string;
};

export default function SelectDropdown(props: Props) {
	const { name, value, options, handleChange, colors } = props;

	return (
		<div>
			<select
				name={name}
				className={"text-lg max-w-xs px-2 py-1 rounded-lg " + colors}
				value={value}
				onChange={(e) => {
					handleChange(e);
				}}
			>
				{options.map((option, index) => (
					<option
						key={index}
						value={option.value}
						className="bg-slate-100 text-black"
					>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}

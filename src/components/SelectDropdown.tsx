type Props = {
	name: string; // Overall name and value for Select parent component
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
	const lookupByValue = options.find((option) => option.value === value);
	// const [colors, setColors] = useState(
	// 	lookupByValue
	// 		? `${lookupByValue.bgColor} ${lookupByValue.textColor}`
	// 		: "bg-slate-100 text-black"
	// );

	return (
		<div>
			<button
				type="button"
				onClick={() =>
					console.log(
						"value",
						value,
						"lookup",
						lookupByValue?.bgColor,
						lookupByValue?.textColor
					)
				}
			>
				log
			</button>
			<select
				name={name}
				className={"text-lg max-w-xs px-2 py-1 rounded-md " + colors}
				value={value}
				onChange={(e) => {
					handleChange(e);
					// setColors(
					// 	lookupByValue
					// 		? `${lookupByValue.bgColor} ${lookupByValue.textColor}`
					// 		: "bg-slate-100 text-black"
					// );
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

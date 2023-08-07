import { useState } from "react";

type Props = {
	name: string;
	value: string | number;
	options: {
		label: string;
		value: string | number;
		bgColor?: string;
		textColor?: string;
	}[];
	handleChange: (_e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SelectDropdown(props: Props) {
	const { name, value, options, handleChange } = props;
	const lookupByValue = options.find((option) => option.value === value);
	const [colors, setColors] = useState(
		lookupByValue
			? `${lookupByValue.bgColor} ${lookupByValue.textColor}`
			: "bg-slate-100 text-black"
	);

	return (
		<select
			name={name}
			className={"text-lg max-w-xs px-2 py-1 rounded-md " + colors}
			value={value}
			onChange={(e) => {
				handleChange(e);
				setColors(
					lookupByValue
						? `${lookupByValue.bgColor} ${lookupByValue.textColor}`
						: "bg-slate-100 text-black"
				);
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
	);
}

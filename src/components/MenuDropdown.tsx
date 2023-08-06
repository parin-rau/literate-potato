import { useState } from "react";

type Props = {
	options: { name: string; function: () => void }[];
};

export default function MenuDropdown(props: Props) {
	const [isMenu, setMenu] = useState(false);
	const { options } = props;

	return (
		<div
			className="relative"
			onBlur={() => setMenu(false)}
			onFocus={() => setMenu(true)}
		>
			<button
				className="hover:bg-slate-300 px-2 py-1 my-1 rounded-full"
				onClick={() => setMenu(true)}
			>
				⋯
			</button>
			{isMenu && (
				<div className="absolute right-0 bg-slate-100 px-1 py-1 rounded-md">
					{options.map((option, index: number) => (
						<div
							className="hover:cursor-pointer hover:bg-slate-300 px-3 rounded-full"
							key={index}
							onClick={() => {
								option.function();
								setMenu(false);
							}}
						>
							<span>{option.name}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

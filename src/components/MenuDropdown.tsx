import { useRef, useState, useEffect } from "react";
import DirectionalArrow from "./DirectionalArrow";

type Props =
	| {
			options: {
				name: string;
				arrowDirection: "up" | "down";
				fn: () => void;
			}[];
			cardId?: never;
			menuTitle?: string;
			menuTitleFont?: string;
	  }
	| {
			options: {
				name: string;
				arrowDirection?: never;
				fn: (_id: string) => void;
			}[];
			cardId: string;
			menuTitle?: string;
			menuTitleFont?: string;
	  };

export default function MenuDropdown(props: Props) {
	const { options, cardId, menuTitle, menuTitleFont } = props;
	const [isMenu, setMenu] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const closeOpenMenu = (
			e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent
		) => {
			if (
				menuRef.current &&
				isMenu &&
				!menuRef.current.contains(e.target as Node)
			) {
				setMenu(false);
			}
		};
		document.addEventListener("mousedown", closeOpenMenu);
	}, [isMenu]);

	function handleOptionClick(optionFn: (_id: string) => void) {
		optionFn(cardId!);
		setMenu(false);
	}

	return (
		<div className="relative" ref={menuRef}>
			<button
				className={
					"hover:bg-slate-300 px-2 py-1 my-1 rounded-full " +
					menuTitleFont
				}
				onClick={() => setMenu(!isMenu)}
			>
				{menuTitle ? (
					menuTitle
				) : (
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
							d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
						/>
					</svg>
				)}
			</button>
			{isMenu && (
				<div className="absolute right-0 bg-slate-200 px-1 py-1 rounded-md z-10 border-black border">
					{options.map((option, index: number) => (
						<div
							className="hover:cursor-pointer hover:bg-slate-300 px-3 rounded-full flex flex-row space-x-2 py-1"
							key={index}
							onClick={() => handleOptionClick(option.fn)}
							// onClick={() => {
							// 	cardId
							// 		? option.function(cardId)
							// 		: option.function();
							// 	setMenu(false);
							// }}
						>
							<span>{option.name}</span>
							{option.arrowDirection && (
								<DirectionalArrow
									arrowDirection={option.arrowDirection}
								/>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

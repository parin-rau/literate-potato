import { useRef, useState, useEffect } from "react";
import Modal from "./Modal";
import {
	FetchedTicketData,
	Project,
	GenericFn,
	GenericAsyncFn,
} from "../../types";

// type OptFn =
// 	| { id: string; arr?: never }
// 	| { id?: never; arr: FetchedTicketData[] | Project[] };
//type OptFn<T> = (_arg: T) => void
//type FnArgs = FetchedTicketData[] | Project[] | string

type Props =
	| {
			options: {
				label: string;
				fn: GenericFn | GenericAsyncFn<void>;
			}[];
			cardId?: never;
			menuTitle?: string;
			menuTitleFont?: string;
			cards?: FetchedTicketData[] | Project[];
	  }
	| {
			options: {
				label: string;
				fn: GenericFn | GenericAsyncFn<void>;
			}[];
			cardId: string;
			menuTitle?: string;
			menuTitleFont?: string;
			cards?: never;
	  };

export default function MenuDropdown(props: Props) {
	const { options, cardId, menuTitle, menuTitleFont, cards } = props;
	const [isMenu, setMenu] = useState(false);
	const [isModal, setModal] = useState(false);
	const [modalCallback, setModalCallback] = useState<(_id: string) => void>();
	const menuRef = useRef<HTMLDivElement>(null);

	function handleOpen(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		e.preventDefault();
		e.stopPropagation();
		setMenu((prev) => !prev);
	}

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

		return () => document.removeEventListener("mousedown", closeOpenMenu);
	}, [isMenu]);

	// const optFn = ({id, arr}: OptFn, optionFn: (_: any) => void) => {
	// 	if (id) return optionFn(id)
	// 	else if (arr) return optionFn(arr)
	// }

	function handleOptionClick(
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		optionName: string,
		optionFn: GenericFn //((_id: string) => void) | ((_arr: SortableObj[] | FetchedTicketData[] | Project[]) => void)
	) {
		e.preventDefault();
		e.stopPropagation();

		if (optionName === "Delete") {
			setModal(true);
			setModalCallback(() => () => optionFn(cardId!));
		} else {
			cards ? optionFn(cards) : optionFn(cardId);
			setMenu(false);
		}
	}

	return (
		<div className="relative z-50" ref={menuRef}>
			<Modal
				{...{ isModal, setModal, modalCallback, cardId }}
				text="Are you sure you want to delete this item?"
				submitText="Delete"
			/>
			<button
				className={
					"z-20 hover:bg-slate-300 dark:hover:bg-zinc-700 px-2 py-1 my-1 rounded-full " +
					menuTitleFont
				}
				onClick={handleOpen}
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
				<div
					className={
						"absolute right-0 bg-slate-200 dark:bg-neutral-800 px-1 py-1 rounded-md border-black border dark:border-none z-50 "
					}
				>
					{options.map((option, index: number) => (
						<div
							className="hover:cursor-pointer hover:bg-slate-300 dark:hover:bg-zinc-700 px-3 rounded-full flex flex-row space-x-2 py-1 justify-stretch w-max"
							key={index}
							onClick={(e) =>
								handleOptionClick(e, option.label, option.fn)
							}
						>
							<span>{option.label}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

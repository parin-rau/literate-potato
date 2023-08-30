import { useRef, useState, useEffect } from "react";
// import DirectionalArrow from "../Display/DirectionalArrow";
import Modal from "./Modal";

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
	const [isModal, setModal] = useState(false);
	const [modalCallback, setModalCallback] = useState<(_id: string) => void>();
	const menuRef = useRef<HTMLDivElement>(null);
	//const modalRef = useRef<HTMLDialogElement>(null);

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

	// useEffect(() => {
	// 	const closeOpenModal = (
	// 		e: React.MouseEvent<HTMLDialogElement, MouseEvent> | MouseEvent
	// 	) => {
	// 		if (
	// 			modalRef.current?.open &&
	// 			isModal &&
	// 			!modalRef.current.contains(e.target as Node)
	// 		) {
	// 			setModal(false);
	// 			modalRef.current.close();
	// 		}
	// 	};
	// 	document.addEventListener("mousedown", closeOpenModal);
	// }, [isModal]);

	// useEffect(() => {
	// 	if (modalRef.current?.open && !isModal) {
	// 		setModal(false);
	// 		modalRef.current.close();
	// 	} else if (!modalRef.current?.open && isModal) {
	// 		modalRef.current?.showModal();
	// 	}
	// }, [isModal]);

	function handleOptionClick(
		optionName: string,
		optionFn: (_id: string) => void
	) {
		if (optionName === "Delete") {
			setModal(true);
			setModalCallback(() => () => optionFn(cardId!));
		} else {
			optionFn(cardId!);
			setMenu(false);
		}
	}

	return (
		<div className="relative" ref={menuRef}>
			<Modal
				{...{ isModal, setModal, modalCallback, cardId }}
				text="Are you sure you want to delete this?"
				submitText="Delete"
			/>
			<button
				className={
					"hover:bg-slate-300 dark:hover:bg-zinc-700 px-2 py-1 my-1 rounded-full " +
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
				<div className="absolute right-0 bg-slate-200 dark:bg-neutral-800 px-1 py-1 rounded-md z-10 border-black border dark:border-none">
					{options.map((option, index: number) => (
						<div
							className="hover:cursor-pointer hover:bg-slate-300 dark:hover:bg-zinc-700 px-3 rounded-full flex flex-row space-x-2 py-1 justify-stretch w-max"
							key={index}
							onClick={() =>
								handleOptionClick(option.name, option.fn)
							}
						>
							<span>{option.name}</span>
							{/* {option.arrowDirection && (
								<DirectionalArrow
									arrowDirection={option.arrowDirection}
								/>
							)} */}
						</div>
					))}
					<button onClick={() => setModal(true)}>gao</button>
				</div>
			)}
			{/* <dialog ref={modalRef}>
				<form>
					<p>HIYA</p>
					<button type="submit">Close</button>
				</form>
			</dialog> */}
		</div>
	);
}

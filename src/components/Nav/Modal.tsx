import { useEffect, useRef } from "react";

type Props = {
	isModal: boolean;
	setModal: React.Dispatch<React.SetStateAction<boolean>>;
	//modalRef: React.RefObject<HTMLDialogElement>;
	text: string;
	submitText: string;
	modalCallback?: (_id: string) => void;
	cardId?: string;
};

export default function Modal(props: Props) {
	const { text, submitText, isModal, setModal, modalCallback, cardId } =
		props;
	const ref = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (isModal) {
			ref.current?.showModal();
		} else {
			ref.current?.close();
		}
	}, [isModal]);

	useEffect(() => {
		function closeOpenModal(
			e: React.MouseEvent<HTMLDialogElement, MouseEvent> | MouseEvent
		) {
			if (
				ref.current?.open &&
				isModal &&
				!ref.current.contains(e.target as Node)
			) {
				setModal(false);
			}
		}
		document.addEventListener("mousedown", closeOpenModal);
	}, [isModal, setModal]);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (modalCallback && cardId) {
			modalCallback(cardId);
		}
		setModal(false);
		ref.current?.close();
	}

	function handleCancel(e: React.FormEvent) {
		e.preventDefault();
		setModal(false);
	}

	return (
		<dialog ref={ref} className="bg-transparent" onCancel={handleCancel}>
			<form
				className="flex flex-col z-20 px-10 py-6 shadow-md font-semibold border-2 border-black dark:border-zinc-500 bg-slate-100 dark:bg-zinc-800 dark:text-white rounded-lg items-center justify-center space-y-4"
				onSubmit={handleSubmit}
			>
				<h1>{text}</h1>
				<div className="flex flex-row space-x-4 ">
					<button
						className="py-2 px-4 bg-slate-300 hover:bg-slate-400 dark:bg-zinc-600 dark:hover:bg-zinc-700 rounded-md"
						type="button"
						onClick={handleCancel}
					>
						Cancel
					</button>
					<button
						className="py-2 px-4 bg-red-500 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-800 rounded-md text-white"
						type="submit"
					>
						{submitText}
					</button>
				</div>
			</form>
		</dialog>
	);
}

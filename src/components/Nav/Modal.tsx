import { useEffect, useRef } from "react";

type Props = {
	isModal: boolean;
	setModal: React.Dispatch<React.SetStateAction<boolean>>;
	text: string;
	submitText: string;
	modalCallback?: (_id: string) => void;
	cardId?: string;
};

export default function Modal(props: Props) {
	const { text, submitText, isModal, setModal, modalCallback, cardId } =
		props;
	const modalRef = useRef<HTMLDialogElement>(null);
	const formRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (isModal) {
			modalRef.current?.showModal();
		} else {
			modalRef.current?.close();
		}
	}, [isModal, setModal]);

	useEffect(() => {
		function closeOpenModal(
			e: React.MouseEvent<HTMLDialogElement, MouseEvent> | MouseEvent
		) {
			if (
				formRef.current &&
				isModal &&
				!formRef.current.contains(e.target as Node)
			) {
				setModal(false);
			}
		}
		document.addEventListener("mousedown", closeOpenModal);

		return () => document.removeEventListener("mousedown", closeOpenModal);
	}, [isModal, setModal]);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		e.stopPropagation();
		if (modalCallback && cardId) {
			modalCallback(cardId);
		}
		setModal(false);
		modalRef.current?.close();
	}

	function handleCancel(e: React.FormEvent) {
		e.preventDefault();
		setModal(false);
	}

	return (
		<dialog
			ref={modalRef}
			className="bg-transparent"
			onCancel={handleCancel}
		>
			<form
				className="flex flex-col z-20 px-8 py-6 shadow-md font-semibold border-2 border-black dark:border-zinc-500 bg-slate-100 dark:bg-zinc-800 dark:text-white rounded-lg items-center justify-center space-y-4"
				ref={formRef}
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

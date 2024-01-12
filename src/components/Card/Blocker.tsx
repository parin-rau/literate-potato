import { ReactNode, useState } from "react";

type Props = {
	children: ReactNode;
	text: string;
};

type BProps = {
	text: string;
	setTriggered: React.Dispatch<React.SetStateAction<boolean>>;
};

function Btn({ text, setTriggered }: BProps) {
	const onClick = () => setTriggered(true);

	return (
		<button
			className="font-semibold text-lg bg-slate-100 dark:bg-neutral-900 hover:bg-slate-300 dark:hover:bg-neutral-700 p-4 rounded-lg"
			type="button"
			onClick={onClick}
		>
			{text}
		</button>
	);
}

export default function Blocker({ text, children }: Props) {
	const [isTriggered, setTriggered] = useState(false);

	return isTriggered ? children : <Btn {...{ text, setTriggered }} />;
}

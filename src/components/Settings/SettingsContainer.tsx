import { useState } from "react";
import UsernameForm from "./UsernameForm";
import PasswordForm from "./PasswordForm";

const isOpenInit = {
	usernameForm: false,
	passwordForm: false,
};

// interface MessageProps {
// 	text: string;
// }

// const Message = ({ text }: MessageProps) => {
// 	return (
// 		<div className="p-2 flex flex-col gap-4 bg-green-700">
// 			<h3>Notice</h3>
// 			<span>{text}</span>
// 		</div>
// 	);
// };

export default function SettingsContainer() {
	const [isOpen, setOpen] = useState(isOpenInit);
	// const [message, setMessage] = useState("");

	const handleClose = (key?: string) => {
		if (!key) return setOpen(isOpenInit);

		setOpen((prev) => ({ ...prev, [key]: false }));
	};

	const handleUserOpen = () =>
		setOpen({ usernameForm: true, passwordForm: false });

	const handlePassOpen = () =>
		setOpen({ usernameForm: false, passwordForm: true });

	return (
		<div className="flex flex-col gap-4">
			{/* {message && <Message text={message} />} */}
			<h1 className="font-bold text-3xl">Settings</h1>
			<div className="flex flex-col rounded-lg border-2 border-black dark:border-zinc-600">
				<UsernameForm
					isOpen={isOpen.usernameForm}
					handleOpen={handleUserOpen}
					handleClose={handleClose}
					// setMessage={setMessage}
				/>
				<PasswordForm
					isOpen={isOpen.passwordForm}
					handleOpen={handlePassOpen}
					handleClose={handleClose}
					//setMessage={setMessage}
				/>
			</div>
		</div>
	);
}

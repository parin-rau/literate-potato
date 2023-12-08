import { useState } from "react";
import UsernameForm from "./UsernameForm";
import PasswordForm from "./PasswordForm";
import CollapseToggle from "../Nav/CollapseToggle";
import { Link } from "react-router-dom";

const isOpenInit = {
	usernameForm: false,
	passwordForm: false,
};

export default function SettingsContainer() {
	const [isOpen, setOpen] = useState(isOpenInit);

	const handleClose = (key?: string) => {
		if (!key) return setOpen(isOpenInit);

		setOpen((prev) => ({ ...prev, [key]: false }));
	};

	const handleUserOpen = () =>
		setOpen((prev) => ({
			usernameForm: !prev.usernameForm,
			passwordForm: false,
		}));

	const handlePassOpen = () =>
		setOpen((prev) => ({
			usernameForm: false,
			passwordForm: !prev.passwordForm,
		}));

	return (
		<div className="flex flex-col gap-4">
			<h1 className="font-bold text-3xl">Settings</h1>
			<div className="p-2 flex flex-col rounded-lg bg-slate-100 dark:bg-neutral-900 border-2 border-black dark:border-zinc-600">
				<CollapseToggle
					text="Change Username"
					isOpen={isOpen.usernameForm}
					setOpen={handleUserOpen}
				/>
				<UsernameForm
					isOpen={isOpen.usernameForm}
					handleClose={handleClose}
				/>
				<CollapseToggle
					text="Change Password"
					isOpen={isOpen.passwordForm}
					setOpen={handlePassOpen}
				/>
				<PasswordForm
					isOpen={isOpen.passwordForm}
					handleClose={handleClose}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Link to={"/ticket/a83581ae-1436-46c2-a6b6-cab5998dba50"}>
					Test unauthorized ticket
				</Link>
				<Link to={"/project/f15e7cef-81d5-48e3-ad21-bdff18710aef"}>
					Test unauthorized project
				</Link>
			</div>
		</div>
	);
}

import { useState } from "react";
import PasswordInput from "../Form/PasswordInput";
import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";

interface Props {
	isOpen: boolean;
	handleOpen: () => void;
	handleClose: (_k?: string) => void;
	setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const initPasswordForm = {
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
};

export default function PasswordForm({
	isOpen,
	handleOpen,
	handleClose,
}: Props) {
	const [passwordForm, setPasswordForm] = useState(initPasswordForm);
	const { protectedFetch } = useProtectedFetch();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPasswordForm((prev) => ({ ...prev, [name]: value }));
	};

	const handleCancel = () => {
		setPasswordForm(initPasswordForm);
		handleClose("passwordForm");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const res = await protectedFetch(``, {
			method: "PATCH",
			body: JSON.stringify(passwordForm),
		});
		if (res.ok) {
			handleCancel();
		}
	};

	return (
		<div className="p-4">
			{!isOpen ? (
				<button
					className="font-semibold p-2 w-fit text-white rounded-md dark:bg-blue-700 dark:hover:bg-blue-600 bg-blue-600 hover:bg-blue-500"
					type="button"
					onClick={handleOpen}
				>
					Change Password
				</button>
			) : (
				<div className="flex flex-col p-2 gap-4 border-2 border-black dark:border-zinc-600 rounded-lg">
					<h2 className="font-semibold">Change Password</h2>
					<form
						className="flex flex-col gap-6 dark:border-zinc-600 border-slate-400"
						onSubmit={handleSubmit}
					>
						<PasswordInput
							{...{
								name: "currentPassword",
								value: passwordForm.currentPassword,
								handleChange,
								placeholder: "Current Password",
								passwordChangeForm: true,
							}}
						/>

						<div className="flex flex-col gap-2 dark:border-zinc-600 border-slate-400">
							<PasswordInput
								{...{
									name: "newPassword",
									value: passwordForm.newPassword,
									handleChange,
									placeholder: "New Password",
									passwordChangeForm: true,
								}}
							/>
							<PasswordInput
								{...{
									name: "currentPassword",
									value: passwordForm.confirmPassword,
									handleChange,
									placeholder: "Confirm New Password",
									passwordChangeForm: true,
								}}
							/>
						</div>
						<div className="flex flex-row gap-2">
							<button
								className="font-semibold px-3 py-1 w-fit text-white rounded-md dark:bg-blue-700 dark:hover:bg-blue-600 bg-blue-600 hover:bg-blue-500"
								type="submit"
							>
								Submit
							</button>
							<button
								className="font-semibold px-3 py-1 w-fit text-white rounded-md dark:bg-blue-700 dark:hover:bg-blue-600 bg-blue-600 hover:bg-blue-500"
								type="button"
								onClick={handleCancel}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

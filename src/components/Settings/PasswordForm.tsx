import { useState } from "react";
import PasswordInput from "../Form/PasswordInput";
import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";
import { useAuth } from "../../hooks/auth/useAuth";
import ErrorMsg from "../Display/ErrorMsg";
import Message from "../Display/Message";
import jwtDecode from "../../utility/jwtDecode";
import { UserDecode } from "../../types";

interface Props {
	isOpen: boolean;
	handleClose: (_k?: string) => void;
}

const initPasswordForm = {
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
};

export default function PasswordForm({ isOpen, handleClose }: Props) {
	const [passwordForm, setPasswordForm] = useState(initPasswordForm);
	const { protectedFetch, message, error, setMessage, setError } =
		useProtectedFetch();
	const { user, signOut } = useAuth();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPasswordForm((prev) => ({ ...prev, [name]: value }));
		setMessage("");
		setError("");
	};

	const handleCancel = () => {
		handleClose("passwordForm");
		setPasswordForm(initPasswordForm);
		setError("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const passwordMatch =
			passwordForm.newPassword === passwordForm.confirmPassword;
		if (!passwordMatch) return setError("New password fields must match");

		const submission = { ...passwordForm, userId: user.current!.userId };

		const res = await protectedFetch(
			`/auth/change-password`,
			{
				method: "PATCH",
				body: JSON.stringify(submission),
			},
			{ allow4xx: true, readMessage: true }
		);
		if (res.ok) {
			const { accessToken }: { accessToken: string } = await res.json();
			const decoded = jwtDecode<UserDecode>(accessToken);
			if (!decoded || typeof decoded === "string") return await signOut();

			console.log({ token: accessToken, ...decoded });
			user.current = { token: accessToken, ...decoded };

			handleCancel();
		}
	};

	return (
		<>
			{message && <Message msg={message} />}
			{error && <ErrorMsg msg={error} />}
			{isOpen && (
				<div
					className={
						"p-2 flex flex-col gap-4 " +
						(isOpen &&
							" m-4 border border-black dark:border-zinc-600 rounded-lg")
					}
				>
					<div className="flex flex-col p-2 gap-4 ">
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
										name: "confirmPassword",
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
				</div>
			)}
		</>
	);
}

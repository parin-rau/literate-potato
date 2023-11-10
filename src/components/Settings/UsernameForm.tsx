import { useState } from "react";
import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";
import { useAuth } from "../../hooks/auth/useAuth";
import Message from "../Display/Message";
import { UserDecode } from "../../types";
import jwtDecode from "../../utility/jwtDecode";
import ErrorMsg from "../Display/ErrorMsg";

interface Props {
	isOpen: boolean;
	handleClose: (_k?: string) => void;
}

export default function UsernameForm({ isOpen, handleClose }: Props) {
	const [usernameForm, setUsernameForm] = useState("");
	const { protectedFetch, message, error, setError, setMessage } =
		useProtectedFetch();
	const { user, signOut } = useAuth();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setUsernameForm(value);
		setMessage("");
		setError("");
	};

	const handleCancel = () => {
		handleClose("usernameForm");
		setUsernameForm("");
		setError("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (usernameForm === user.current!.username)
			return setError(
				`"${user.current!.username}" is already current username`
			);

		const submission = {
			username: usernameForm,
			userId: user.current!.userId,
		};

		const res = await protectedFetch(
			`/auth/change-username`,
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
					<div className="flex flex-col gap-4">
						<h2 className="font-semibold">Change Username</h2>
						<form
							className="flex flex-col gap-6"
							onSubmit={handleSubmit}
						>
							<input
								{...{
									className:
										"rounded px-2 py-1 bg-transparent border dark:border-zinc-600 border-slate-400",
									name: "newUsername",
									value: usernameForm,
									onChange: handleChange,
									placeholder: "New Username",
									required: true,
									size: 40,
									maxLength: 64,
								}}
							/>

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

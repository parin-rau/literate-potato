import { useState } from "react";
import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";
import { useAuth } from "../../hooks/auth/useAuth";

interface Props {
	isOpen: boolean;
	handleOpen: () => void;
	handleClose: (_k?: string) => void;
	setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function UsernameForm({
	isOpen,
	handleOpen,
	handleClose,
}: Props) {
	const [usernameForm, setUsernameForm] = useState("");
	const { protectedFetch } = useProtectedFetch();
	const { user } = useAuth();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setUsernameForm(value);
	};

	const handleCancel = () => {
		setUsernameForm("");
		handleClose("usernameForm");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const submission = {
			username: usernameForm,
			userId: user.current!.userId,
		};

		const res = await protectedFetch(`/auth/change-username`, {
			method: "PATCH",
			body: JSON.stringify(submission),
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
					Change Username
				</button>
			) : (
				<div className="flex flex-col p-2 gap-4 border-2 border-black dark:border-zinc-600 rounded-lg">
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
			)}
		</div>
	);
}

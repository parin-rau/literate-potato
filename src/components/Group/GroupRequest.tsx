import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";

type Props = {
	requestGroup: (_gId: string, _uId: string) => Promise<string | undefined>;
};

export default function GroupRequest({ requestGroup }: Props) {
	const { user } = useAuth();
	const [expand, setExpand] = useState(false);
	const [form, setForm] = useState("");
	const [message, setMessage] = useState("");

	const handleExpand = (newState?: boolean) => {
		setMessage("");
		if (!newState) return setExpand((prev) => !prev);

		setExpand(newState);
	};

	const handleCancel = () => {
		setExpand(false);
		setForm("");
		setMessage("");
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setForm(value);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const message = await requestGroup(form, user.current!.userId);

		setMessage(message ? message : `Request sent to join group "${form}"`);
		setForm("");
	};

	return (
		<div
			className={
				"flex flex-col gap-2 h-fit rounded-lg border-2 p-4 border-black dark:border-zinc-600 dark:bg-zinc-900 " +
				(expand
					? " "
					: " cursor-pointer dark:hover:border-zinc-400 hover:bg-slate-100")
			}
			onClick={() => !expand && setExpand(true)}
		>
			<div className="flex flex-row gap-2 justify-between">
				<h1
					className="z-10 font-semibold text-xl cursor-pointer"
					onClick={() => handleExpand()}
				>
					Request to join group by ID
				</h1>
			</div>
			{expand && (
				<form className="flex flex-col gap-2" onSubmit={handleSubmit}>
					<input
						className="rounded px-2 py-1 bg-transparent border border-neutral-700"
						name="groupId"
						onChange={handleChange}
						value={form}
						placeholder="Enter Group ID"
						required
					/>
					{message && (
						<div>
							<p>{message}</p>
						</div>
					)}
					<div className="self-end flex flex-row gap-2">
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
			)}
		</div>
	);
}

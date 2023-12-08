import { Link } from "react-router-dom";

type Props = {
	link?: string;
	buttonText?: string;
	hideButton?: boolean;
	message?: string;
	resource?: string;
};

export default function UnjoinedNotice({
	message,
	resource,
	link,
	buttonText,
	hideButton,
}: Props) {
	const defaultMsg = resource
		? `Create or join a group to view ${resource}s`
		: "Unauthorized access to view resource.";

	return (
		<div className="flex flex-col gap-2 items-center px-10 py-6 place-self-center rounded-xl bg-slate-100 dark:bg-zinc-900 w-fit">
			<p className="p-1">{message ?? defaultMsg}</p>
			{!hideButton && (
				<Link
					className="font-semibold px-3 py-2 w-fit text-white rounded-md dark:bg-blue-700 dark:hover:bg-blue-600 bg-blue-600 hover:bg-blue-500"
					to={link ?? "/group"}
				>
					{buttonText ?? "Go to groups"}
				</Link>
			)}
		</div>
	);
}

import { useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { Comment } from "../../types";
import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

type Props = {
	prevComment?: Comment;
	setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
	isEdit?: boolean;
	setEdit?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CommentEditor({
	prevComment,
	setComments,
	isEdit,
	setEdit,
}: Props) {
	const { user } = useAuth();
	const [text, setText] = useState(prevComment?.content ?? "");
	//const [isOpen, setOpen] = useState(isEdit ?? true);
	const { protectedFetch } = useProtectedFetch();
	const { id: ticketId } = useParams();
	const alwaysVisible = !prevComment;

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = e.target;
		setText(value);
	};

	// const handleOpen = () => {
	// 	setOpen(true);
	// };

	const handleCancel = () => {
		setText("");
		setEdit && setEdit(false);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const comment: Comment = {
			commentId: prevComment?.commentId ?? uuidv4(),
			content: text,
			userId: user.current!.userId,
			username: user.current!.username,
			ticketId: ticketId!,
			timestamp: prevComment ? prevComment.timestamp : Date.now(),
		};
		if (prevComment) comment.lastModified = Date.now();

		const fetchParams = !prevComment
			? {
					url: `/api/comment`,
					options: { method: "POST", body: JSON.stringify(comment) },
			  }
			: {
					url: `/api/comment/${prevComment.commentId}`,
					options: { method: "PATCH", body: JSON.stringify(comment) },
			  };

		const res = await protectedFetch(fetchParams.url, fetchParams.options);
		if (res.ok) {
			setText("");
			setEdit && setEdit(false);
			setComments((prev) =>
				prevComment
					? prev.map((c) =>
							c.commentId === comment.commentId ? comment : c
					  )
					: [...prev, comment]
			);
		}
	};

	return (
		(isEdit || alwaysVisible) && (
			<form
				className="flex flex-col gap-2 border-neutral-200 dark:border-neutral-500"
				onSubmit={handleSubmit}
			>
				<textarea
					className="text-sm sm:text-base rounded-md border px-2 shadow-sm bg-inherit border-inherit"
					value={text}
					onChange={handleChange}
					rows={text ? 2 : 1}
					placeholder="Write comment..."
				/>
				{text && (
					<div className="flex flex-row gap-2 self-end">
						<button
							className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md"
							type="submit"
						>
							Post
						</button>
						<button
							className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded-md"
							type="button"
							onClick={handleCancel}
						>
							Cancel
						</button>
					</div>
				)}
			</form>
		)
	);
}

import { Link, useParams } from "react-router-dom";
import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
import { Comment } from "../../types";
import CommentEditor from "../Editor/CommentEditor";
import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";
import MenuDropdown from "../Nav/MenuDropdown";
import { useState } from "react";
import CountLabel from "../Display/CountLabel";
import timestampDisplay from "../../utility/timestampDisplay";
import { useAuth } from "../../hooks/auth/useAuth";
import { ThumbUp, ThumbDown } from "../Svg/ThumbIcons";

interface ContainerProps {
	numComments: number;
}

interface CardProps {
	comment: Comment;
	deleteComment: (_id: string) => void;
	setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

function CommentCard({ comment: c, deleteComment, setComments }: CardProps) {
	const [isEdit, setEdit] = useState(false);
	const { user } = useAuth();
	const isAuthor = user.current!.userId === c.userId;
	const [reacted, setReacted] = useState({
		isLiked: c.likes.includes(user.current!.userId),
		isDisliked: c.dislikes.includes(user.current!.userId),
	});
	const { protectedFetch } = useProtectedFetch();

	const editComment = () => {
		setEdit(true);
	};

	const options = [
		{ name: "Delete", fn: deleteComment },
		{ name: "Edit", fn: editComment },
	];

	const resetReaction = async () => {
		setReacted({ isLiked: false, isDisliked: false });
		setComments((prev) =>
			prev.map((cm) =>
				cm.commentId === c.commentId
					? {
							...cm,
							likes: cm.likes.filter(
								(i) => i !== user.current!.userId
							),
							dislikes: cm.dislikes.filter(
								(i) => i !== user.current!.userId
							),
					  }
					: cm
			)
		);

		await protectedFetch(
			`/api/comment/${c.commentId}/reset/${user.current!.userId}`,
			{ method: "PATCH" }
		);
	};

	const likeComment = async () => {
		const { isLiked } = reacted;
		if (isLiked) return await resetReaction();

		setReacted({ isLiked: true, isDisliked: false });
		setComments((prev) =>
			prev.map((cm) =>
				cm.commentId === c.commentId
					? {
							...cm,
							likes: [...cm.likes, user.current!.userId],
							dislikes: cm.dislikes.filter(
								(i) => i !== user.current!.userId
							),
					  }
					: cm
			)
		);
		await protectedFetch(
			`/api/comment/${c.commentId}/like/${user.current!.userId}`,
			{ method: "PATCH" }
		);
	};

	const dislikeComment = async () => {
		const { isDisliked } = reacted;
		if (isDisliked) return await resetReaction();

		setReacted({ isLiked: false, isDisliked: true });
		setComments((prev) =>
			prev.map((cm) =>
				cm.commentId === c.commentId
					? {
							...cm,
							likes: cm.likes.filter(
								(i) => i !== user.current!.userId
							),
							dislikes: [...cm.dislikes, user.current!.userId],
					  }
					: cm
			)
		);
		await protectedFetch(
			`/api/comment/${c.commentId}/dislike/${user.current!.userId}`,
			{ method: "PATCH" }
		);
	};

	return !isEdit ? (
		<div className="flex flex-col gap-2 p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 shadow-md">
			<div className="flex flex-row justify-between">
				<div className="flex flex-row gap-4 items-baseline">
					<Link
						className="font-semibold text-lg hover:underline"
						to={`/user/${c.userId}`}
					>
						{c.username}
					</Link>
					<div className="text-neutral-500 dark:text-neutral-400 flex flex-row gap-2">
						<i>{timestampDisplay(c.timestamp)}</i>
						{c.lastModified && (
							<>
								&bull;
								<i>{`edited ${timestampDisplay(
									c.lastModified
								)}`}</i>
							</>
						)}
					</div>
				</div>
				{isAuthor && (
					<MenuDropdown options={options} cardId={c.commentId} />
				)}
			</div>
			<span>{c.content}</span>
			<div className="flex flex-row gap-4">
				<ThumbUp
					isSelected={reacted.isLiked}
					fn={likeComment}
					count={c.likes.length}
				/>
				<ThumbDown
					isSelected={reacted.isDisliked}
					fn={dislikeComment}
					count={c.dislikes.length}
				/>
			</div>
		</div>
	) : (
		<CommentEditor
			prevComment={c}
			setComments={setComments}
			isEdit={isEdit}
			setEdit={setEdit}
		/>
	);
}

export default function CommentContainer({ numComments }: ContainerProps) {
	const [isExpand, setExpand] = useState(false);
	const { id: ticketId } = useParams();
	const {
		data: comments,
		setData: setComments,
		isLoading,
	} = useInitialFetch<Comment[]>(`/api/comment/ticket/${ticketId}`);
	const { protectedFetch } = useProtectedFetch();

	const expandComments = () => {
		setExpand((prev) => !prev);
	};

	const deleteComment = async (id: string) => {
		const res = await protectedFetch(`/api/comment/${id}`, {
			method: "DELETE",
		});
		if (res.ok)
			setComments((prev) => prev.filter((c) => c.commentId !== id));
	};

	return isExpand ? (
		<div className="flex flex-col gap-2">
			<button
				className="p-2 dark:hover:bg-neutral-700 hover:bg-slate-200 w-fit rounded-md"
				type="button"
				onClick={expandComments}
			>
				<CountLabel count={numComments} text="Comment" showZero />
			</button>
			<CommentEditor setComments={setComments} />
			{!isLoading &&
				comments.map((c) => (
					<CommentCard
						{...{ comment: c, deleteComment, setComments }}
					/>
				))}
		</div>
	) : (
		<button
			className="p-2 dark:hover:bg-neutral-700 hover:bg-slate-200 w-fit rounded-md"
			type="button"
			onClick={expandComments}
		>
			<CountLabel count={numComments} text="Comment" showZero />
		</button>
	);
}

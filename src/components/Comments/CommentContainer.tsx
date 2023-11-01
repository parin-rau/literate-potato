import { useParams } from "react-router-dom";
import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
import { Comment } from "../../types";

interface CardProps {
	comment: Comment;
	fns: (() => void)[];
}

function CommentCard({ comment: c, fns }: CardProps) {
	return (
        <div className="flex flex-col gap-2">
            <span>{c.userId}</span>
            <span>{c.timestamp}</span>
            {c.lastModified && <span>{c.lastModified}</span>}
            <span>{c.content}</span>
        </div>
    );
}

export default function CommentContainer() {
	const { id: ticketId } = useParams();
	const apiUrl = `/api/comment/${ticketId}`;
	const {
		data: comments,
		setData: setComments,
		isLoading,
	} = useInitialFetch<Comment[]>(apiUrl);

    const 

	return (
		<div className="flex flex-col gap-2">
			{comments.map((c) => (
				<CommentCard {...{ comment: c }} />
			))}
		</div>
	);
}

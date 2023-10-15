import { useState } from "react";
import { useAuth } from "../../hooks/utility/useAuth";

type Props = {
	comments: string[];
};

export default function CommentEditor(props: Props) {
	const { comments } = props;
	const { user } = useAuth();
	const [comment, setComment] = useState({
		creator: user.current?.username,
		text: "",
	});

	function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const { value } = e.target;
		setComment((prev) => ({ ...prev, text: value }));
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setComment((prev) => ({ ...prev, text: "" }));
	}

	return (
		<form onSubmit={handleSubmit}>
			<textarea value={comment.text} onChange={handleChange} />
		</form>
	);
}

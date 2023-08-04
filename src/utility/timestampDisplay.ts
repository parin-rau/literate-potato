export default function timestampDisplay(createTime: number) {
	const currentTime = Date.now();

	const elapsedTime = Math.floor((currentTime - createTime) / 1000 / 60); // convert milliseconds to minutes

	let message: string;

	if (elapsedTime < 1) {
		message = "Just now";
	} else if (elapsedTime < 60) {
		if (elapsedTime < 2) {
			message = "1 minute ago";
		} else {
			message = elapsedTime.toString() + " minutes ago";
		}
	} else if (elapsedTime < 60 * 24) {
		if (elapsedTime < 60 * 2) {
			message = "1 hour ago";
		} else {
			message = Math.floor(elapsedTime / 60).toString() + " hours ago";
		}
	} else if (elapsedTime < 60 * 24 * 30) {
		if (elapsedTime < 60 * 24 * 2) {
			message = "1 day ago";
		} else {
			message =
				Math.floor(elapsedTime / 60 / 24).toString() + " days ago";
		}
	} else if (elapsedTime < 60 * 24 * 365) {
		if (elapsedTime < 60 * 24 * 30 * 2) {
			message = "1 month ago";
		} else {
			message =
				Math.floor(elapsedTime / 60 / 24 / 30).toString() +
				" months ago";
		}
	} else {
		if (elapsedTime < 60 * 24 * 365 * 2) {
			message = "1 year ago";
		} else {
			message =
				Math.floor(elapsedTime / 60 / 24 / 365).toString() +
				" years ago";
		}
	}

	return message;
}

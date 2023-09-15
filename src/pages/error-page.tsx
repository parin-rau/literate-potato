import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
	const error = useRouteError() as { statusText: string; message: string };
	console.error(error);

	return (
		<div id="error-page" className="grid h-screen place-items-center">
			<div className="flex flex-col space-y-6 items-center">
				<h1 className="text-bold text-3xl">Oops!</h1>
				<p>Sorry, an unexpected error has occurred.</p>
				<p>
					<i>{error.statusText || error.message}</i>
				</p>
			</div>
		</div>
	);
}

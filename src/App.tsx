import CardContainer from "./components/CardContainer";
import Editor from "./components/Editor";
import Nav from "./components/Nav";

export default function App() {
	return (
		<div className="flex flex-col space-y-4">
			<Nav />
			<Editor />
			<CardContainer />
		</div>
	);
}

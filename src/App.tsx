import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./contexts/AuthContext";
import PersistLogin from "./components/Auth/PersistLogin";

export default function App() {
	return (
		<AuthProvider>
			<PersistLogin>
				<RouterProvider router={router} />
			</PersistLogin>
		</AuthProvider>
	);
}

import React from "react";
import ReactDOM from "react-dom/client";
import ProjectTaskPage from "./pages/ProjectTaskPage.tsx";
import ProjectHomePage from "./pages/ProjectHomePage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/error-page.tsx";
import "./index.css";
import TicketPage from "./pages/TicketPage.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <ProjectHomePage />,
		errorElement: <ErrorPage />,
	},
	{
		path: "project/:id",
		element: <ProjectTaskPage />,
		errorElement: <ErrorPage />,
	},
	{
		path: "tickets/:id",
		element: <TicketPage />,
		errorElement: <ErrorPage />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);

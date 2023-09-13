import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useAuth() {
	const Context = useContext(AuthContext);

	if (!Context) {
		throw new Error("useAuth must be used inside <AuthContext.Provider>");
	}

	return Context;
}

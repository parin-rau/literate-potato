import { useState, createContext } from "react";
import jwtDecode from "../utility/jwtDecode";

type User = {
	username: string;
	userId: string;
	roles: number[];
	iat: number;
	exp: number;
};

type UserContextType = {
	user: User | null;
	signIn: (_t: string) => void | null;
	signOut: () => Promise<void> | null;
};

export const AuthContext = createContext<UserContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	function signIn(token: string) {
		const decoded = jwtDecode<User>(token);
		if (!decoded || typeof decoded === "string") return;
		setUser(decoded);
	}

	async function signOut() {
		await fetch("/auth/logout");
		setUser(null);
	}

	const value = { user, signIn, signOut };

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

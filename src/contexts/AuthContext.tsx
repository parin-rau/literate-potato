import { useState, createContext, useRef } from "react";
import jwtDecode from "../utility/jwtDecode";
import { useNavigate } from "react-router-dom";
import { Login, Register, UserDecode } from "../types";

interface User extends UserDecode {
	token: string;
}

type UserContextType = {
	user: React.MutableRefObject<User | null>; // User | null
	registerUser: (_loginForm: Register) => Promise<void>;
	signIn: (_loginForm: Login) => Promise<void>;
	signOut: () => Promise<void>;
	refreshAccessToken: () => Promise<void>;
	err: string | null;
	setErr: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AuthContext = createContext<UserContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	//const [user, setUser] = useState<User | null>(null);
	const user = useRef<User | null>(null);
	const [err, setErr] = useState<string | null>(null);
	const navigate = useNavigate();

	async function registerUser(formData: Register) {
		if (formData.password !== formData.passwordConfirm)
			return setErr("Passwords do not match");

		try {
			const res: Response = await fetch("/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ kind: "register", form: formData }),
			});

			if (!res.ok) {
				const { message }: { message: string } = await res.json();
				//console.log(message);
				return setErr(message);
			}

			const userCredentials: Login = {
				username: formData.username,
				password: formData.password,
			};

			await signIn(userCredentials);
		} catch (e) {
			console.error(e);
			setErr("Caught registerUser error");
		}
	}

	async function signIn(formData: Login) {
		try {
			setErr(null);
			const res = await fetch("/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ kind: "login", form: formData }),
			});

			if (!res.ok) {
				const { message }: { message: string } = await res.json();
				//console.log(message);
				return setErr(message);
			}

			const { accessToken }: { accessToken: string } = await res.json();
			const decoded = jwtDecode<UserDecode>(accessToken);
			if (!decoded || typeof decoded === "string") return;

			user.current = { token: accessToken, ...decoded };
			//setUser({ token: accessToken, ...decoded });
			navigate("/");
		} catch (e) {
			console.error(e);
			setErr("Caught signIn error");
		}
	}

	async function signOut() {
		try {
			await fetch("/auth/logout", { credentials: "include" });
		} catch (e) {
			console.error(e);
			setErr("Caught signOut error");
		} finally {
			user.current = null;
			//setUser(null);
			navigate("/login");
		}
	}

	async function refreshAccessToken() {
		try {
			const res = await fetch("/auth/refresh", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
			});

			if ([400, 401, 403].some((n) => res.status === n)) {
				setErr("Unable to refresh access token. Signing out");
				return await signOut();
			}

			if (!res.ok) {
				setErr("Something went wrong. Signing out");
				return await signOut();
			}

			const { accessToken }: { accessToken: string } = await res.json();
			const decoded = jwtDecode<UserDecode>(accessToken);
			if (!decoded || typeof decoded === "string") return await signOut();

			user.current = { token: accessToken, ...decoded };

			return;
			//setUser({ token: accessToken, ...decoded });
		} catch (e) {
			console.error(e);
			setErr("Caught refreshAccessToken error");
			return await signOut();
		}
	}

	const value = {
		user,
		registerUser,
		signIn,
		signOut,
		refreshAccessToken,
		err,
		setErr,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

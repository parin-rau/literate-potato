import { useState, createContext } from "react";
import jwtDecode from "../utility/jwtDecode";
import { useNavigate } from "react-router-dom";
import { Login } from "../types";

interface UserDecode {
	username: string;
	userId: string;
	roles: number[];
	iat: number;
	exp: number;
}

interface User extends UserDecode {
	token: string;
}

type RegisterForm = {
	email: string;
	username: string;
	password: string;
};

type UserContextType = {
	user: User | null;
	registerUser: (_loginForm: RegisterForm) => Promise<void> | null;
	signIn: (_loginForm: Login) => Promise<void> | null;
	signOut: () => Promise<void> | null;
	refreshAccessToken: () => Promise<void> | null;

	err: string | null;
	setErr: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AuthContext = createContext<UserContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [err, setErr] = useState<string | null>(null);
	const navigate = useNavigate();

	async function registerUser(formData: RegisterForm) {
		try {
			const res: Response = await fetch("/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ kind: "register", form: formData }),
			});

			if (!res.ok) return setErr("Unable to register new user");

			const userCredentials: Login = {
				username: formData.username,
				password: formData.password,
			};
			setErr(null);
			signIn(userCredentials);
		} catch (e) {
			console.error(e);
			setErr("Caught registerUser error");
		}
	}

	async function signIn(formData: Login) {
		try {
			const res = await fetch("/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ kind: "login", form: formData }),
			});

			if (!res.ok) return setErr("Unable to login");

			const { accessToken }: { accessToken: string } = await res.json();
			const decoded = jwtDecode<UserDecode>(accessToken);
			if (!decoded || typeof decoded === "string") return;

			setErr(null);
			setUser({ token: accessToken, ...decoded });
			navigate("/");
		} catch (e) {
			console.error(e);
			setErr("Caught signIn error");
		}
	}

	async function signOut() {
		try {
			const res = await fetch("/auth/logout");
			if (res.ok) {
				setErr(null);
				setUser(null);
				navigate("/login");
			}
		} catch (e) {
			console.error(e);
			setErr("Caught signOut error");
		}
	}

	async function refreshAccessToken() {
		try {
			const res = await fetch("/auth/refresh", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
			});
			if (!res.ok) {
				signOut();
			}

			const { accessToken }: { accessToken: string } = await res.json();
			const decoded = jwtDecode<UserDecode>(accessToken);
			if (!decoded || typeof decoded === "string") return signOut();

			setUser({ token: accessToken, ...decoded });
			setErr(null);
		} catch (e) {
			console.error(e);
			setErr("Caught refreshAccessToken error");
			signOut();
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

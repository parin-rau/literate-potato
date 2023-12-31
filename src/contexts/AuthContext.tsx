import { useState, createContext, useRef, useCallback, useMemo } from "react";
import jwtDecode from "../utility/jwtDecode";
import { useNavigate } from "react-router-dom";
import { Login, Register, UserDecode } from "../types";

interface User extends UserDecode {
	token: string;
}

type UserContextType = {
	user: React.MutableRefObject<User | null>;
	registerUser: (_loginForm: Register) => Promise<void>;
	signIn: (_loginForm: Login) => Promise<void>;
	signOut: () => Promise<void>;
	refreshAccessToken: () => Promise<void>;
	err: string | null;
	setErr: React.Dispatch<React.SetStateAction<string | null>>;
};

export const AuthContext = createContext<UserContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const user = useRef<User | null>(null);
	const [err, setErr] = useState<string | null>(null);
	const navigate = useNavigate();

	const signIn = useCallback(
		async (formData: Login) => {
			try {
				setErr(null);
				const res = await fetch("/auth/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ kind: "login", form: formData }),
				});

				if (!res.ok) {
					const { message }: { message: string } = await res.json();
					return setErr(message);
				}

				const { accessToken }: { accessToken: string } =
					await res.json();
				const decoded = jwtDecode<UserDecode>(accessToken);
				if (!decoded || typeof decoded === "string") return;

				user.current = { token: accessToken, ...decoded };
				navigate("/");
			} catch (e) {
				console.error(e);
				setErr("Caught signIn error");
			}
		},
		[navigate]
	);

	const signOut = useCallback(async () => {
		try {
			await fetch("/auth/logout", { credentials: "include" });
		} catch (e) {
			console.error(e);
			setErr("Caught signOut error");
		} finally {
			user.current = null;
			navigate("/login");
		}
	}, [navigate]);

	const registerUser = useCallback(
		async (formData: Register) => {
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
		},
		[signIn]
	);

	const refreshAccessToken = useCallback(async () => {
		try {
			const res = await fetch("/auth/refresh", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
			});

			if ([400, 401, 403].some((n) => res.status === n)) {
				const { message }: { message: string } = await res.json();
				setErr(message);
				return await signOut();
			}

			if (!res.ok) {
				setErr("Something went wrong. Signing out.");
				return await signOut();
			}

			const { accessToken }: { accessToken: string } = await res.json();
			const decoded = jwtDecode<UserDecode>(accessToken);
			if (!decoded || typeof decoded === "string") return await signOut();

			user.current = { token: accessToken, ...decoded };

			return;
		} catch (e) {
			console.error(e);
			setErr("Caught refreshAccessToken error");
			return await signOut();
		}
	}, [signOut]);

	const value = useMemo(
		() => ({
			user,
			registerUser,
			signIn,
			signOut,
			refreshAccessToken,
			err,
			setErr,
		}),
		[err, refreshAccessToken, registerUser, signIn, signOut]
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

import { useState } from "react";
import { Login, Register } from "../../types";
import { useAuth } from "../../hooks/auth/useAuth";
import { firstLetterCap } from "../../utility/charCaseFunctions";
import { Link } from "react-router-dom";
import PasswordInput from "../Nav/PasswordInput";
import ErrorMsg from "../Display/ErrorMsg";

type Props = {
	kind: "register" | "login";
};

const initRegister: Register = {
	email: "",
	username: "",
	password: "",
	passwordConfirm: "",
};

const initLogin: Login = {
	username: "",
	password: "",
};

type Form = Register | Login;

export default function LoginForm(props: Props) {
	const { kind } = props;
	const init = kind === "register" ? initRegister : initLogin;
	const [form, setForm] = useState<Form>(init);
	const { signIn, registerUser, err, setErr } = useAuth();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
		setErr(null);
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		switch (kind) {
			case "login":
				handleLogin();
				break;
			case "register":
				handleRegister();
				break;
			default:
				setErr("Not a valid request");
				break;
		}
	}

	async function handleRegister() {
		if (kind !== "register") {
			setErr("Unable to process registration");
		}
		await registerUser(form as Register);
	}

	async function handleLogin() {
		if (kind !== "login") {
			setErr("Unable to process login");
		}
		await signIn(form as Login);
	}

	return (
		<div className="flex flex-col gap-4 items-center container mt-20 sm:mt-32 mx-auto max-w-fit sm:px-12 bg-slate-50 dark:bg-zinc-900 rounded-xl">
			<form
				className="flex flex-col items-start gap-4 p-8"
				onSubmit={handleSubmit}
			>
				<h1 className="font-bold text-3xl">{firstLetterCap(kind)}</h1>

				<input
					className="text-sm sm:text-base rounded-md border px-2 py-1 shadow-sm bg-inherit border-inherit"
					name="username"
					maxLength={64}
					size={40}
					value={form.username}
					onChange={handleChange}
					placeholder="Username"
					required
				/>
				{kind === "register" && (
					<input
						className="text-sm sm:text-base rounded-md border px-2 py-1 shadow-sm bg-inherit border-inherit"
						name="email"
						maxLength={64}
						size={40}
						value={(form as Register).email}
						onChange={handleChange}
						placeholder="Email"
						type="email"
						required
					/>
				)}

				<PasswordInput
					name="password"
					value={form.password}
					handleChange={handleChange}
					placeholder="Password"
				/>
				{kind === "register" && (
					<PasswordInput
						name="passwordConfirm"
						value={(form as Register).passwordConfirm}
						handleChange={handleChange}
						placeholder="Re-enter Password"
					/>
				)}
				{err && <ErrorMsg msg={err} />}
				<button
					className="text-md text-white font-bold bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 py-2 px-4 rounded-lg"
					type="submit"
				>
					{firstLetterCap(kind)}
				</button>
				<Link
					className="mt-4"
					to={kind !== "register" ? "/register" : "/login"}
				>
					{kind !== "register"
						? "Register new user"
						: "Login existing user"}
				</Link>
			</form>
		</div>
	);
}

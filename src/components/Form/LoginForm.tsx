import { useState } from "react";
import { Login, Register } from "../../types";
import { firstLetterCap } from "../../utility/charCaseFunctions";
import { Link } from "react-router-dom";

type Props = {
	kind: "register" | "login";
};

const initRegister: Register = {
	email: "",
	username: "",
	password: "",
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

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (kind === "login") {
			handleLogin();
		} else if (kind === "register") {
			handleRegister();
		}

		setForm(init);
	}

	async function handleRegister() {
		if (kind !== "register") {
			return;
		} else {
			try {
				const newUser = {
					kind,
					...(form as Register),
				};
				const res = await fetch("/auth/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(newUser),
				});
				if (res.ok) {
					console.log("Registering...");
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	async function handleLogin() {
		if (kind !== "login") {
			return;
		} else {
			try {
				const res = await fetch("");
				if (res.ok) {
					console.log("logging in...");
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	return (
		<div className="flex flex-col gap-4 items-center container mt-32 mx-auto max-w-fit px-12 bg-slate-50 dark:bg-zinc-900 rounded-xl">
			<form
				className="flex flex-col items-start gap-4 p-8"
				onSubmit={handleSubmit}
			>
				<h1 className="font-bold text-3xl">{firstLetterCap(kind)}</h1>
				{kind === "register" && (
					<input
						className="text-sm sm:text-base rounded-md border px-2 py-1 shadow-sm bg-inherit border-inherit"
						name="email"
						value={(form as Register).email}
						onChange={handleChange}
						placeholder="Email"
						required
					/>
				)}

				<input
					className="text-sm sm:text-base rounded-md border px-2 py-1 shadow-sm bg-inherit border-inherit"
					name="username"
					value={form.username}
					onChange={handleChange}
					placeholder="Username"
					required
				/>
				<input
					className="text-sm sm:text-base rounded-md border px-2 py-1 shadow-sm bg-inherit border-inherit"
					name="password"
					value={form.password}
					onChange={handleChange}
					type="password"
					placeholder="Password"
					required
				/>
				<button
					className="text-md text-white font-bold bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 py-2 px-4 rounded-lg"
					type="submit"
				>
					{firstLetterCap(kind)}
				</button>
				<Link to={kind !== "register" ? "/register" : "/login"}>
					{kind !== "register"
						? "Register new user"
						: "Login existing user"}
				</Link>
			</form>
		</div>
	);
}

import { useState } from "react";

interface Login {
	email: string;
	username: string;
	password: string;
}

interface Register extends Login {
	firstName: string;
	lastName: string;
}

const initRegister: Register = {
	firstName: "",
	lastName: "",
	email: "",
	username: "",
	password: "",
};

const initLogin: Login = {
	email: "",
	username: "",
	password: "",
};

export default function LoginForm() {
	const [isRegister, setRegister] = useState(false);
	const [form, setForm] = useState<Register | Login>(initLogin);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setForm({ ...form, [name]: value });
	}

	function handleFormType() {
		setRegister(!isRegister);
		if (isRegister === true) {
			setForm(initRegister);
		} else {
			setForm(initLogin);
		}
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (isRegister) {
			handleRegister();
		} else {
			handleLogin();
		}

		setRegister(false);
		setForm(initLogin);
	}

	async function handleRegister() {
		try {
			const res = await fetch("");
			if (res.ok) {
				console.log("Registering...");
			}
		} catch (e) {
			console.error(e);
		}
	}

	async function handleLogin() {
		try {
			const res = await fetch("");
			if (res.ok) {
				console.log("logging in...");
			}
		} catch (e) {
			console.error(e);
		}
	}

	return (
		<div className="flex flex-col space-y-4 items-center my-10 sm:container mx-auto py-6 border border-black">
			<form
				className="flex flex-col space-y4 items-start space-y-4"
				onSubmit={handleSubmit}
			>
				<h1 className="text-bold text-3xl">
					{isRegister ? "Register" : "Login"}
				</h1>
				{isRegister && (
					<>
						<input
							name="firstName"
							value={(form as Register).firstName}
							onChange={handleChange}
							placeholder="First Name"
						/>
						<input
							name="lastName"
							value={(form as Register).lastName}
							onChange={handleChange}
							placeholder="Last Name"
						/>
					</>
				)}
				<input
					name="email"
					value={form.email}
					onChange={handleChange}
					placeholder="Email"
				/>
				<input
					name="username"
					value={form.username}
					onChange={handleChange}
					placeholder="Username"
				/>
				<input
					name="password"
					value={form.password}
					onChange={handleChange}
					type="password"
					placeholder="Password"
				/>
				<button
					className="text-md text-white font-bold bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-lg"
					type="submit"
				>
					{isRegister ? "Register" : "Login"}
				</button>
				<button type="button" onClick={handleFormType}>
					{isRegister ? "Login existing user" : "Register new user"}
				</button>
			</form>
		</div>
	);
}

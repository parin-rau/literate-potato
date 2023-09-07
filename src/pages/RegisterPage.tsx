import LoginForm from "../components/Form/LoginForm";

export default function RegisterPage() {
	return (
		<div className="flex flex-col justify-center items-stretch">
			<LoginForm kind="register" />
		</div>
	);
}

import LoginForm from "../components/Form/LoginForm";

export default function LoginPage() {
	return (
		<div className="flex flex-col justify-center items-stretch">
			<LoginForm kind="login" />
		</div>
	);
}

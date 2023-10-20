import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import LoginForm from "../../components/Form/LoginForm";
import { usePageTitle } from "../../hooks/utility/usePageTitle";

export default function RegisterPage() {
	const navigate = useNavigate();
	const { user } = useAuth();

	usePageTitle("Register");

	useEffect(() => {
		if (user.current) navigate("/");
	}, [user, navigate]);

	return (
		<div className="flex flex-col justify-center items-stretch">
			<LoginForm kind="register" />
		</div>
	);
}

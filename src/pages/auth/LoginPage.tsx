import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoginForm from "../../components/Form/LoginForm";

export default function LoginPage() {
	const navigate = useNavigate();
	const { user } = useAuth();

	useEffect(() => {
		if (user.current) navigate("/");
	}, [user, navigate]);

	return (
		<div className="flex flex-col justify-center items-stretch">
			<LoginForm kind="login" />
		</div>
	);
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

function HomePage() {
	const { user } = useUserContext();
	const navigate = useNavigate();
	useEffect(() => {
		if (user) navigate(`profile/${user.id}`)
	}, []);
  return <div>bonjour</div>;
}

export default HomePage;

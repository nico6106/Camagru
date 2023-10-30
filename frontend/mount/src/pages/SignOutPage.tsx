import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';

function SignOutPage() {
	const navigate = useNavigate();
	const { logoutUser } = useUserContext();

	useEffect(() => {
		signOutBackend();
		logoutUser();
		navigate(`/signin`);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	async function signOutBackend() {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/auth/signout/`,
                {
                    withCredentials: true,
                },
            );
            console.log(response.data);
			navigate('/signin');
            return response.data;
        } catch (error) {
            // setRetour(null);
        }
    }
	return (<></>)
}

export default SignOutPage;
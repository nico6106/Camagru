import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SignOutPage() {
	const navigate = useNavigate();

	useEffect(() => {
		signOutBackend();
		navigate('/');
	}, [])
	async function signOutBackend() {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/auth/signout`,
                {
                    withCredentials: true,
                },
            );
            console.log(response.data);
            return response.data;
        } catch (error) {
            // setRetour(null);
        }
    }
	return (<></>)
}

export default SignOutPage;
import { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import TramePage from '../components/elems/TramePage';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function OauthPage() {
    const { loginUser } = useUserContext();
    const navigate = useNavigate();
    const { method } = useParams();
    const [error, setError] = useState(false);

    const oauth = async () => {
        try {
            const url = new URL(window.location.href);
            const code = url.searchParams.get('code');
            const errorParam = url.searchParams.get('error');
            if (errorParam) setError(true);
            if (code) {
                const res = await axios.post(
                    `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/auth/${method}`,
                    {
                        code
                    },
                    {
                        withCredentials: true,
                    },
                );
                loginUser(res.data.user);
                navigate('/settings');
            }
        } catch (err) {
            // console.error(err)
            setError(true);
        }
    };

    useEffect(() => {
        if (['42', 'github', 'google'].includes(method as string)) {
            void oauth();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [method]);

    // Display a centered error message in a card
    if (error) {
        return (
            <TramePage
                className="min-h-screen bg-black flex flex-col"
                className2="flex flex-grow justify-center items-center mt-4 px-5"
            >
                <div className="block max-w-sm p-6 border rounded-lg shadow bg-gray-800 border-gray-700">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
                        <p>Authentication failed</p>
                    </h5>
                    <p className="font-normal text-gray-400 mb-4">Try Again</p>
                    <a
                        href="/signin"
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        <p>Try Again</p>
                        <svg
                            className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                        </svg>
                    </a>
                </div>
            </TramePage>
        );
    }

    return (
        <div>
            <img
                src="https://mir-s3-cdn-cf.behance.net/project_modules/fs/725eef121244331.60c1c7928b5dd.gif"
                alt="loading"
            />
        </div>
    );
}

export default OauthPage;

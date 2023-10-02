import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorField } from '../components/elems/ErrorFields';
import Button from '../components/elems/Button';
import { useUserContext } from '../context/UserContext';

function SignInPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setpassword] = useState<string>('');
    const navigate = useNavigate();
    const { user, loginUser } = useUserContext();

    // if (user) {
    // 	navigate('/');
    // 	return null;
    // }

    function handleOnChangeUsername(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
    }
    function handleOnChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
        setpassword(e.target.value);
    }

    function handleSignIn(event: any) {
        event.preventDefault();
        console.log('username=' + username + ', pwd=' + password);
        signInBackend();
    }

    async function signInBackend() {
        try {
            const response = await axios.post(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/auth/signin`,
                {
                    username: username,
                    password: password,
                },
                {
                    withCredentials: true,
                },
            );
            console.log(response.data);
            if (response.data.message === 'success')
                loginUser(response.data.user);
            return response.data;
        } catch (error) {
            loginUser(null);
            // setRetour(null);
        }
    }

    return user ? (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    You are already signed in
                </h2>
                <Link to="/">
                    <p className="flex items-center justify-center px-3 mb:px-5 py-2 text-sm transition-colors duration-200 border rounded-lg gap-x-2 w-auto  bg-gray-900 text-gray-200 border-gray-700">
                        Go back home
                    </p>
                </Link>
            </div>
        </div>
    ) : (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" onSubmit={handleSignIn}>
                    <ErrorField
                        name="username"
                        title="Username"
                        onBlur={handleOnChangeUsername}
                    />
                    <ErrorField
                        name="password"
                        title="Password"
                        onBlur={handleOnChangePassword}
                    />

                    <div>
                        <Button
                            text="Sign In"
                            type="submit"
                            style="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        />
                    </div>
                </form>

                <div className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{' '}
                    <p className="inline-block font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        <Link to="/signup">Sign up</Link>
                    </p>
                </div>
                <div className="mt-1 text-center text-sm text-gray-500">
                    Forgot password?{' '}
                    <p className="inline-block font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        <Link to="/forgot"> Reset password</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorField } from '../components/elems/ErrorFields';
import Button from '../components/elems/Button';
import { useUserContext } from '../context/UserContext';
import { EmailNotVerified, InvalidPassword, UnknownUsername } from '../shared/errors';
import ShowErrorMessage from '../components/auth/ShowErrorMessage';
import UserAlreadySignedIn from '../components/auth/UserAlreadySignedIn';

function SignInPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setpassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [styleErrorUsername, setStyleErrorUsername] =
        useState<boolean>(false);
    const [styleErrorPwd, setStyleErrorPwd] = useState<boolean>(false);
    const [styleError, setStyleError] = useState<boolean>(false);
	const navigate = useNavigate();
    const { user, loginUser } = useUserContext();

    useEffect(() => {
        if (styleError === false) return;
        if (error === '' || error === EmailNotVerified) {
            setStyleErrorUsername(false);
            setStyleErrorPwd(false);
        } else if (error === UnknownUsername) {
            setStyleErrorUsername(true);
            setStyleErrorPwd(true);
        } else if (error === InvalidPassword) {
            setStyleErrorUsername(false);
            setStyleErrorPwd(true);
        }
        setStyleError(false);
    }, [error, styleError]);

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
            if (response.data.message === 'success') {
                loginUser(response.data.user);
                setError('');
                setStyleError(false);
				navigate('/');
            } else {
                setStyleError(true);
                setError(response.data.error);
            }
            return response.data;
        } catch (error) {
            loginUser(null);
        }
    }

    return user ? (
        <UserAlreadySignedIn />
    ) : (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" onSubmit={handleSignIn}>
                    <ShowErrorMessage error={error} message={'Impossible to log-in because '} />
                    <ErrorField
                        name="username"
                        title="Username"
                        onBlur={handleOnChangeUsername}
                        styleError={styleErrorUsername}
                        setStyleError={setStyleErrorUsername}
                    />
                    <ErrorField
                        name="password"
                        title="Password"
                        onBlur={handleOnChangePassword}
                        styleError={styleErrorPwd}
                        setStyleError={setStyleErrorPwd}
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

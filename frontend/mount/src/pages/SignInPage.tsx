import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ErrorField } from '../components/elems/ErrorFields';
import Button from '../components/elems/Button';
import { useUserContext } from '../context/UserContext';
import {
    EmailNotVerified,
    InvalidPassword,
    SuccessMsg,
    UnknownUsername,
} from '../shared/errors';
import ShowErrorMessage from '../components/auth/ShowErrorMessage';
import UserAlreadySignedIn from '../components/auth/UserAlreadySignedIn';
import TitleSmall from '../components/elems/TitleSmall';
import LinkText from '../components/elems/LinkText';
import TramePage from '../components/elems/TramePage';

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, styleError]);

    function handleOnChangeUsername(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
    }
    function handleOnChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
        setpassword(e.target.value);
    }

    function handleSignIn(event: any) {
        event.preventDefault();
        // console.log('username=' + username + ', pwd=' + password);
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
            if (response.data.message === SuccessMsg) {
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
        <TramePage>
            <TitleSmall text={'Sign in to your account'} />

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" onSubmit={handleSignIn}>
                    <ShowErrorMessage
                        error={error}
                        message={'Impossible to log-in because '}
                    />
                    <ErrorField
                        name="username"
                        title="Username"
                        onBlur={handleOnChangeUsername}
                        styleError={styleErrorUsername}
                        setStyleError={setStyleErrorUsername}
                        init={username}
                    />
                    <ErrorField
                        name="password"
                        title="Password"
                        onBlur={handleOnChangePassword}
                        styleError={styleErrorPwd}
                        setStyleError={setStyleErrorPwd}
                        init={password}
                    />

                    <div>
                        <Button
                            text="Sign In"
                            type="submit"
                            stylePerso="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        />
                    </div>
                </form>
                <div className="inline-flex items-center justify-center w-full">
                    <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                    <span className="absolute px-3 -translate-x-1/2 bg-white left-1/2">
                        <p>or</p>
                    </span>
                </div>
                <div className="flex flex-col">
                    <button
                        type="button"
                        className="text-white bg-[#000000] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
                    >
                        <svg
                            className="w-6 h-5 me-2"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 13"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.8 0 0 7.15 0 9.75 7.8 9.75 7.8 13 11.05 13 11.05 7.15 3.25 7.15 11.05 0Z"
                                clipRule="evenodd"
                            ></path>
                            <path
                                fillRule="evenodd"
                                d="M16.25 3.25 16.25 0 13 3.25 13 0 19.5 0 19.5 3.25 16.25 7.8 16.25 11.05 19.5 7.8 19.5 11.05 13 11.05 13 7.8Z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <a
                            href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-1e4bbefa1e454e491c984b8c8b4bff57c1564990d98a57deec0c5c522477a788&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fsignin%2F42&response_type=code"
                            className="w-full text-center"
                        >
                            <p className='text-sm font-bold'>Sign in with 42</p>
                        </a>
                    </button>
                    <button
                        type="button"
                        className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
                    >
                        <svg
                            className="w-5 h-5 me-2"
                            aria-hidden="true"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <a
                            href="https://github.com/login/oauth/authorize?client_id=Iv1.73e9efa9f219c040&redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2Fsignin%2Fgithub&scope=read:user"
                            className="w-full text-center"
                        >
                            <p className='text-sm font-bold'>Sign in with Github</p>
                        </a>
                    </button>
                    <button
                        type="button"
                        className="text-black bg-white hover:bg-[#24292F]/90 shadow-md border focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 me-2 mb-2"
                    >
                        <svg
                            className="w-5 h-5 me-2"
                            aria-hidden="true"
                            viewBox="0 0 32 32"
                            fill="currentColor"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                {' '}
                                <path
                                    d="M30.0014 16.3109C30.0014 15.1598 29.9061 14.3198 29.6998 13.4487H16.2871V18.6442H24.1601C24.0014 19.9354 23.1442 21.8798 21.2394 23.1864L21.2127 23.3604L25.4536 26.58L25.7474 26.6087C28.4458 24.1665 30.0014 20.5731 30.0014 16.3109Z"
                                    fill="#4285F4"
                                ></path>{' '}
                                <path
                                    d="M16.2863 29.9998C20.1434 29.9998 23.3814 28.7553 25.7466 26.6086L21.2386 23.1863C20.0323 24.0108 18.4132 24.5863 16.2863 24.5863C12.5086 24.5863 9.30225 22.1441 8.15929 18.7686L7.99176 18.7825L3.58208 22.127L3.52441 22.2841C5.87359 26.8574 10.699 29.9998 16.2863 29.9998Z"
                                    fill="#34A853"
                                ></path>{' '}
                                <path
                                    d="M8.15964 18.769C7.85806 17.8979 7.68352 16.9645 7.68352 16.0001C7.68352 15.0356 7.85806 14.1023 8.14377 13.2312L8.13578 13.0456L3.67083 9.64746L3.52475 9.71556C2.55654 11.6134 2.00098 13.7445 2.00098 16.0001C2.00098 18.2556 2.55654 20.3867 3.52475 22.2845L8.15964 18.769Z"
                                    fill="#FBBC05"
                                ></path>{' '}
                                <path
                                    d="M16.2864 7.4133C18.9689 7.4133 20.7784 8.54885 21.8102 9.4978L25.8419 5.64C23.3658 3.38445 20.1435 2 16.2864 2C10.699 2 5.8736 5.1422 3.52441 9.71549L8.14345 13.2311C9.30229 9.85555 12.5086 7.4133 16.2864 7.4133Z"
                                    fill="#EB4335"
                                ></path>{' '}
                            </g>
                        </svg>
                        <a
                            href="https://accounts.google.com/o/oauth2/auth?response_type=code&redirect_uri=http://127.0.0.1:3000/signin/google&client_id=778311797133-bppdl1hhvtbi8ngikes7h9n9o0ohqksu.apps.googleusercontent.com&scope=email+profile&access_type=online&approval_prompt=auto"
                            className="w-full text-center"
                        >
                            <p className='text-sm font-bold'>Sign in with Google</p>
                        </a>
                    </button>
                </div>

                <LinkText
                    firstText="Not a member?"
                    linkText="Sign up"
                    link="/signup"
                />
                <LinkText
                    firstText="Forgot password?"
                    linkText="Reset password"
                    link="/forgot"
                    space="1"
                />
            </div>
        </TramePage>
    );
}

export default SignInPage;

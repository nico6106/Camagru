import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import UserAlreadySignedIn from "../components/auth/UserAlreadySignedIn";
import TramePage from "../components/elems/TramePage";
import TitleSmall from "../components/elems/TitleSmall";
import ShowErrorMessage from "../components/auth/ShowErrorMessage";
import { ErrorField } from "../components/elems/ErrorFields";
import Button from "../components/elems/Button";
import LinkText from "../components/elems/LinkText";
import ConfirmMailConfirmationSent from "../components/auth/ConfirmMailRecoverySent";
import { SuccessMsg } from "../shared/errors";

function ForgotPasswordPage() {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [styleErrorEmail, setStyleErrorEmail] = useState<boolean>(false);
    const [styleError, setStyleError] = useState<boolean>(false);
	const [created, setCreated] = useState<boolean>(false);
    const { user } = useUserContext();

    useEffect(() => {
        if (styleError === false) return;
        if (error === '') {
            setStyleErrorEmail(false);
        } else if (error === 'UnknownUsername') {
			//
        }
        setStyleError(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error, styleError]);

    function handleOnChangeUsername(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value);
    }

    function handleSignIn(event: any) {
        event.preventDefault();
        console.log('username=' + email );
        signInBackend();
    }

    async function signInBackend() {
        try {
            const response = await axios.post(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/auth/forgotpwd`,
                {
                    email: email,
                },
                {
                    withCredentials: true,
                },
            );
            console.log(response.data);
            if (response.data.message === SuccessMsg) {
                setError('');
                setStyleError(false);
				setCreated(true);
            } else {
                setStyleError(true);
                setError(response.data.error);
				setCreated(false);
            }
            return response.data;
        } catch (error) {
			//
        }
    }

	// ConfirmMailConfirmationSent
    return user ? (
        <UserAlreadySignedIn />
    ) : (created ? (<ConfirmMailConfirmationSent />) : 
		<TramePage>
            <TitleSmall text={'Forgot your password?'} />

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" onSubmit={handleSignIn}>
                    <ShowErrorMessage
                        error={error}
                        message={'Impossible to log-in because '}
                    />
                    <ErrorField
                        name="email"
                        title="Email"
                        onBlur={handleOnChangeUsername}
                        styleError={styleErrorEmail}
                        setStyleError={setStyleErrorEmail}
                    />

                    <div>
                        <Button
                            text="Recover password"
                            type="submit"
                            stylePerso="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        />
                    </div>
                </form>

                <LinkText
                    firstText="Not a member?"
                    linkText="Sign up"
                    link="/signup"
                />
                <LinkText
                    firstText="Remember your password?"
                    linkText="Sign in"
                    link="/signin"
					space='1'
                />
            </div>
		</TramePage>
    );
}

export default ForgotPasswordPage;
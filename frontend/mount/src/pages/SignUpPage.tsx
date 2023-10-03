import { useNavigate } from 'react-router-dom';
import ShowErrorMessage from '../components/auth/ShowErrorMessage';
import { ErrorField } from '../components/elems/ErrorFields';
import Button from '../components/elems/Button';
import { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import {
    EmailNotVerified,
    EmailTaken,
    InvalidEmail,
    InvalidFirstName,
    InvalidLastName,
    InvalidPassword,
    InvalidUsername,
    MissingFirstName,
    MissingLastName,
    MissingPwd,
    MissingUsername,
    UnknownUsername,
	UsernameTaken,
} from '../shared/errors';
import axios from 'axios';
import TitleSmall from '../components/elems/TitleSmall';
import LinkText from '../components/elems/LinkText';
import UserAlreadySignedIn from '../components/auth/UserAlreadySignedIn';
import ConfirmUserCreation from '../components/auth/ConfirmUserCreation';

function SignUpPage() {
    const [username, setUsername] = useState<string>('');
    const [password, setpassword] = useState<string>('');
    const [email, setemail] = useState<string>('');
    const [firstname, setfirstname] = useState<string>('');
    const [lastname, setlastname] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [styleErrorUsername, setStyleErrorUsername] =
        useState<boolean>(false);
    const [styleErrorPwd, setStyleErrorPwd] = useState<boolean>(false);
    const [styleErrorEmail, setStyleErrorEmail] = useState<boolean>(false);
    const [styleErrorFirstname, setStyleErrorFirstname] =
        useState<boolean>(false);
    const [styleErrorLastname, setStyleErrorLastname] =
        useState<boolean>(false);
    const [styleError, setStyleError] = useState<boolean>(false);
    const { user } = useUserContext();
	const [created, setCreated] = useState<boolean>(false);
	

	function setFalseAll() {
		setStyleErrorUsername(false);
		setStyleErrorPwd(false);
		setStyleErrorEmail(false);
		setStyleErrorFirstname(false);
		setStyleErrorLastname(false);
	}

    useEffect(() => {
        if (styleError === false) return;
        if (error === '') 
			setFalseAll();
		else {
			setFalseAll();
			if (error === InvalidUsername || error === MissingUsername || error === UsernameTaken)
				setStyleErrorUsername(true);
			else if (error === MissingPwd)
				setStyleErrorPwd(true);
			else if (error === EmailTaken || error === InvalidEmail)
				setStyleErrorEmail(true);
			else if (error === InvalidFirstName || error === MissingFirstName)
				setStyleErrorFirstname(true);
			else if (error === InvalidLastName || error === MissingLastName)
			setStyleErrorLastname(true);
		}
        setStyleError(false);
    }, [error, styleError]);

    function handleOnChangeUsername(e: React.ChangeEvent<HTMLInputElement>) {
        setUsername(e.target.value);
    }
    function handleOnChangePassword(e: React.ChangeEvent<HTMLInputElement>) {
        setpassword(e.target.value);
    }
    function handleOnChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
        setemail(e.target.value);
    }
    function handleOnChangeFirstname(e: React.ChangeEvent<HTMLInputElement>) {
        setfirstname(e.target.value);
    }
    function handleOnChangeLastname(e: React.ChangeEvent<HTMLInputElement>) {
        setlastname(e.target.value);
    }

    function handleSignUp(event: any) {
        event.preventDefault();
        console.log('username=' + username + ', pwd=' + password);
        signUpBackend();
    }

    async function signUpBackend() {
        try {
            const response = await axios.post(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/auth/signup`,
                {
                    username: username,
                    password: password,
                    email: email,
                    lastname: lastname,
                    firstname: firstname,
                },
                {
                    withCredentials: true,
                },
            );
            console.log(response.data);
            if (response.data.message === 'success') {
                setError('');
                setStyleError(false);
				setCreated(true);
            } else {
                setStyleError(true);
                setError(response.data.error);
            }
            return response.data;
        } catch (error) {
			//to handle ?
        }
    }

    return user ? (
        <UserAlreadySignedIn />
    ) : (created ? (<ConfirmUserCreation />) : (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <TitleSmall text={'Become a member !'} />

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-4" action="#" onSubmit={handleSignUp}>
                    <ShowErrorMessage
                        error={error}
                        message={'Impossible to sign up because '}
                    />
                    <ErrorField
                        name="username"
                        title="Username"
                        onBlur={handleOnChangeUsername}
                        styleError={styleErrorUsername}
                        setStyleError={setStyleErrorUsername}
                    />
                    <ErrorField
                        name="email"
                        title="Email"
                        onBlur={handleOnChangeEmail}
                        styleError={styleErrorEmail}
                        setStyleError={setStyleErrorEmail}
                    />
                    <ErrorField
                        name="password"
                        title="Password"
                        onBlur={handleOnChangePassword}
                        styleError={styleErrorPwd}
                        setStyleError={setStyleErrorPwd}
                    />
                    <ErrorField
                        name="firstname"
                        title="First name"
                        onBlur={handleOnChangeFirstname}
                        styleError={styleErrorFirstname}
                        setStyleError={setStyleErrorFirstname}
                    />
                    <ErrorField
                        name="lastname"
                        title="Last name"
                        onBlur={handleOnChangeLastname}
                        styleError={styleErrorLastname}
                        setStyleError={setStyleErrorLastname}
                    />

                    <Button
                        text="Sign Up"
                        type="submit"
                        stylePerso="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    />
                </form>

                <LinkText
                    firstText="Already a member?"
                    linkText="Sign in"
                    link="/signin"
                />
            </div>
        </div>
	));
}

export default SignUpPage;

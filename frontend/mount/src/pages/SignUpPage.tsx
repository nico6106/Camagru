import { Link, useNavigate } from "react-router-dom"
import ShowErrorMessage from "../components/auth/ShowErrorMessage"
import { ErrorField } from "../components/elems/ErrorFields"
import Button from "../components/elems/Button"
import { useEffect, useState } from "react";
import { useUserContext } from "../context/UserContext";
import { EmailNotVerified, InvalidPassword, UnknownUsername } from "../shared/errors";
import axios from "axios";

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
	const [styleErrorFirstname, setStyleErrorFirstname] = useState<boolean>(false);
	const [styleErrorLastname, setStyleErrorLastname] = useState<boolean>(false);
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
	function handleOnChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
        setemail(e.target.value);
    }
	function handleOnChangeFirstname(e: React.ChangeEvent<HTMLInputElement>) {
        setfirstname(e.target.value);
    }
	function handleOnChangeLastname(e: React.ChangeEvent<HTMLInputElement>) {
        setlastname(e.target.value);
    }

    function handleSignIn(event: any) {
        event.preventDefault();
        console.log('username=' + username + ', pwd=' + password);
        signInBackend();
    }

	async function signInBackend() {
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

	return (<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div className="sm:mx-auto sm:w-full sm:max-w-sm">
		<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
			Become a member !
		</h2>
	</div>

	<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form className="space-y-4" action="#" onSubmit={handleSignIn}>
			<ShowErrorMessage error={error} message={'Impossible to sign up because '} />
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

			<div>
				<Button
					text="Sign Up"
					type="submit"
					style="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				/>
			</div>
		</form>

		<div className="mt-10 text-center text-sm text-gray-500">
			Already a member?{' '}
			<p className="inline-block font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
				<Link to="/signin">Sign in</Link>
			</p>
		</div>
	</div>
</div>)
}

export default SignUpPage
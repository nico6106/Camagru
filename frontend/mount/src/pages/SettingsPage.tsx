import ShowErrorMessage from "../components/auth/ShowErrorMessage";
import UserNotSignedIn from "../components/auth/UserNotSignedIn";
import Button from "../components/elems/Button";
import { ErrorField } from "../components/elems/ErrorFields";
import LinkText from "../components/elems/LinkText";
import TitleSmall from "../components/elems/TitleSmall";
import { useUserContext } from "../context/UserContext";

function SettingsPage() {
	const { user } = useUserContext();

	return !user ? (
        <UserNotSignedIn />
    ) : (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <TitleSmall text={'Become a member !'} />

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                {/* <form className="space-y-4" action="#" onSubmit={handleSignUp}>
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
                </form> */}

                <LinkText
                    firstText="Already a member?"
                    linkText="Sign in"
                    link="/signin"
                />
            </div>
        </div>
	);
}
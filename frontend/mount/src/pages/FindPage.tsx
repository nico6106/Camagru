import UserNotSignedIn from '../components/auth/UserNotSignedIn';
import TitleSmall from '../components/elems/TitleSmall';
import TramePage from '../components/elems/TramePage';
import { useUserContext } from '../context/UserContext';

function FindUserPage() {
	const { user } = useUserContext();

    return user ? (
        <TramePage>
			<TitleSmall text={'Find your next match here !'} space={'1'} />
        </TramePage>
    ) : (<UserNotSignedIn />);

}

export default FindUserPage;

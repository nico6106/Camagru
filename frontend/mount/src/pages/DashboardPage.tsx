import UserNotSignedIn from '../components/auth/UserNotSignedIn';
import TitleSmall from '../components/elems/TitleSmall';
import TramePage from '../components/elems/TramePage';
import { useUserContext } from '../context/UserContext';

function DashboardPage() {
    const { user } = useUserContext();
    return user ? (
        <TramePage>
            <TitleSmall text="Dashboard" />
        </TramePage>
    ) : (<UserNotSignedIn />);
}

export default DashboardPage;

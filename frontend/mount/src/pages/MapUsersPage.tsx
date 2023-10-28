import UserNotSignedIn from "../components/auth/UserNotSignedIn";
import TitleSmall from "../components/elems/TitleSmall";
import TramePage from "../components/elems/TramePage";
import ShowMap from "../components/map/ShowMap";
import { useUserContext } from "../context/UserContext";

function MapUsersPage() {
	const { user } = useUserContext();

	return user ? (
        <TramePage>
            <TitleSmall text={'See users around you !'} space={'1'} />

		<ShowMap />
        </TramePage>
    ) : (
        <UserNotSignedIn />
    );
}

export default MapUsersPage;
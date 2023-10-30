import { useParams } from 'react-router-dom';
import UserNotSignedIn from '../components/auth/UserNotSignedIn';
import TramePage from '../components/elems/TramePage';
import { useUserContext } from '../context/UserContext';
import { useEffect, useState } from 'react';
import { RetourType } from '../types/response';
import { UserShort } from '../shared/userExport';
import PageTitleOneText from '../components/elems/PageTitleOneText';
import { SuccessMsg } from '../shared/errors';
import GetListUsers from '../components/backend/GetListUsers';
import ShowListUsers from '../components/profile/ShowUserList';

function DetailsUserListsPage() {
    const { user } = useUserContext();
	const { option } = useParams();
	const [userShort, setUserShort] = useState<UserShort[] | null>(null);
	const [idUser, setIdUser] = useState<number>(-1)
	const [optionOk, setOptionOk] = useState<string>('');
	const dataCheck: string[] = ['viewed', 'viewed_by', 'likes', 'liked_by', 'matches'];

	useEffect(() => {
		setId();
		if (!option || !dataCheck.includes(option))
			return ;
		else
			setOptionOk(option);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		setId();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	useEffect(() => {
		setId();
		if (!option || !dataCheck.includes(option))
			return ;
		else
			setOptionOk(option);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [option])

	useEffect(() => {
		getUserInfo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [idUser])

	function setId() {
		if (user && 1) {
			// const newId = parseInt(id)
			// if (!isNaN(newId) && newId > 0) {
				setIdUser(user.id)
			// }
		}
		else if (user) {
			setIdUser(user.id)
		}
	}

	async function getUserInfo() {
		if (!(idUser > 0)) return ;
		const retour: RetourType | null = await GetListUsers(idUser, optionOk);
		console.log(retour)
		if (!retour) {
			setUserShort(null)
			return ;
		}
		if (retour.message === SuccessMsg && retour.userShort) {
			setUserShort(retour.userShort);
			console.log(retour.userShort)
		}
		else
			setUserShort(null);
	}

	
    return user ? (userShort ? (
		<TramePage>
			
			<ShowListUsers option={optionOk} userShort={userShort} />
			
        </TramePage>
	) : (<PageTitleOneText
		title="User not found"
		textBody="It seems we couldn't found this user."
	/>)
    ) : (<UserNotSignedIn />);
}

export default DetailsUserListsPage;

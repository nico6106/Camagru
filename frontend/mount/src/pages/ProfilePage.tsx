import { useParams } from 'react-router-dom';
import UserNotSignedIn from '../components/auth/UserNotSignedIn';
import TitleSmall from '../components/elems/TitleSmall';
import TramePage from '../components/elems/TramePage';
import ImageCarrousel from '../components/profile/ImageCarrousel';
import { useUserContext } from '../context/UserContext';
import { useEffect, useState } from 'react';
import { RetourType } from '../types/response';
import { UserExport } from '../shared/userExport';
import PageTitleOneText from '../components/elems/PageTitleOneText';
import GetUser from '../components/backend/GetUser';
import { SuccessMsg } from '../shared/errors';
import UserInfo from '../components/profile/UserInfo';

function ProfilePage() {
    const { user } = useUserContext();
	const { id } = useParams();
	const [retour, setRetour] = useState<RetourType | null>(null);
	const [userM, setUserM] = useState<UserExport | null>(null);
	const [idUser, setIdUser] = useState<number>(-1)
	
	useEffect(() => {
		setId();
	}, [])

	useEffect(() => {
		setId();
	}, [user])

	useEffect(() => {
		setId();
	}, [id])

	useEffect(() => {
		getUserInfo();
	}, [idUser])

	function setId() {
		if (user && id) {
			const newId = parseInt(id)
			if (!isNaN(newId) && newId > 0) {
				setIdUser(newId)
			}
		}
		else if (user) {
			setIdUser(user.id)
		}
	}

	async function getUserInfo() {
		if (!(idUser > 0)) return ;
		const retour: RetourType | null = await GetUser(idUser);
		console.log(retour)
		if (!retour) {
			setUserM(null)
			return ;
		}
		if (retour.message === SuccessMsg && retour.userM) {
			setUserM(retour.userM);
			console.log(retour.userM)
		}
		else
			setUserM(null);
	}

    return user ? (userM ? (
		<TramePage>
			
            <TitleSmall text="Profile" space='1' />

			<div className="grid grid-rows-4 grid-cols-4 gap-1">
				<div className="row-start-1 row-end-4 col-span-3 border">
					<ImageCarrousel pictures={userM.pictures} />
				</div>
				<div className="row-start-1 row-end-6 col-span-1 border">1</div>
				<div className="row-start-4 row-end-6 col-span-3 border">
					<UserInfo user={userM} />
				</div>
			</div>
			
			
        </TramePage>
	) : (<PageTitleOneText
		title="User not found"
		textBody="It seems we couldn't found this user."
	/>)
    ) : (<UserNotSignedIn />);
}

export default ProfilePage;

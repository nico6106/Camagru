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
import UserOptionProfile from '../components/profile/UserOptionsProfile';

function ProfilePage() {
    const { user } = useUserContext();
	const { id } = useParams();
	const [userM, setUserM] = useState<UserExport | null>(null);
	const [idUser, setIdUser] = useState<number>(-1)
	const [liked, setLiked] = useState<boolean>(false);
	const [showReported, setShowReported] = useState<boolean>(true);
	const [visible, setVisible] = useState<string>('carousel-2.svg')
	
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
				setIdUser(newId);
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
		if (retour && retour.message === SuccessMsg && retour.userM) {
			setUserM(retour.userM);
			setVisible(retour.userM.profile_picture);
			if (retour.userReported)
				setShowReported(!retour.userReported);
			if (retour.userLiked)
				setLiked(retour.userLiked);
		}
		else {
			setUserM(null);
			setLiked(false);
		}
	}

    return user ? (userM ? (
		<TramePage>
			
            <TitleSmall text="Profile" space='1' />

			<div className="grid grid-rows-3 grid-cols-4 gap-1 border">
				<div className="row-start-1 row-end-4 col-span-3 border">
					<ImageCarrousel pictures={userM.pictures} visible={visible} setVisible={setVisible} />
				</div>
				<div className="row-start-1 row-end-4 col-span-1 border">
					<UserOptionProfile userM={userM} liked={liked} setLiked={setLiked} showReported={showReported} setShowReported={setShowReported} />
				</div>
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

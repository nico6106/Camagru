import { Link } from "react-router-dom";
import { UserExport } from "../../shared/userExport"
import { useUserContext } from "../../context/UserContext";
import axios from "axios";
import { SuccessMsg } from "../../shared/errors";
import ShowAlert from "../elems/ShowAlert";
import { useState } from "react";
import ShowFameUser from "./ShowFameUser";
import Button from "../elems/Button";

type Prop = {
	userM: UserExport;
	liked: boolean;
	setLiked: any;
	showReported: boolean;
	setShowReported: any
}

function UserOptionProfile({ userM, liked, setLiked, showReported, setShowReported }: Prop) {
	const { user } = useUserContext();
	const [alertMsg, setAlertMsg] = useState<string>('');
	const [showAlert, setShowAlert] = useState<boolean>(true);
	

	function handleOnClick(event: any) {
		event.preventDefault();
		execBackend();
	}

	function handleOnReportUser(event: any) {
		event.preventDefault();
		execBackendReportUser();
		setShowReported(false);
	}

	async function execBackend() {
		try {
			const typeRequest: string = liked ? 'unlike' : 'like'
			const response = await axios.get(
				`http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/${typeRequest}/${userM.id}`,
				{
					withCredentials: true,
				},
			);
			console.log(response.data);
			if (response.data.message === SuccessMsg) {
				if (liked)
					setLiked(false);
				else
					setLiked(true);
				setShowAlert(false);
			}
			else {
				setAlertMsg(response.data.error);
				setShowAlert(true);
			}
		} catch (error) {
			//to handle ?
			return null;
		}
	}

	async function execBackendReportUser() {
		try {
			const response = await axios.get(
				`http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/report/${userM.id}`,
				{
					withCredentials: true,
				},
			);
			console.log(response.data);
			if (response.data.message === SuccessMsg) {
				setShowAlert(false);
			}
			else {
				setAlertMsg(response.data.error);
				setShowAlert(true);
			}
		} catch (error) {
			//to handle ?
			return null;
		}
	}

	return user && (<>
	{alertMsg !== '' && showAlert && <ShowAlert textAlert={alertMsg} show={showAlert} setShow={setShowAlert} />}
	<div className="grid grid-rows-6 grid-flow-col gap-5">
		<div>Fame: <ShowFameUser userM={userM} /></div>
		{userM.fake_account > 0 && userM.id !== user.id && <div className="italic">User reported</div>}
		{userM.id === user.id && (<>
			<div><Link to='/profile/option/viewed_by/'>Your visitors</Link></div>
			<div><Link to='/profile/option/viewed'>Profiles you visited</Link></div>
			<div><Link to='/profile/option/liked_by'>Who likes you</Link></div>
			<div><Link to='/profile/option/matches'>Your matches</Link></div>
			<div><Link to='/profile/option/likes'>Who you like</Link></div>
			</>)}
		{userM.id !== user.id && (<>
			<div><ButtonLike liked={liked} handleOnClick={handleOnClick} /></div>
			{showReported &&<div><Button text='Report user' onClick={handleOnReportUser} /></div>}
			</>)}
	</div></>)
}

type PropButtonLike = {
	liked: boolean;
	handleOnClick: any;
}

function ButtonLike({ liked, handleOnClick }: PropButtonLike) {
	const text: string = liked ? 'Unlike profile' : 'Like profile';
	const style: string = !liked ? 
		'focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' 
		: 'focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900';
	return (
		<button 
			type="button"
			onClick={handleOnClick}
			className={style}>
				{text}
		</button>
	)
}

// focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900

export default UserOptionProfile
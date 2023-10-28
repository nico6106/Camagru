import { Link } from "react-router-dom";
import { UserExport } from "../../shared/userExport"
import { useUserContext } from "../../context/UserContext";
import axios from "axios";
import { SuccessMsg } from "../../shared/errors";
import ShowAlert from "../elems/ShowAlert";
import { useEffect, useState } from "react";
import ShowFameUser from "./ShowFameUser";
import Button from "../elems/Button";
import ShowIsOnline from "./ShowIsOnline";

type Prop = {
	userM: UserExport;
	liked: boolean;
	setLiked: any;
	showReported: boolean;
	setShowReported: any
	blocked: boolean;
	setBlocked: any;
}

function UserOptionProfile({ userM, liked, setLiked, showReported, setShowReported, blocked, setBlocked }: Prop) {
	const { user } = useUserContext();
	const [alertMsg, setAlertMsg] = useState<string>('');
	const [blockedMsg, setBlockedMsg] = useState<string>('Block user');
	const [showAlert, setShowAlert] = useState<boolean>(true);
	
	useEffect(() => {
		blocked && setBlockedMsg('Unblock user');
	}, []);

	function handleOnClick(event: any) {
		event.preventDefault();
		execBackend();
	}

	function handleOnReportUser(event: any) {
		event.preventDefault();
		execBackendReportUser();
		setShowReported(false);
	}

	function handleOnBlockUser(event: any) {
		event.preventDefault();
		execBackendBlockUser();
		setBlocked(!blocked);
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

	async function execBackendBlockUser() {
		try {
			const blockedRequest: string = blocked ? 'unblock' : 'block'
			const response = await axios.get(
				`http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/${blockedRequest}/${userM.id}`,
				{
					withCredentials: true,
				},
			);
			console.log(response.data);
			if (response.data.message === SuccessMsg) {
				if (blocked) {
					setBlockedMsg('Block user')
					setBlocked(false);
				}
				else {
					setBlockedMsg('Unblock user')
					setBlocked(true);
				}
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
	<div className="grid grid-rows-6 grid-flow-col gap-5 overflow-y-auto bg-gray-50"> 
		<div><><ShowFameUser userM={userM} /></> </div>
		{userM.fake_account > 0 && userM.id !== user.id && (
			<div><ShowUserReported /></div>
		)}
		{userM.id === user.id && (<>
			<div><LinkElem to='/profile/option/viewed_by/'>Your visitors</LinkElem></div>
			<div><LinkElem to='/profile/option/viewed/'>Profiles you visited</LinkElem></div>
			<div><LinkElem to='/profile/option/liked_by/'>Who likes you</LinkElem></div>
			<div><LinkElem to='/profile/option/matches/'>Your matches</LinkElem></div>
			<div><LinkElem to='/profile/option/likes/'>Who you like</LinkElem></div>
			</>)}
		{userM.id !== user.id && (<>
			<div>
				<LinkElem>
					<ShowIsOnline userId={userM.id} initStatus={userM.connected} lastSeen={userM.last_connection} />
				</LinkElem>
			</div>
			<div>
				<LinkElem>
					<ShowUserRelation myId={user.id} liked={liked} userM={userM} />
				</LinkElem>
			</div>
			<div>
				{/* <LinkElem handleOnClick={handleOnClick} >{liked}</LinkElem> */}
				<ButtonLike liked={liked} handleOnClick={handleOnClick} />
			</div>
			{showReported && (<div>
				<LinkElem handleOnClick={handleOnReportUser} >Report user</LinkElem>
			</div>)}
			<div>
				<LinkElem handleOnClick={handleOnBlockUser} >{blockedMsg}</LinkElem>
			</div>
			</>)}
	</div>
	</>)
}

type PropRelationUser = {
	myId: number;
	liked: boolean;
	userM: UserExport;
}
//show if user like me / matched with me
function ShowUserRelation({ myId, liked, userM }: PropRelationUser) {
	const [showMsg, setMsg] = useState<string>('');
	const [userLikeMe, setUserLikeMe] = useState<boolean>(false);
	
	useEffect(() => {
		for (const elem of userM.likes) {
			if (elem.id === myId) {
				setUserLikeMe(true);
				break ;
			}
		}
	}, []);

	useEffect(() => {
		if (liked === true && userLikeMe === true)
			setMsg('You matched !')
		else if (userLikeMe === true) {
			const text: string = `${userM.first_name} likes you`
			setMsg(text)
		}
		else if (liked === true)
			setMsg('Be patient !')
		else
			setMsg('Like first !')
	}, [userLikeMe, liked])
		
	return (<>{showMsg}</>);
}

function ShowUserReported() {
	return (<>
	<div className='grid grid-cols-4 pl-2 pb-2 border-b border-gray-200'>
			<div className='col-span-1'>
				<svg className="flex-shrink-0 w-5 h-5 text-red-500 transition duration-75 dark:text-red-400 group-hover:text-red-900 dark:group-hover:text-red" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
					<path d="M10 0a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 18.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM11 6.5h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1z"/>
				</svg>
			</div>
			<div className='col-span-3'>
				User reported
			</div>
	</div>
</>)
}
/* <Button text='Report user' onClick={handleOnReportUser} /> */
/* <Button text={blockedMsg} onClick={handleOnBlockUser} /> */

type PropLinkElem = {
	to?: string;
	hover?: boolean;
	children?: any;
	handleOnClick?: any;
}
function LinkElem({ to, hover=true, children, handleOnClick }: PropLinkElem) {
	const styleP: string = `flex items-center text-gray-900 rounded-lg ${hover && 'hover:bg-gray-300'} group font-medium`
	return (<div className='flex flex-row pb-4 border-b border-gray-200'>
		<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 10 16">
			<path d="M3.414 1A2 2 0 0 0 0 2.414v11.172A2 2 0 0 0 3.414 15L9 9.414a2 2 0 0 0 0-2.828L3.414 1Z"/>
		</svg>

		<p className={styleP}>
			{to && (
				<Link to={to}>
					<span className="flex-1 ml-3 whitespace-nowrap space-y-2">{children}</span>
				</Link>
			)}
			{handleOnClick && (
				<span 
					className="flex-1 ml-3 whitespace-nowrap space-y-2"
					onClick={handleOnClick}
				>
					{children}
				</span>
			)}
			{!to && !handleOnClick && (
				<span className="flex-1 ml-3 whitespace-nowrap space-y-2">{children}</span>
			)}
		</p>
		</div>
	)
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
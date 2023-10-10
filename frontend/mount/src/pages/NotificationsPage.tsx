import { useEffect, useState } from "react";
import UserNotSignedIn from "../components/auth/UserNotSignedIn";
import TitleSmall from "../components/elems/TitleSmall";
import TramePage from "../components/elems/TramePage";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import { SuccessMsg } from "../shared/errors";
import Pagination from "../components/elems/Pagination";
import { Link } from "react-router-dom";
import { ShowDate } from "../components/profile/ShowUserList";

type FormatNotif = {
	idUser: number;
	picture: string;
	text: string;
	date: Date;
}

function NotificationsPage() {
	const { user } = useUserContext();
	const [notifs, setNotifs] = useState<FormatNotif[] | null>();
	const [nbNotif, setNbNotif] = useState<number>(0);
	const [nbTotal, setNbTotal] = useState<number>(0);

	const [nbStart, setNbStart] = useState<number>(1);
	const [nbEnd, setNbEnd] = useState<number>(1);

	const nbPerPage: number = 20;

	useEffect(() => {
        execBackend();
    }, []);

	async function execBackend() {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/notif/`,
                {
                    withCredentials: true,
                },
            );
            console.log(response.data);
            if (response.data.message === SuccessMsg) {
                setNotifs(response.data.notifs);
				setNbNotif(response.data.value);
				const totalTmp: number = response.data.notifs.length;
				setNbTotal(totalTmp)
				if (totalTmp > 0) {
					if (totalTmp > nbPerPage)
						setNbEnd(nbPerPage);
					else
						setNbEnd(totalTmp);
				}
            } else {
				setNotifs(null);
                setNbNotif(0);
            }
        } catch (error) {
            //to handle ?
            return null;
        }
    }

	return user ? (<>
		<TramePage>
			
            <TitleSmall text="Notifications" space='1' />

			<div className="pt-5 grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{notifs && notifs.map((elem, index) => (
                            (index >= nbStart - 1 && index <= nbEnd - 1) && <IndivNotif notif={elem} seen={index < nbNotif} key={index} />
                        ))}
				
			</div>

			<div className='pt-5'>
				<Pagination nbStart={nbStart} nbEnd={nbEnd} nb_tot={nbTotal} nbPerPage={nbPerPage} setNbStart={setNbStart} setNbEnd={setNbEnd} />
			</div>

		</TramePage>
			</>) : (<UserNotSignedIn />);
}

type PropIndivNotif = {
    notif: FormatNotif;
	seen: boolean;
};
function IndivNotif({ notif, seen }: PropIndivNotif) {
	const link: string = notif.picture !== '' ? `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image/${notif.picture}` : '/carousel-2.svg';
    const linkTo: string = `/profile/${notif.idUser}`
	const formatDiv: string = `flex items-center space-x-4 border ${seen && 'bg-yellow-300'}`
	return (
            <div className={formatDiv}>
                <div className="flex-shrink-0">
                    <img
                        className="w-8 h-8 rounded-full"
                        src={link}
                        alt="profile picture"
                    />
                </div>
                <div className="flex-1 min-w-0">
					<Link to={linkTo} >
						<p className="text-sm font-medium text-gray-900 truncate hover:bold">
							{notif.text}
						</p>
					</Link>
                    <p className="text-sm text-gray-500 truncate">
						{ShowDate(notif.date)}
                    </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    {/*possible to add info here*/}
                </div>
            </div>
    );
}

export default NotificationsPage;
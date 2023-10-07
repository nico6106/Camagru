import { useEffect, useState } from 'react';
import { UserShort } from '../../shared/userExport';
import TitleSmall from '../elems/TitleSmall';
import { Link } from 'react-router-dom';
import Pagination from '../elems/Pagination';

type Prop = {
    option: string;
    userShort: UserShort[];
};
function ShowListUsers({ option, userShort }: Prop) {
	const [nbStart, setNbStart] = useState<number>(1);
	const [nbEnd, setNbEnd] = useState<number>(1);

	const nbPerPage: number = 10;
	const nbTotal: number = userShort.length;

	useEffect(() => {
		if (userShort.length > 0) {
			if (userShort.length > nbPerPage)
				setNbEnd(nbPerPage);
			else
				setNbEnd(userShort.length);
		}
	}, []);

    const dataCheck: string[] = [
        'viewed',
        'viewed_by',
        'likes',
        'liked_by',
        'match',
    ];
	const typeEvent: string[] = [
        'viewed',
        'viewed by',
        'likes',
        'liked by',
        'match',
    ];
    const title: string[] = [
        'Profiles you viewed',
        'People that looked at your profile',
        'Profiles you liked',
        'People that liked your profile',
        'Your matchs',
    ];
	const textCaseEmpty: string[] = [
        'You did not view any profile yet, please consider looking for other fellow students using the research page',
        'No student looked at your profile yet. You can likes people so that they may see you and check your profile',
        'You did not like any profile yet, please consider liking other fellow students using the research page ',
        'No student liked your profile yet. You can likes people so they might like you back !',
        'You do not have any match yet',
    ];
    const dataIndex: number = dataCheck.findIndex((elem) => elem === option);

    return (
        <>
            <TitleSmall text={title[dataIndex]} space="1" />
			{userShort.length === 0 && <div className='pt-5'>{textCaseEmpty[dataIndex]}</div>}
			<div className="pt-5 grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{userShort.map((elem, index) => (
                            (index >= nbStart - 1 && index <= nbEnd - 1) && <IndivUser userShort={elem} key={index} />
                        ))}
				
			</div>
			<div className='pt-5'>
				<Pagination nbStart={nbStart} nbEnd={nbEnd} nb_tot={nbTotal} nbPerPage={nbPerPage} setNbStart={setNbStart} setNbEnd={setNbEnd} />
			</div>
        </>
    );
}

type PropIndivUser = {
    userShort: UserShort;
};
function IndivUser({ userShort }: PropIndivUser) {
	const link: string = userShort.profile_picture !== '' ? `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image/${userShort.profile_picture}` : '/carousel-2.svg';
    const linkTo: string = `/profile/${userShort.id}`
	return (
            <div className="flex items-center space-x-4 border">
                <div className="flex-shrink-0">
                    <img
                        className="w-8 h-8 rounded-full"
                        src={link}
                        alt="Neil image"
                    />
                </div>
                <div className="flex-1 min-w-0">
					<Link to={linkTo} >
						<p className="text-sm font-medium text-gray-900 truncate hover:bold">
							{userShort.first_name} {userShort.last_name},{' '}
							{userShort.age}
						</p>
					</Link>
                    <p className="text-sm text-gray-500 truncate">
						{ShowDate(userShort.date)}
                    </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    {/*possible to add info here*/}
                </div>
            </div>
    );
}

function ShowDate(dateUser: Date) {
	const dateShow: Date = new Date(dateUser);
	return (<>
		{dateShow.getFullYear()}
		-
		{dateShow.getMonth() + 1}
		-
		{dateShow.getDate() <= 10 && '0'}{dateShow.getDate()}
		{' at '} 
		{dateShow.getHours()}
		:
		{dateShow.getMinutes()}
		</>)
}

export default ShowListUsers;

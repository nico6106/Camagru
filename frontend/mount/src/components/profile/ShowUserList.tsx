import { UserShort } from '../../shared/userExport';
import TitleSmall from '../elems/TitleSmall';

type Prop = {
    option: string;
    userShort: UserShort[];
};
function ShowListUsers({ option, userShort }: Prop) {
    const dataCheck: string[] = [
        'viewed',
        'viewed_by',
        'likes',
        'liked_by',
        'match',
    ];
    const title: string[] = [
        'Profiles you viewed',
        'People that looked at your profile',
        'Profiles you liked',
        'People that liked your profile',
        'Your matchs',
    ];
    const dataIndex: number = dataCheck.findIndex((elem) => elem === option);

    return (
        <>
            <TitleSmall text={title[dataIndex]} space="1" />

            <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8">
                <div className="flow-root">
                    <ul
                        role="list"
                        className="divide-y divide-gray-200"
                    >
                        {userShort.map((elem, index) => (
                            <IndivUser userShort={elem} key={index} />
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

type PropIndivUser = {
    userShort: UserShort;
};
function IndivUser({ userShort }: PropIndivUser) {
	const link: string = userShort.profile_picture !== '' ? `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image/${userShort.profile_picture}` : '/carousel-2.svg';
    return (
        <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                    <img
                        className="w-8 h-8 rounded-full"
                        src={link}
                        alt="Neil image"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                        {userShort.first_name} {userShort.last_name},{' '}
                        {userShort.age}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                        email@windster.com
                    </p>
                </div>
                <div className="inline-flex items-center text-base font-semibold text-gray-900">
                    $320
                </div>
            </div>
        </li>
    );
}

export default ShowListUsers;

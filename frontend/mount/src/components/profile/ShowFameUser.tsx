import { UserExport } from '../../shared/userExport';

type Prop = {
    userM: UserExport;
};
function ShowFameUser({ userM }: Prop) {
	let color: string = '';
	let fame: string = '';
	if (userM.fame_rating <= 3) {
		color = 'bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500';
		fame = 'Low rated user'
	}
	else if (userM.fame_rating <= 6) {
		color = 'bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400';
		fame = 'Low rated user'
	}
	else if (userM.fame_rating <= 8) {
		color = 'bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400';
		fame = 'Popular user'
	}
	else if (userM.fame_rating <= 10) {
		color = 'bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300';
		fame = 'It\' a star!'
	}
	const styleP: string = `bg-${color}-300 text-${color}-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded inline-flex items-center justify-center`
    
	return (
        <>
            <span className={color}>
                {fame}
            </span>
        </>
    );
}

export default ShowFameUser;

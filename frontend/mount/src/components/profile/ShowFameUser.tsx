import { UserExport } from '../../shared/userExport';

type Prop = {
    userM: UserExport;
};
function ShowFameUser({ userM }: Prop) {
	let color: string = '';
	let fame: string = '';

	if (userM.fame_rating <= 3) {
		color = 'bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-gray-500';
		fame = `Low rated user (${userM.fame_rating})`
	}
	else if (userM.fame_rating <= 6) {
		color = 'bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-blue-400';
		fame = `Low rated user (${userM.fame_rating})`
	}
	else if (userM.fame_rating <= 8) {
		color = 'bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded  border border-green-400';
		fame = `Popular user (${userM.fame_rating})`
	}
	else if (userM.fame_rating <= 10) {
		color = 'bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded 0 border border-yellow-300';
		fame = `It\' a star! (${userM.fame_rating})`
	}
	const styleP: string = `bg-${color}-300 text-${color}-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded inline-flex items-center justify-center`
    
	return (
        <div className='grid grid-cols-4 pl-2 pt-2 pb-2 border-b border-gray-200'>
			<div className='col-span-1'>
			<svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 17 20">
				<path d="M7.958 19.393a7.7 7.7 0 0 1-6.715-3.439c-2.868-4.832 0-9.376.944-10.654l.091-.122a3.286 3.286 0 0 0 .765-3.288A1 1 0 0 1 4.6.8c.133.1.313.212.525.347A10.451 10.451 0 0 1 10.6 9.3c.5-1.06.772-2.213.8-3.385a1 1 0 0 1 1.592-.758c1.636 1.205 4.638 6.081 2.019 10.441a8.177 8.177 0 0 1-7.053 3.795Z"/>
			</svg>
			</div>
			<div className='col-span-3'>
            <span className={color}>
                {fame}
            </span>
			</div>
        </div>
    );
}

export default ShowFameUser;

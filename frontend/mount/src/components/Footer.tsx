import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-white rounded-lg shadow m-4 dark:bg-gray-800">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
                    © 2023{' '}
                    <Link to='/' className='hover:underline'>
                        Matcha Love™
					</Link>
                    . All Rights Reserved.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
						<Link to='/profile' className='mr-4 hover:underline md:mr-6'>
                            Your Profile
                        </Link>
                    </li>
                    <li>
                        <Link to='/find' className='mr-4 hover:underline md:mr-6'>
                            Browsing
                         </Link>
                    </li>
                    <li>
                        <Link to='/settings' className='mr-4 hover:underline md:mr-6'>
                            Settings
                         </Link>
                    </li>
                </ul>
            </div>
        </footer>
    );
}

export default Footer;

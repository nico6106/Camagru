import { Link, useParams } from 'react-router-dom';
import TramePage from '../components/elems/TramePage';
import TitleSmall from '../components/elems/TitleSmall';
import { useEffect, useState } from 'react';
import { useUserContext } from '../context/UserContext';
import UserNotSignedIn from '../components/auth/UserNotSignedIn';

function ViewImage() {
	const { user } = useUserContext();
    const { id } = useParams();
	const [image, setImage] = useState<string>('');

	useEffect(() => {
		if (id && id !== undefined) {
			setImage(id);
		}
	}, [id]);

	useEffect(() => {
	}, [image])

	const link: string = image !== '' ? `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image/${image}` : '/carousel-2.svg';

    return user ? (
        <TramePage>
            <TitleSmall text="View image" space='1' />

			<div className='flex justify-center pt-5'>
				<div className='aspect-w-16 aspect-h-9'>
					<img src={link} className="" alt="User image" />
				</div>
			</div>
			

        </TramePage>
    ) : (<UserNotSignedIn />);
}

export default ViewImage;

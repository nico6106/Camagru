import { useParams } from 'react-router-dom';
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id]);

	const link: string = image !== '' ? `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image/${image}` : '/carousel-2.svg';
	const altImage: string = `User image-${image}`;
    return user ? (
        <TramePage>
            <TitleSmall text="View image" space='1' />

			<div className='flex justify-center pt-5'>
				<div className='aspect-w-16 aspect-h-9'>
					<img src={link} className="" alt={altImage} />
				</div>
			</div>
			

        </TramePage>
    ) : (<UserNotSignedIn />);
}

export default ViewImage;

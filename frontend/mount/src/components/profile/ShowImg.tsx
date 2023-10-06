import axios from "axios";
import { SuccessMsg } from "../../shared/errors";

type Prop = {
    picture: string; //picture to show
	pictures: string[]; //all pictures
    mainPicture: string; //main picture
	setPictures: any; 
	setMainPicture: any;
	setError: any;
};

function ShowImg({ picture, pictures, mainPicture, setPictures, setMainPicture, setError }: Prop) {
    const link: string = `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image/${picture}`;

	async function deletePictureBackend() {
		try {
            const response = await axios.delete(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image/${picture}`,
                {
                    withCredentials: true,
                },
            );
            console.log(response.data);
            if (response.data.message === SuccessMsg) {
                setMainPicture(response.data.info)
				setError('');
            } else {
				setError(response.data.error);
                //false
            }
            return response.data;
        } catch (error) {
            //to handle ?
        }
	}

	async function changeProfilePictureBackend() {
		try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/setimage/${picture}`,
                {
                    withCredentials: true,
                },
            );
            console.log(response.data);
            if (response.data.message === SuccessMsg) {
                setMainPicture(response.data.info);
				setError('');
            } else {
				setError(response.data.error);
            }
            return response.data;
        } catch (error) {
            //to handle ?
        }
	}

	function handleOnSetMain(event: any) {
        event.preventDefault();
		changeProfilePictureBackend();
    }
	function handleOnDeleteImg(event: any) {
        event.preventDefault();
        deletePictureBackend();
		const newPicturesUser: string[] = pictures.filter((elem) => elem !== picture)
		setPictures(newPicturesUser);
    }
    return (
        <div className="relative w-20">
            <img
                className="w-20 h-20 object-cover"
                src={link}
                alt="image description"
            />
            <div className="group absolute top-0 left-0 w-full h-full opacity-0 transition-opacity hover:opacity-100">
                {picture !== mainPicture && (
                    <label className="block text-sm font-semibold py-1 text-gray-900 dark:text-white w-full text-center bg-white bg-opacity-60 cursor-pointer">
                        Set main
                        <button className="hidden" onClick={handleOnSetMain}></button>
                    </label>
                )}
                <label className="block text-sm font-semibold py-1 text-gray-900 dark:text-white absolute bottom-0 left-0 w-full text-center bg-white bg-opacity-60 cursor-pointer">
                    Delete
                    <button className="hidden" onClick={handleOnDeleteImg}></button>
                </label>
            </div>
        </div>
    );
}

export default ShowImg;

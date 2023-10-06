import React, { useState, ChangeEvent, useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../../context/UserContext';
import { SuccessMsg } from '../../shared/errors';

type Prop = {
    pictures: string[];
	setPictures: any;
	setMainPicture: any;
	setError: any;
};

function PhotoUploader({ pictures, setPictures, setMainPicture, setError }: Prop) {
    const [imageUpdate, setImageUpdate] = useState<string | null>(null);
    const { user, updateUser } = useUserContext();

    async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
        const selectedImage = e.target.files?.[0];
        if (selectedImage) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageUpdate(reader.result as string);
            };
            reader.readAsDataURL(selectedImage);
        }

        if (selectedImage) {
            let formData = new FormData();

            formData.append('image', selectedImage);

            try {
                const response = await axios.post(
                    `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image`,
                    formData,
                    { withCredentials: true },
                );
				if (response.data.message === SuccessMsg) {
					const newListImg = [...pictures, response.data.info];
					setPictures(newListImg);
					setMainPicture(response.data.infobis);
					setError('')
				}
				else {
					setError(response.data.error)
				}
				// info
            } catch {}
        }
    };

    return (
        <div className="relative w-32">
            <label className="">
                Update avatar
               
            </label>
			<input
                    type="file"
                    accept="image/*"
                    className=""
                    onChange={handleImageChange}
                />
        </div>
    );
}

export default PhotoUploader;

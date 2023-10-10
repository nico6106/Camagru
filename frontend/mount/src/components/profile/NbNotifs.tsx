import { useContext, useEffect, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import axios from 'axios';
import { SuccessMsg } from '../../shared/errors';
import { WebsocketContext } from '../../context/WebsocketContext';

function NbNotif() {
	const socket = useContext(WebsocketContext);
    const [nbNotif, setNbNotif] = useState<number>(0);

    useEffect(() => {
        execBackend();

		socket.on('notif', (data: any) => {
			// console.log('message notif ('+nbNotif+') :')
			// console.log(data)
			setNbNotif(prevNbNotif => prevNbNotif + 1);
        });

		socket.on('notif_raz', (data: any) => {
			setNbNotif(0);
        });

        return () => {
			socket.off('notif');
			socket.off('notif_raz');
        };
    }, []);

    async function execBackend() {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/nbnotif/`,
                {
                    withCredentials: true,
                },
            );
            console.log(response.data);
            if (response.data.message === SuccessMsg) {
                setNbNotif(response.data.value);
            } else {
                setNbNotif(0);
            }
        } catch (error) {
            //to handle ?
            return null;
        }
    }

    return nbNotif !== 0 ? (
        <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
            {nbNotif}
        </div>
    ) : (
        <></>
    );
}

export default NbNotif;

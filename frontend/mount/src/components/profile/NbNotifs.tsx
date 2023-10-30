import { useContext, useEffect, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import axios from 'axios';
import { SuccessMsg } from '../../shared/errors';
import { WebsocketContext } from '../../context/WebsocketContext';
import { SocketReceiveMsg } from '../chat/ChatDiscussion';

type Prop = {
    option: 'chat' | 'notif';
};
function NbNotif({ option }: Prop) {
    const socket = useContext(WebsocketContext);
    const { user } = useUserContext();
    const [nbNotif, setNbNotif] = useState<number>(0);
    const [nbChat, setNbChat] = useState<number>(0);

    useEffect(() => {
        execBackend();

        socket.on('notif', (data: any) => {
            setNbNotif((prevNbNotif) => prevNbNotif + 1);
        });

        socket.on('chat2', (data: SocketReceiveMsg) => {
            if (user && data.msg.sender !== user.id)
                setNbChat((prevnbChat) => prevnbChat + 1);
        });

        socket.on('notif_raz', (data: any) => {
            setNbNotif(0);
        });

        socket.on('chat-read2', (data: any) => {
            setNbChat((prevNbChat) =>
                prevNbChat - data.nbRead > 0 ? prevNbChat - data.nbRead : 0,
            );
        });

        return () => {
            socket.off('notif');
            socket.off('notif_raz');
            socket.off('chat2');
            socket.off('chat-read2');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function execBackend() {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/nbnotif/`,
                {
                    withCredentials: true,
                },
            );
            // console.log(response.data);
            if (response.data.message === SuccessMsg) {
                setNbNotif(response.data.value);
                setNbChat(response.data.valueChat);
            } else {
                setNbNotif(0);
                setNbChat(0);
            }
        } catch (error) {
            //to handle ?
            return null;
        }
    }

    return (
        <>
            {option === 'notif' && nbNotif !== 0 && (
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                    {nbNotif}
                </div>
            )}
            {option === 'chat' && nbChat !== 0 && (
                <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -right-2 dark:border-gray-900">
                    {nbChat}
                </div>
            )}
        </>
    );
}

export default NbNotif;

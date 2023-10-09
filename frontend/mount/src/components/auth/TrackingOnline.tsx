import { useContext, useEffect, useState } from 'react';
import { WebsocketContext } from '../../context/WebsocketContext';
import { useUserContext } from '../../context/UserContext';

type TypeTracking = {
    id: number;
    idConnection: string;
};

function TrackingOnline() {
    const socket = useContext(WebsocketContext);
    const { user } = useUserContext();
    const [userObj, setUserObj] = useState<TypeTracking>();

    useEffect(() => {
        setUserObj({
            id: user ? user.id : -1,
            idConnection: socket.id,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            setUserObj({
                id: user ? user.id : -1,
                idConnection: socket.id,
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    useEffect(() => {
        setUserObj({
            id: user ? user.id : -1,
            idConnection: socket.id,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        const interval = setInterval(() => {
            const userObja: TypeTracking = {
                id: user ? user.id : -1,
                idConnection: socket.id,
            }
            socket.emit('ping', userObja);
        }, 1000);

        return () => {
            socket.off('ping');
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userObj]);

    return <></>;
}

export default TrackingOnline;

import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../../context/WebsocketContext";

type Prop = {
	userId: number;
	initStatus: boolean;
	lastSeen: number;
}

type MessageUpdateStatus = {
    idUser: number;
    type: string;
	lastSeen?: number;
}
function ShowIsOnline({ userId, initStatus, lastSeen }: Prop) {
	const socket = useContext(WebsocketContext);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [lastSeenU, setLastSeenU] = useState<number>(0);
	useEffect(() => {
        if (initStatus) {
            setIsConnected(true);
        }
		setLastSeenU(lastSeen);

        socket.on('updateStatus', (data: MessageUpdateStatus) => {
            if (data.idUser === userId) {
                if (data.type === 'disconnect') setIsConnected(false);
                else if (data.type === 'connect') setIsConnected(true);
				if (data.lastSeen) {
					setLastSeenU(data.lastSeen);
				} 
            }
			console.log('message : +userId='+userId)
			console.log(data)
        });

        return () => {
            socket.off('updateStatus');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

	return isConnected ? (<>Online</>) : (<>{ShowDate(lastSeenU)}</>);
}

function ShowDate(dateUser: number) {
	const dateShow: Date = new Date(dateUser);
	return (<>
		{dateShow.getFullYear()}
		-
		{dateShow.getMonth() + 1 < 10 && '0'}{dateShow.getMonth() + 1}
		-
		{dateShow.getDate() < 10 && '0'}{dateShow.getDate()}
		{' at '} 
		{dateShow.getHours() < 10 && '0'}{dateShow.getHours()}
		:
		{dateShow.getMinutes() < 10 && '0'}{dateShow.getMinutes()}
		</>)
}

export default ShowIsOnline;
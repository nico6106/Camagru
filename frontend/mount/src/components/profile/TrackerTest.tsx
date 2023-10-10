import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../../context/WebsocketContext";

type Prop = {
	userId: number;
	initStatus: boolean;
	lastSeen: number;
}

function TrackeurTest() {
	const socket = useContext(WebsocketContext);
	useEffect(() => {

		socket.on('hello', (data: any) => {
			console.log('message :')
			console.log(data)
        });

        return () => {
			socket.off('hello');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

	return (<></>);
}

export default TrackeurTest;
import { useContext, useEffect } from 'react';
import { MsgChatRetour } from '../../shared/chat';
import ChatSendMessage from './ChatSendMessage';
import ChatHistoryMesssages from './ChatHistoryMessages';
import { WebsocketContext } from '../../context/WebsocketContext';

type PropChatDiscussions = {
    currChat: number;
    setAlertMsg: any;
	chat: MsgChatRetour[];
	setChat: any;
};

export type SocketReceiveMsg = {
	idChat: number;
	msg: MsgChatRetour;
};

function ChatShowMessages({
    currChat,
    setAlertMsg,
	chat,
	setChat,
}: PropChatDiscussions) {
	const socket = useContext(WebsocketContext);

    useEffect(() => {

		//socket
		socket.on('chat', (data: SocketReceiveMsg) => {
			console.log(data)
			console.log('step currChat='+currChat)
			
            if (data.idChat === currChat) {
				setChat((prevState: MsgChatRetour[]) => [...prevState, data.msg]);
            }
        });

		return () => {
            socket.off('chat');
        };
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currChat]);

    
    return chat ? (
		<div className='h-full '>
			<div className="h-5/6 overflow-y-auto scrolling-touch overflow-clip pl-4 bg-gray-100 border">
				<ChatHistoryMesssages chats={chat} />
			</div>
			<div className="h-1/6">
				<ChatSendMessage currChat={currChat} />
			</div>
		</div>
	) : <div className="flex-1 overflow-y-auto p-4 bg-gray-100 border">Select a chat</div>;
}

export default ChatShowMessages;

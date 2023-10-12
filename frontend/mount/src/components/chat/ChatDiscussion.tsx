import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { SuccessMsg } from '../../shared/errors';
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

type SocketReceiveMsg = {
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
			// console.log(chat)
			// if (!chat) return ;
			console.log('step currChat='+currChat)
			
            if (data.idChat === currChat) {
                // const newList: MsgChatRetour[] = chat;
				// newList.push(data.msg);
				setChat((prevState: MsgChatRetour[]) => [...prevState, data.msg]);
            }
			console.log('message : +userId=')
			console.log(data)
        });

		return () => {
            socket.off('chat');
        };
    }, []);

    
    return chat ? (
		<div className='h-full'>
			<div className="h-5/6 overflow-y-auto p-4 bg-gray-100 border">
				<ChatHistoryMesssages chats={chat} />
			</div>
			<div className="h-1/6">
				<ChatSendMessage currChat={currChat} />
			</div>
		</div>
	) : <div className="flex-1 overflow-y-auto p-4 bg-gray-100 border">Select a chat</div>;
}

export default ChatShowMessages;

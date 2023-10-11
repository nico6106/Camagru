import axios from 'axios';
import { useEffect, useState } from 'react';
import { SuccessMsg } from '../../shared/errors';
import { MsgChatRetour } from '../../shared/chat';
import ChatSendMessage from './ChatSendMessage';
import ChatHistoryMesssages from './ChatHistoryMessages';

type PropChatDiscussions = {
    currChat: number;
    setCurrChat: any;
    setAlertMsg: any;
};
function ChatDiscussion({
    currChat,
    setCurrChat,
    setAlertMsg,
}: PropChatDiscussions) {
    const [chat, setChat] = useState<MsgChatRetour[] | null>(null);

    useEffect(() => {
        if (currChat !== 0) execBackendGetOneChat();
    }, []);

    useEffect(() => {
        if (currChat !== 0) execBackendGetOneChat();
    }, [currChat]);

    async function execBackendGetOneChat() {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/${currChat}`,
                {
                    withCredentials: true,
                },
            );
            console.log(response.data);
            if (response.data.message === SuccessMsg) {
                setChat(response.data.chats);
                setAlertMsg(null);
            } else {
                setAlertMsg(response.data.error);
                setChat(null);
            }
        } catch (error) {
            //to handle ?
            return null;
        }
    }

    return chat ? (
		<div className='h-full'>
			<div className="h-5/6 overflow-y-auto p-4 bg-gray-100 border">
				<ChatHistoryMesssages chats={chat} />
			</div>
			<div className="h-1/6">
				<ChatSendMessage />
			</div>
		</div>
	) : <div className="flex-1 overflow-y-auto p-4 bg-gray-100 border">Select a chat</div>;
}

export default ChatDiscussion;

import { useEffect, useState } from 'react';
import UserNotSignedIn from '../components/auth/UserNotSignedIn';
import TitleSmall from '../components/elems/TitleSmall';
import { useUserContext } from '../context/UserContext';
import ChatShowMessages from '../components/chat/ChatDiscussion';
import { MsgChatRetour } from '../shared/chat';
import ChatFriends from '../components/chat/ChatFriends';
import axios from 'axios';
import { SuccessMsg } from '../shared/errors';

function ChatPage() {
    const { user } = useUserContext();
	const [currChat, setCurrChat] = useState<number>(0);
	const [chat, setChat] = useState<MsgChatRetour[] | null>(null);

	useEffect(() => {
        if (currChat !== 0) execBackendGetOneChat();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currChat]);

	async function execBackendGetOneChat() {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/${currChat}`,
                {
                    withCredentials: true,
                },
            );
            // console.log(response.data);
            if (response.data.message === SuccessMsg) {
                setChat(response.data.chats);
            } else {
                setChat(null);
            }
        } catch (error) {
            //to handle ?
            return null;
        }
    }

    return user ? (
        <>
            {/* <TramePage> */}
                <TitleSmall text="Chat" space="1" />

				<div className="h-[75vh] flex flex-col border md:flex-row">
					<div className="w-full md:w-1/4 bg-gray-200 overflow-x md:overflow-auto">
                        <p className='font-bold test-xl px-3 pt-1 border-b border-gray-300'>Friends</p>
						<ChatFriends setCurrChat={setCurrChat} />
					</div>
					<div className="relative h-full md:h-full md:w-3/4 overflow-hidden">
						{chat && <ChatShowMessages 
							currChat={currChat}
							chat={chat}
							setChat={setChat}
							/>
						}
					</div>
				</div>

            {/* </TramePage> */}
        </>
    ) : (
        <UserNotSignedIn />
    );
}

export default ChatPage;

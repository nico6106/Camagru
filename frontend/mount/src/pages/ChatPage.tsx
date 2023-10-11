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
	const [alert, setAlertMsg] = useState<string | null>(null);

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

    return user ? (
        <>
            {/* <TramePage> */}
                <TitleSmall text="Chat" space="1" />

				<div className="h-full  flex border">
					<div className="w-1/4 bg-gray-200 p-4">Friends
						<ChatFriends setCurrChat={setCurrChat} setAlertMsg={setAlertMsg} />
					</div>
					<div className="w-3/4 flex flex-col">Discussion
					{chat && <ChatShowMessages 
							currChat={currChat}
							setAlertMsg={setAlertMsg}
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

{/* <div className="flex flex-row">
					<div className="basis-1/4 border">Friends
						<ChatShowDiscussions setCurrChat={setCurrChat} setAlertMsg={setAlertMsg} />
					</div>
					<div className="basis-3/4 border">Discussion
						<div className='overflow-hidden overflow-y-scroll h-64'>
							<ChatDiscussion currChat={currChat} setCurrChat={setCurrChat} setAlertMsg={setAlertMsg} />
						</div>
					</div>
				</div> */}
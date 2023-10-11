import { useEffect, useState } from 'react';
import { ChatRetour } from '../../shared/chat';
import axios from 'axios';
import { SuccessMsg } from '../../shared/errors';

type PropChatDiscussions = {
    setCurrChat: any;
    setAlertMsg: any;
};
function ChatShowDiscussions({
    setCurrChat,
    setAlertMsg,
}: PropChatDiscussions) {
    const [chats, setChats] = useState<ChatRetour[] | null>(null);

    useEffect(() => {
        execBackendGetAllChats();
    }, []);

    async function execBackendGetAllChats() {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/chat/all/`,
                {
                    withCredentials: true,
                },
            );
            console.log(response.data);
            if (response.data.message === SuccessMsg) {
                setChats(response.data.chats);
                setAlertMsg(null);
            } else {
                setAlertMsg(response.data.error);
                setChats(null);
            }
        } catch (error) {
            //to handle ?
            return null;
        }
    }

    return chats ? (
        <>
            <div className="hover:overflow-y-scroll">
                {chats.map((elem, index) => (
                    <ChatShowIndivFriend
                        chatElem={elem}
                        setCurrChat={setCurrChat}
                        key={index}
                    />
                ))}
                {chats.length < 7 && <EmptyElems nb={7 - chats.length} />}
            </div>
        </>
    ) : (
        <div>No chats</div>
    );
}

type PropChatIndivFriend = {
    chatElem: ChatRetour;
    setCurrChat: any;
};
function ChatShowIndivFriend({ chatElem, setCurrChat }: PropChatIndivFriend) {
    const styleP: string = `flex items-center text-gray-900  ${''} group font-medium
							flex-1 ml-3 whitespace-nowrap space-y-2`;
	const link: string = chatElem.picture !== '' ? `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image/${chatElem.picture}` : '/carousel-2.svg';

    function handleOnClick() {
        console.log('clicked chatid=' + chatElem.idChat);
        setCurrChat(chatElem.idChat);
    }
    return (
        <div
            className="flex flex-row pt-4 pb-4 border-gray-900 rounded-lg hover:bg-gray-300"
            onClick={handleOnClick}
        >
			<img
                        className="w-8 h-8 rounded-full"
                        src={link}
                        alt="profile picture"
                    />
            <div className={styleP}>
                {chatElem.firstName + ' ' + chatElem.lastName}
            </div>
        </div>
    );
}

function EmptyElems({ nb }: { nb: number }) {
    const tmp: number[] = [];
    for (let i = 0; i < nb; i++) {
        tmp.push(i);
    }
    console.log('nb to draw=' + nb);
    return (
        <>
            {tmp.map((elem, index) => (
                <div className="flex flex-row pt-7 pb-7" key={index}></div>
            ))}
        </>
    );
}

export default ChatShowDiscussions;
// "bg-gray-200 hover:bg-gray-400"

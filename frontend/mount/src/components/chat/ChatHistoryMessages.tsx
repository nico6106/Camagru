import { useUserContext } from '../../context/UserContext';
import { MsgChatRetour } from '../../shared/chat';

type PropChatHistory = {
    chats: MsgChatRetour[];
};
function ChatHistoryMesssages({ chats }: PropChatHistory) {
    const { user } = useUserContext();

    return user ? (
        <div className="h-full flex flex-col">
            {chats.map((elem, index) => (
                <div className={`flex justify-${user.id === elem.sender ? 'end' : 'start'}`} key={index}>
                    <div>
                        {user.id !== elem.sender && (
                            <ShowIndivMsg
                                content={elem.content}
                                msgUserId={elem.sender}
                                meId={user.id}
                                type={elem.type}
                            />
                        )}
						{user.id === elem.sender && (
							<div className='text-xs font-bold mt-2 mr-1 ml-10'>{new Date(elem.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
						)}
                    </div>
                    <div>
                        {user.id === elem.sender && (
                            <ShowIndivMsg
                                content={elem.content}
                                msgUserId={elem.sender}
                                meId={user.id}
                                type={elem.type}
                            />
                        )}
						{user.id !== elem.sender && (
							<div className='text-xs font-bold mt-2 ml-1 mr-10'>{new Date(elem.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
						)}
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <>Error</>
    );
}

type PropIndivMsg = {
    type: 'text' | 'date' | 'image';
    content: string;
    msgUserId: number;
    meId: number;
};
function ShowIndivMsg({ content, msgUserId, meId, type }: PropIndivMsg) {
    const styleDiv: string = `border-b ${msgUserId === meId ? 'bg-sky-200' : 'bg-sky-400'} px-4 py-2 rounded-lg my-1`;
    if (type === 'text') {
        return <div className={styleDiv}>{content}</div>;
    } else if (type === 'date') {
        var parts = content.split('/');
        var date = parts[0];
		var time = parts[1];
        var latitude = parts[2];
        var longitude = parts[3];
        var googleMapsUrl = 'https://www.google.com/maps?q=' + latitude + ',' + longitude;
        return (
            <div className={styleDiv}>
                <div className="flex row">
                    <img
                        className="h-7 w-auto mr-3"
                        src="/logo-matcha-red.png"
                        alt="Matcha"
                    />
                    <p className="font-bold text-lg text-red-500">New Date</p>
                </div>
                <div className="flex-none row pl-2 pt-1 sm:flex">
                    <div className="flex row mr-2">
                        <svg
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M8.25 3.75H6.75V5.25H4.5L3.75 6V19.5L4.5 20.25H19.5L20.25 19.5V6L19.5 5.25H17.25V3.75H15.75V5.25H8.25V3.75ZM5.25 9.75V6.75H18.75V9.75H5.25ZM5.25 11.25V18.75H18.75V11.25H5.25Z"
                                    fill="#080341"
                                ></path>
                            </g>
                        </svg>
                        <p>{date}</p>
                    </div>
                    <div className='flex row mr-2'>
                        <svg
                            className="h-5 w-5 mr-1"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <g strokeWidth="0"/>
                            <g
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <g>
                                <path
                                    d="M12 17V12L14.5 10.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                    stroke="#000000"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </g>
                        </svg>
						<p>{time}</p>
                    </div>
                </div>
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    className="flex row pl-2"
                >
                    <svg
                        className="h-5 w-5 mr-1"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                            id="SVGRepo_tracerCarrier"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z"
                                stroke="#000000"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                            <path
                                d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                                stroke="#000000"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </g>
                    </svg>
                    <p className="text-blue-500">
                        {latitude}, {longitude}
                    </p>
                </a>
            </div>
        );
    }
    return <div className={styleDiv}>{content}</div>;
}

export default ChatHistoryMesssages;

import { useUserContext } from '../../context/UserContext';
import { MsgChatRetour } from '../../shared/chat';

type PropChatHistory = {
    chats: MsgChatRetour[];
};
function ChatHistoryMesssages({ chats }: PropChatHistory) {
	const { user } = useUserContext();
	
    return user ? (
        <div className='h-full flex flex-col'>
            {chats.map((elem, index) => (
				<div className='flex flex-row' key={index} >
					<div className="w-1/2">
						{user.id !== elem.sender && <ShowIndivMsg content={elem.content} msgUserId={elem.sender} meId={user.id} />}
					</div>
					<div className="w-1/2">
						{user.id === elem.sender && <ShowIndivMsg content={elem.content} msgUserId={elem.sender} meId={user.id} />}
					</div>
				</div>
				
            ))}
        </div>
    ) : (<>Error</>);
}

type PropIndivMsg = {
	content: string;
	msgUserId: number;
	meId: number;
}
function ShowIndivMsg({ content, msgUserId, meId }: PropIndivMsg) {
	const styleDiv: string = `border-b ${msgUserId===meId ? 'bg-sky-200' : 'bg-sky-400'}`;
	return (<div className={styleDiv} >{content}</div>)
}

export default ChatHistoryMesssages;

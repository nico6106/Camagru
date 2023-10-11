import { MsgChatRetour } from "../../shared/chat";

type PropChatHistory = {
	chats: MsgChatRetour[];
}
function ChatHistoryMesssages({ chats }: PropChatHistory) {
	return (<>
		{chats.map((elem) => <div>{elem.content}</div>)}
	</>);
}

export default ChatHistoryMesssages;
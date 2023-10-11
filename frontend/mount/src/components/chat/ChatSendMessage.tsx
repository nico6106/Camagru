import { useContext, useEffect, useState } from "react";
import { WebsocketContext } from "../../context/WebsocketContext";

type PropChatSend = {
	currChat: number;
}

export type DataSocketChatServ = {
	idChat: number;
	message: string;
}

function ChatSendMessage({ currChat }: PropChatSend) {
	const socket = useContext(WebsocketContext);
	const [msg, setMsg] = useState<string>('');

	function handleSendMessage(event: any) {
		event.preventDefault();
		if (msg === '') return ;
		const newMsg: DataSocketChatServ = {
			idChat: currChat,
			message: msg,
		} 
		socket.emit('chat-serv', newMsg);
		setMsg('');
	}

	function handleOnBlur(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setMsg(e.target.value);
    }

    return (
        <form>
            <label htmlFor="chat" className="sr-only">
                Your message
            </label>
            <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50">
                <textarea
                    id="chat"
                    rows={2}
                    className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Your message..."
					value={msg}
					onBlur={(e) => {
						handleOnBlur(e);
					}}
					onChange={(e) => handleOnBlur(e)}
                ></textarea>
                <button
                    type="submit"
                    className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100"
					onClick={handleSendMessage}
				>
                    <svg
                        className="w-5 h-5 rotate-90"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                    >
                        <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                    </svg>
                    <span className="sr-only">Send message</span>
                </button>
            </div>
        </form>
    );
}

export default ChatSendMessage;

{
    /* <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
<svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
	<path fill="currentColor" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"/>
	<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"/>
	<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"/>
</svg>
<span className="sr-only">Upload image</span>
</button> */
}

import { useState } from 'react';
import UserNotSignedIn from '../components/auth/UserNotSignedIn';
import ChatShowDiscussions from '../components/chat/ChatShowDiscussions';
import TitleSmall from '../components/elems/TitleSmall';
import TramePage from '../components/elems/TramePage';
import { useUserContext } from '../context/UserContext';
import ChatDiscussion from '../components/chat/ChatDiscussion';

function ChatPage() {
    const { user } = useUserContext();
	const [currChat, setCurrChat] = useState<number>(0);
	const [alert, setAlertMsg] = useState<string | null>(null);

    return user ? (
        <>
            {/* <TramePage> */}
                <TitleSmall text="Chat" space="1" />

				<div className="h-full  flex border">
					<div className="w-1/4 bg-gray-200 p-4">Friends
						<ChatShowDiscussions setCurrChat={setCurrChat} setAlertMsg={setAlertMsg} />
					</div>
					<div className="w-3/4 flex flex-col">Discussion
						<ChatDiscussion currChat={currChat} setAlertMsg={setAlertMsg} />
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
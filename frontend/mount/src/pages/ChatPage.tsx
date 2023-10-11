import UserNotSignedIn from '../components/auth/UserNotSignedIn';
import TitleSmall from '../components/elems/TitleSmall';
import TramePage from '../components/elems/TramePage';
import { useUserContext } from '../context/UserContext';

function ChatPage() {
    const { user } = useUserContext();

	const usersTest: string[] = ['user1', 'user2', 'user3', 'user4', 'user5', 'user6', 'user7', 'user8']
	const chatTest: string[] = ['oula', 'gdfgdfa gdf df gdfg sdfg sdfg sd fg', 'gadfg', 'gadfg adfg adfg ', 'gadfg', 'asgas gd dg', 'asg sdg', 'fg ag ', 'ffsfsdfs', 'f45er1f56',
							'oula', 'gdfgdfa', 'gadfg', 'gadfg adfg adfg ', 'gadfg', 'asgas gd dg', 'asg sdg', 'fg ag ', 'ffsfsdfs', 'f45er1f56',
							'oula', 'gdfgdfa', 'gadfg', 'gadfg adfg adfg ', 'gadfg', 'asgas gd dg', 'asg sdg', 'fg ag ', 'ffsfsdfs', 'f45er1f56']
    return user ? (
        <>
            <TramePage>
                <TitleSmall text="Chat" space="1" />

				<div className="flex flex-row">
					<div className="basis-1/4 border">Friends
						<div className='hover:overflow-y-scroll '>
							{usersTest.map((elem => 
								<div>
									{elem}
								</div>
								))}
						</div>
					</div>
					<div className="basis-3/4 border">Discussion
					<div className='overflow-hidden overflow-y-scroll h-64'>
						{chatTest.map((elem => 
								<div>
									-{elem}
								</div>
								))}
					</div>
							
					</div>
				</div>

            </TramePage>
        </>
    ) : (
        <UserNotSignedIn />
    );
}

export default ChatPage;

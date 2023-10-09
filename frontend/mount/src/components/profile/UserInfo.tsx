import { UserExport } from '../../shared/userExport';

type Prop = {
    user: UserExport;
};

function UserInfo({ user }: Prop) {
	const formattedText = user.biography.replace(/\n/g, '<br>');
  	const htmlText = { __html: formattedText };
    return (
        <div>
            <h5 className="text-xl font-bold dark:text-white">{user.first_name} {user.last_name}, {user.age}</h5>
            <p className="mb-0 text-lg text-gray-500 md:text-xl dark:text-gray-400">
                {user.city}
            </p>
			<p className="mb-3 text-lg text-gray-500 md:text-xl dark:text-gray-400">
                Gender: {user.gender}, interested in: {user.preference}
            </p>
            <p className="text-gray-500 dark:text-gray-400" dangerouslySetInnerHTML={htmlText}></p>
			<UserTags tags={user.interests} />
        </div>
    );
}

export default UserInfo;

function UserTags({ tags }: {tags: string[]}) {
	return (<><br />
		<p className="text-gray-500 dark:text-gray-400">Interests: 
		{tags.map((elem) => <span key={elem} className="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{elem}</span>)}
		</p>
		</>
	)
}
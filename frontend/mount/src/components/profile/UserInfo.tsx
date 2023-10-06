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
            <p className="mb-3 text-lg text-gray-500 md:text-xl dark:text-gray-400">
                {user.city}
            </p>
            <p className="text-gray-500 dark:text-gray-400" dangerouslySetInnerHTML={htmlText}></p>
        </div>
    );
}

export default UserInfo;

{/* <ShowBio bio={user.biography} /> */}
function ShowBio({bio}: {bio: string}) {
	const formattedText = bio.replace(/\n/g, '<br>');
  
	// Créez un objet avec la clé __html pour rendre le HTML en toute sécurité
	const htmlText = { __html: formattedText };
	console.log(htmlText)
  
	return <p dangerouslySetInnerHTML={htmlText} />;
  
}
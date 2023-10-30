import { Link } from "react-router-dom";
import { MatchingResponse, UserInfoMatching } from "../../shared/search";

type Prop = {
    user: UserInfoMatching;
	distance: number;
	commonTags: string[];
	elem: MatchingResponse;
};

function CardElemUser({ user, distance, commonTags, elem }: Prop) {
	const linkImg: string = user.profile_picture !== '' ? `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image/${user.profile_picture}` : '/carousel-2.svg';
	const linkProfile: string = `/profile/${user.id}`
    return (
		<>
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
			<Link to={linkProfile}>
                <img
                    className="rounded-t-lg h-96 object-cover"
                    src={linkImg}
                    alt=""
                />
            </Link>
            <div className="p-5">
				<Link to={linkProfile}>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                        {user.first_name + ', ' + user.age}
                    </h5>
				</Link>
                <p className="font-normal text-gray-700 dark:text-gray-400">
					{(distance < 5000 ? (Math.trunc(distance) + 'm') : (Math.trunc(distance / 1000) + 'km')) + ' away'}
				</p>
				<p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
					{commonTags.length + ' tags in common'}
                </p>
				{/* <p>Rank={elem.autoRank}</p>
				<p>NormDist={elem.normDist}</p>
				<p>NormTags={elem.normTags}</p>
				<p>NormFame={elem.normFame} ({elem.user.fame_rating})</p> */}
            </div>
        </div>
		</>
    );
}

export default CardElemUser;

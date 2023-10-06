import { Link } from "react-router-dom";
import { UserExport } from "../../shared/userExport"

type Prop = {
	userM: UserExport;
}

function UserOptionProfile({ userM }: Prop) {
	return (<>
	<div className="grid grid-rows-6 grid-flow-col gap-5">
		<div>Popularity</div>
		<div><Link to='/profile/option/viewed_by/'>Your visitors</Link></div>
		<div><Link to='/profile/option/viewed'>Profiles you visited</Link></div>
		<div><Link to='/profile/option/liked_by'>Who likes you</Link></div>
		<div><Link to='/profile/option/matches'>Your matches</Link></div>
		<div><Link to='/profile/option/likes'>Who you like</Link></div>
	</div></>)
}

export default UserOptionProfile
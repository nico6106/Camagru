import { UserExport, UserShort } from "../shared/userExport";
import { User } from "./users";

export type RetourType = {
	message?: string;
	user?: User;
	userM?: UserExport; //user Modified values
	userShort?: UserShort[];
	error?: string;
	username?: string;
	tags?: string[];
	info?: string;
	userLiked?: boolean, 
	userMatched?: boolean,
}
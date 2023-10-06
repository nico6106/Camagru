import { UserExport } from "../shared/userExport";
import { User } from "./users";

export type RetourType = {
	message?: string;
	user?: User;
	userM?: UserExport; //user Modified values
	error?: string;
	username?: string;
	tags?: string[];
	info?: string;
}
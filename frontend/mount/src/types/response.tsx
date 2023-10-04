import { User } from "./users";

export type RetourType = {
	message?: string;
	user?: User;
	error?: string;
	username?: string;
}
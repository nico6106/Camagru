export type UserInfoMatching = {
	id: number;
	first_name: string;
    last_name: string;
	age: number;
	gender: 'male' | 'female' | 'other';
	profile_picture: string;
}

export type MatchingResponse = {
	user: UserInfoMatching;
	distance: number;
	commonTags: string[];
	normDist: number;
	normTags: number;
	normFame: number;
	autoRank: number;
}
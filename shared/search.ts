export type UserInfoMatching = {
	id: number;
	first_name: string;
    last_name: string;
	age: number;
	gender: 'male' | 'female' | 'other';
	profile_picture: string;
	fame_rating: number;
	tags: string[];
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

export type MatchingGlobalData = {
	minAge: number;
	maxAge: number;
	minDist: number;
	maxDist: number;
	minFame: number;
	maxFame: number;
	minTags: number;
	maxTags: number;
}
export type UserExport = {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    date_birth: Date;
	age: number;
    inscription: number;
    gender: 'male' | 'female' | 'other';
    preference: 'male' | 'female' | 'bisexual';
    interests: string[];
    biography: string;
    pictures: string[];
    profile_picture: string;
    blocked_user: number[];
    viewed: UserShort[];
    viewed_by: UserShort[];
    likes: UserShort[];
    liked_by: UserShort[];
    position: { longitude: number; latitude: number };
	city: string;
    fame_rating: number;
    fake_account: number;
    connected: boolean;
    last_connection: number;
};

export type UserShort = {
	first_name: string;
    last_name: string;
    username: string;
	age: number;
	profile_picture: string;
	connected: boolean;
	date: Date;
}
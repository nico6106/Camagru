export type User = {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	password: string;
	email: string;
	email_verified: boolean;
	email_confirm_id: string;
	date_birth: Date;
	inscription: number;
	gender: 'male' | 'female' | 'other';
	preference: 'male' | 'female' | 'bisexual';
	interests: string[];
	biography: string;
	pictures: string[];
	profile_picture: string;
	position: { longitude: number; latitude: number };
	force_position: boolean;
}
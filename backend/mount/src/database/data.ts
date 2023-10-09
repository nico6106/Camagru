export const TableUsersName: string = 'users';
export const TableUserQuery: string = `CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	username VARCHAR(50) UNIQUE,
	password text,
	reset_pwd VARCHAR(50) DEFAULT '',
	email VARCHAR(100) UNIQUE,
	email_verified BOOLEAN DEFAULT FALSE,
	email_confirm_id VARCHAR(50),
	date_birth DATE,
	inscription TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	gender VARCHAR(50),
	preference VARCHAR(50) DEFAULT 'bisexual',
	interests VARCHAR(100)[] DEFAULT '{}'::VARCHAR(100)[],
	biography TEXT DEFAULT '',
	pictures VARCHAR(100)[] DEFAULT '{}'::VARCHAR(100)[],
	profile_picture VARCHAR(100) DEFAULT '',
	blocked_user INT[] DEFAULT '{}'::INT[],
	viewed JSONB DEFAULT '[]'::JSONB,
	viewed_by JSONB DEFAULT '[]'::JSONB,
	likes JSONB DEFAULT '[]'::JSONB,
	liked_by JSONB DEFAULT '[]'::JSONB,
	matches INT[] DEFAULT '{}'::INT[],
	position JSON DEFAULT '{}'::JSON,
	fame_rating INT DEFAULT 4,
	fame_evol INT DEFAULT 0,
	fake_account JSONB DEFAULT '[]'::JSONB,
	connected BOOLEAN DEFAULT FALSE,
	last_connection TIMESTAMP
	)`;

export type TableUser = {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	password: string;
	reset_pwd: string;
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
	blocked_user: number[];
	viewed: { id: number; date: number }[];
	viewed_by: { id: number; date: number }[];
	likes: { id: number; date: number }[];
	liked_by: { id: number; date: number }[];
	matches: number[];
	position: { longitude: number; latitude: number};
	fame_rating: number;
	fame_evol: number;
	fake_account: { id: number; date: number }[];
	connected: boolean;
	last_connection: number;
}
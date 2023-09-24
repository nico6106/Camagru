export const TableUsersName: string = 'users';
export const TableUserQuery: string = `CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	first_name VARCHAR(50),
	last_name VARCHAR(50),
	username VARCHAR(50) UNIQUE,
	password text,
	email VARCHAR(100) UNIQUE,
	date_birth DATE,
	inscription TIMESTAMP,
	gender VARCHAR(50),
	preference VARCHAR(50),
	interests VARCHAR(100)[],
	biography TEXT,
	pictures VARCHAR(100)[],
	profilePicture VARCHAR(100)
	)`;

export type TableUser = {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	password: string;
	email: string;
	date_birth: Date;
	inscription: number;
	gender: 'male' | 'female' | 'other';
	preference: 'male' | 'female' | 'bisexual';
	interests: string[];
	biography: string;
	pictures: string[];
	profilePicture: string;
}
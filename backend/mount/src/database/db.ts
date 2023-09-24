import { Client, QueryResult } from "pg";
import { ExitStatus } from "typescript";

export class Database {
  user: string;
  client: any;

  constructor() {
    this.user = "db";
    this.client = new Client({
      host: "dev-db",
      user: "postgres",
      port: 5432,
      password: "n2J5dJGelC0W4UEtiHkMZRrdrSHsLKr7",
      database: "postgres",
    });
	
	// console.log('DB creation link OK');
  }

  async connectDb(): Promise<boolean>{
	try {
		await this.client.connect();
		console.log('DB connection OK');
		
		this.testTable();
		
		return true;
	}
	catch (err) {
		return false;
	}
  }

  async testTable(): Promise<boolean> {
	try {
		const retourDbUser: QueryResult = await this.selectUsers();
		console.log(retourDbUser.rows)
		return true;
	}
	catch (err: any) {
		if (err.message === 'no table') {
			//creer tables
			console.log('table a creer');
			const query: string = `CREATE TABLE users (
				id INTEGER,
				first_name VARCHAR(50),
				last_name VARCHAR(50),
				username VARCHAR(50),
				email VARCHAR(100),
				date_birth DATE,
				inscription TIMESTAMP,
				PRIMARY KEY (id)
				)`
			await this.client.query(query, (err: Error | null, res: QueryResult) => {
				if (err) {
					console.log('error creating table')
				}
				else {
					console.log('table created')
				}
			})
			return true;
		}
		else
			return false;
	}
  }

  finalize() {
    // Destructeur (finalize)
    console.log('DB Destructeur appelé');
	this.client.end;
  }

  async selectUsers(): Promise<QueryResult> {
	return new Promise((resolve, reject) => {
		this.client.query(`SELECT * FROM users`, (err: Error | null, res: QueryResult) => {
			if (!err) {
			  resolve(res);
			} else {
			  reject(new Error('no table'));
			}
		  });
	});
	
  }
}

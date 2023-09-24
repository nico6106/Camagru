import { QueryResult } from "pg";
import { Database } from "./db";

/*execute query in plain text*/
export async function exec_executeQueryNoArg(
  db: Database,
  query: string
): Promise<QueryResult> {
  return new Promise((resolve, reject) => {
    db.client.query(query, (err: Error | null, res: QueryResult) => {
      if (!err) {
        resolve(res);
      } else {
        reject(new Error("Error with query"));
      }
    });
  });
}

/*execute query that comes with an array of values*/
export async function exec_executeQueryOneArg(
  db: Database,
  query: string,
  args: any[],
): Promise<QueryResult | null> {

  return new Promise((resolve, reject) => {
    db.client.query(query, args, (err: Error | null, res: QueryResult) => {
      if (!err) {
        resolve(res);
      } else {
		resolve(null);
      }
    });
  });
}

/*insert a value in the table*/
export async function exec_insertToTable(db: Database, table: string, fields: string, values: any): Promise<QueryResult | null> {
	const formattedValues: string = formatValues(values);
	const query: string = `INSERT INTO ${table} (${fields}) VALUES (${formattedValues})`
	return db.executeQueryArgs(query, values);
}

/*give the correct schema for adding values for insertTable function: if 3 values: $1, $2, $3*/
export function formatValues(values: any[]): string {
	let retour: string = '';
	let i: number = 1;
	for (const elem of values) {
		retour = retour + (i !== 1 ? ', ' : '') + '$' + i;
		i++;
	}
	return retour;
}
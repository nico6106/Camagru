import { Database } from "../database/db";
import { TableUsersName } from '../database/data';
// Take a username and concatenate it with a number until it is unique
export async function generateUniqueUsername(db: Database, login: string): Promise<string> {
    let username = login
    let i = 1
    let ret = await db.selectOneElemFromTable(TableUsersName,'username', username)

    while (ret && ret.length > 0) {
        username = `${login}${i}`
        i++
        ret = await db.selectOneElemFromTable(TableUsersName,'username', username)
    }

    return username
}
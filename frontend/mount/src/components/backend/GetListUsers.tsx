import axios from 'axios';
import { RetourType } from '../../types/response';

//get list of users 
async function GetListUsers(id: number, param: string): Promise<RetourType | null> {
    const dataCheck: string[] = ['viewed', 'viewed_by', 'likes', 'liked_by', 'matches'];
	if (!dataCheck.includes(param))
		return null;
	try {
        const response = await axios.get(
            `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/${param}/${id}`,

            {
                withCredentials: true,
            },
        );
        return response.data;
    } catch (error) {
        //to handle ?
		return null;
    }
}

export default GetListUsers;

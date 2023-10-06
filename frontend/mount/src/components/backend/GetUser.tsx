import axios from 'axios';
import { RetourType } from '../../types/response';

async function GetUser(id: number): Promise<RetourType | null> {
    try {
        const response = await axios.get(
            `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/${id}`,

            {
                withCredentials: true,
            },
        );
        // console.log(response.data);
        return response.data;
    } catch (error) {
        //to handle ?
		return null;
    }
}

export default GetUser;

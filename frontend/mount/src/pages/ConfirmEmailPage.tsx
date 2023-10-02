import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RetourType } from '../types/response';

function ConfirmEmailPage() {
    const { idConfirm } = useParams();
    const [retour, setRetour] = useState<RetourType | null>(null);
	const navigate = useNavigate();

    useEffect(() => {
        if (idConfirm) {
            console.log(idConfirm);
            validateLink();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idConfirm]);

    async function validateLink() {
        if (!idConfirm) return;
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/auth/confirm/${idConfirm}`,
                {
                    withCredentials: true,
                },
            );
            setRetour(response.data);
			console.log(response.data)
            if (response.data.message === 'unknown link') 
				navigate('/404')
			return response.data;
        } catch (error) {
            setRetour(null);
        }
    }

    return retour ? (
        retour.message === 'success' ? (
            <div>Link validated. Please log in</div>
        ) : retour.message === 'already validated' ? (
            <div>Link already validated.</div>
        ) : (
            <>rediction 404</>
        )
    ) : (
        <div>Link not validated</div>
    );
}

export default ConfirmEmailPage;

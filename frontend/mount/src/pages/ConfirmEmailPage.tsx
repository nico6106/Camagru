import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RetourType } from '../types/response';
import TramePage from '../components/elems/TramePage';
import TitleSmall from '../components/elems/TitleSmall';
import TextPage from '../components/elems/TextPage';
import { SuccessMsg } from '../shared/errors';

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
            console.log(response.data);
            if (response.data.message === 'unknown link') navigate('/404');
            return response.data;
        } catch (error) {
            setRetour(null);
        }
    }

    return (
        <TramePage>
            {retour && retour.message === SuccessMsg && (
                <>
                    <TitleSmall text={'Congratulations'} />
					<TextPage center={true}>Link validated. Please log in</TextPage>
                    
                </>
            )}
            {retour && retour.message === 'already validated' && (
                <>
                    <TitleSmall text={'Error..'} />
					<TextPage center={true}>Link already validated.</TextPage>
                </>
            )}
        </TramePage>
    );

}

export default ConfirmEmailPage;

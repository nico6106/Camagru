import { useEffect, useState } from 'react';
import UserNotSignedIn from '../components/auth/UserNotSignedIn';
import TitleSmall from '../components/elems/TitleSmall';
import TramePage from '../components/elems/TramePage';
import { useUserContext } from '../context/UserContext';
import { MatchingGlobalData, MatchingResponse } from '../shared/search';
import axios from 'axios';
import ShowAllCards from '../components/browsing/ShowAllCards';
import ShowFilters from '../components/browsing/FilterBy';

export type OrderBy = 'Magic' | 'Age' | 'Distance' | 'Rating' | 'Common Tags';

export type MinMaxInit = {
	distMin: number;
	distMax: number;
	ageMin: number;
	ageMax: number;
	fameMin: number;
	fameMax: number;
	minNbCommonTags: number;
	maxNbCommonTags: number;
}
function FindUserPage() {
    const { user } = useUserContext();
    const [dataCards, setDatacards] = useState<MatchingResponse[] | null>(null);
	const [initDataCards, setInitDatacards] = useState<MatchingResponse[] | null>(null);
    const [orderBy, setOrderBy] = useState<OrderBy>('Magic');
    const [distMin, setDistMin] = useState<number>(0);
    const [distMax, setDistMax] = useState<number>(0);
    const [ageMin, setAgeMin] = useState<number>(0);
    const [ageMax, setAgeMax] = useState<number>(0);
    const [fameMin, setFameMin] = useState<number>(0);
    const [fameMax, setFameMax] = useState<number>(0);
    const [nbCommonTags, setNbCommonTags] = useState<number>(0);
	const [minMax, setMinMax] = useState<MinMaxInit | null>(null);

    useEffect(() => {
        searchInitBackend();
    }, []);

    useEffect(() => {
        if (!dataCards) return;
        // console.log(dataCards)
        sortCards(dataCards, orderBy);
    }, [orderBy]);

	function filter() {
		if (initDataCards) {
			const dataFiltered: MatchingResponse[] = filterCards(initDataCards);
			sortCards(dataFiltered, orderBy);
		}
	}

	function filterCards(data: MatchingResponse[]): MatchingResponse[] {
		const newData: MatchingResponse[] = [];
		for (const elem of data) {
			let add: boolean = true;
			//filter by distance
			if (!(elem.distance >= distMin && elem.distance <= distMax))
				add = false;
			//filter by age
			if (!(elem.user.age >= ageMin && elem.user.age <= ageMax))
				add = false;
			//filter by fame
			if (!(elem.user.fame_rating >= fameMin && elem.user.fame_rating <= fameMax))
				add = false;
			if (add)
				newData.push(elem);
		}
		return newData;
	}

    function sortCards(data: MatchingResponse[], type: OrderBy) {
        const newData: MatchingResponse[] = [...data];

        if (type === 'Magic') newData.sort((a, b) => b.autoRank - a.autoRank);
        else if (type === 'Distance')
            newData.sort((a, b) => b.normDist - a.normDist);
        else if (type === 'Rating')
            newData.sort((a, b) => b.normFame - a.normFame);
        else if (type === 'Common Tags')
            newData.sort((a, b) => b.normTags - a.normTags);
        else if (type === 'Age')
            newData.sort((a, b) => a.user.age - b.user.age);
        setDatacards(newData);
    }

    async function searchInitBackend() {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/search/`,
                {
                    withCredentials: true,
                },
            );
            console.log(response.data);
            if (response.data && response.data.data_search) {
				setInitDatacards(response.data.data_search);
				sortCards(response.data.data_search, 'Magic');
			}
                
            if (response.data && response.data.data_global) {
                const global: MatchingGlobalData = response.data.data_global;
                setDistMin(global.minDist);
                setDistMax(global.maxDist);
                setAgeMin(global.minAge);
                setAgeMax(global.maxAge);
                setFameMin(global.minFame);
                setFameMax(global.maxFame);
                setNbCommonTags(global.maxTags);
				setMinMax({
					distMin: global.minDist,
					distMax: global.maxDist,
					ageMin: global.minAge,
					ageMax: global.maxAge,
					fameMin: global.minFame,
					fameMax: global.maxFame,
					minNbCommonTags: global.minTags,
					maxNbCommonTags: global.maxTags,
				})
            }
            return response.data;
        } catch (error) {
            // setRetour(null);
        }
    }

    return user ? (
        <TramePage>
            <TitleSmall text={'Find your next match here !'} space={'1'} />

            {minMax && <ShowFilters
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                distMin={distMin}
                setDistMin={setDistMin}
                distMax={distMax}
                setDistMax={setDistMax}
                ageMin={ageMin}
                setAgeMin={setAgeMin}
                ageMax={ageMax}
                setAgeMax={setAgeMax}
                fameMin={fameMin}
                setFameMin={setFameMin}
                fameMax={fameMax}
                setFameMax={setFameMax}
                nbCommonTags={nbCommonTags}
                setNbCommonTags={setNbCommonTags}
				initMinMax={minMax}
				functionButton={filter}
            />}
            {dataCards && <ShowAllCards data={dataCards} />}
        </TramePage>
    ) : (
        <UserNotSignedIn />
    );
}

export default FindUserPage;

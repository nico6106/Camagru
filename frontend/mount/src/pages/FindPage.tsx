import { useEffect, useState } from 'react';
import UserNotSignedIn from '../components/auth/UserNotSignedIn';
import TitleSmall from '../components/elems/TitleSmall';
import TramePage from '../components/elems/TramePage';
import { useUserContext } from '../context/UserContext';
import { MatchingGlobalData, MatchingResponse } from '../shared/search';
import axios from 'axios';
import ShowAllCards from '../components/browsing/ShowAllCards';
import ShowFilters from '../components/browsing/FilterBy';
import Pagination from '../components/elems/Pagination';

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
    availableTags: string[];
};

export type FilterOptions = {
    distMin: number;
    distMax: number;
    ageMin: number;
    ageMax: number;
    fameMin: number;
    fameMax: number;
};

function FindUserPage() {
    const { user } = useUserContext();
    const [dataCards, setDatacards] = useState<MatchingResponse[] | null>(null);
    const [initDataCards, setInitDatacards] = useState<
        MatchingResponse[] | null
    >(null);
    const [orderBy, setOrderBy] = useState<OrderBy>('Magic');
    const [distMin, setDistMin] = useState<number>(0);
    const [distMax, setDistMax] = useState<number>(0);
    const [ageMin, setAgeMin] = useState<number>(0);
    const [ageMax, setAgeMax] = useState<number>(0);
    const [fameMin, setFameMin] = useState<number>(0);
    const [fameMax, setFameMax] = useState<number>(0);
    const [nbCommonTags, setNbCommonTags] = useState<number>(0);
    const [minMax, setMinMax] = useState<MinMaxInit | null>(null);

    const [tagsUser, setTagsUser] = useState<string[]>([]);
    const [tagsPossible, setTagsPossible] = useState<string[]>([]);

    const [showAdvancedSearch, setAdvancedSearch] = useState<boolean>(false);

    const [nbStart, setNbStart] = useState<number>(0);
    const [nbEnd, setNbEnd] = useState<number>(0);
    const [nbTotal, setNbTotal] = useState<number>(0);

    const nbPerPage: number = 30;

    useEffect(() => {
        searchInitBackend();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!dataCards) return;
        // console.log(dataCards)
        sortCards(dataCards, orderBy);
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
            if (
                !(
                    elem.user.fame_rating >= fameMin &&
                    elem.user.fame_rating <= fameMax
                )
            )
                add = false;
            //filter by tag
            if (filterbyTags(elem.user.tags, tagsUser)) add = false;
            if (add) newData.push(elem);
        }
        return newData;
    }

    //filter si un user a pas au moins un tag de la liste
    function filterbyTags(tagsUser: string[], tagsFilter: string[]): boolean {
        for (const tag of tagsUser) {
            if (tagsFilter.includes(tag)) {
                return false;
            }
        }
        if (tagsFilter.includes('None') && tagsUser.length === 0) return false;
        return true;
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

	function saveReturnFromBackend(response: any) {
		if (response.data && response.data.data_search) {
			setInitDatacards(response.data.data_search);
			if (response.data.data_search.length > 0) {
				setNbStart(1);
				setNbTotal(response.data.data_search.length);
				if (response.data.data_search.length > nbPerPage)
					setNbEnd(nbPerPage);
				else
					setNbEnd(response.data.data_search.length);
			}
			sortCards(response.data.data_search, 'Magic');
			setOrderBy('Magic');
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
			const availableTags: string[] = response.data.user_tags
				? [...response.data.user_tags, 'None']
				: [];
			setMinMax({
				distMin: global.minDist,
				distMax: global.maxDist,
				ageMin: global.minAge,
				ageMax: global.maxAge,
				fameMin: global.minFame,
				fameMax: global.maxFame,
				minNbCommonTags: global.minTags,
				maxNbCommonTags: global.maxTags,
				availableTags: availableTags,
			});

			if (response.data.user_tags) {
				const tags: string[] = [
					...response.data.availables_tags,
					'None',
				];
				setTagsUser(tags);
				setTagsPossible(tags);
			}
			//availables_tags
			//user_tags
		}
	}

    async function searchInitBackend() {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/search/`,
                {
                    withCredentials: true,
                },
            );
            // console.log(response.data);
			saveReturnFromBackend(response);
            return true;
        } catch (error) {
            // setRetour(null);
        }
    }

    return user ? (
        <TramePage>
            <TitleSmall text={'Find your next match here !'} space={'1'} />

            {minMax && (
                <ShowFilters
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
                    initMinMax={minMax}
                    functionButton={filter}
                    tagsUser={tagsUser}
                    tagsPossible={tagsPossible}
                    setTagsUser={setTagsUser}
                    showAdvancedSearch={showAdvancedSearch}
                    setAdvancedSearch={setAdvancedSearch}
					saveReturnFromBackend={saveReturnFromBackend}
                />
            )}
            {dataCards && showAdvancedSearch === false && (
                <ShowAllCards data={dataCards} nbStart={nbStart} nbEnd={nbEnd} />
            )}
            <Pagination
                nbStart={nbStart}
                nbEnd={nbEnd}
                nb_tot={nbTotal}
                nbPerPage={nbPerPage}
                setNbStart={setNbStart}
                setNbEnd={setNbEnd}
            />
        </TramePage>
    ) : (
        <UserNotSignedIn />
    );
}

export default FindUserPage;

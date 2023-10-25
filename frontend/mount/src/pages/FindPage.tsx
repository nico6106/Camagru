import { useEffect, useState } from 'react';
import UserNotSignedIn from '../components/auth/UserNotSignedIn';
import TitleSmall from '../components/elems/TitleSmall';
import TramePage from '../components/elems/TramePage';
import { useUserContext } from '../context/UserContext';
import { MatchingResponse } from '../shared/search';
import axios from 'axios';
import ShowAllCards from '../components/browsing/ShowAllCards';
import SelectInput from '../components/elems/SelectInput';
import { createEmitAndSemanticDiagnosticsBuilderProgram } from 'typescript';

type OrderBy = "Magic" | "Age" | "Distance" | "Rating" | "Common Tags";

function FindUserPage() {
	const { user } = useUserContext();
	const [dataCards, setDatacards] = useState<MatchingResponse[] | null>(null);
	const [orderBy, setOrderBy] = useState<OrderBy>("Magic");

	useEffect(() => {
		searchInitBackend();
	}, []);

	useEffect(() => {
		if (!dataCards)
			return ;
		// console.log(dataCards)
		sortCards(dataCards, orderBy);
	}, [orderBy]);

	function sortCards(data: MatchingResponse[], type: OrderBy) {
		const newData: MatchingResponse[] = [...data];

		if (type === "Magic")
			newData.sort((a, b) => b.autoRank - a.autoRank);
		else if (type === "Distance")
			newData.sort((a, b) => b.normDist - a.normDist);
		else if (type === "Rating")
			newData.sort((a, b) => b.normFame - a.normFame);
		else if (type === "Common Tags")
			newData.sort((a, b) => b.normTags - a.normTags);
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
			if (response.data && response.data.data_search)
				sortCards(response.data.data_search, "Magic");
            return response.data;
        } catch (error) {
            // setRetour(null);
        }
    }

    return user ? (
        <TramePage>
			<TitleSmall text={'Find your next match here !'} space={'1'} />

			<ShowFilters orderBy={orderBy} setOrderBy={setOrderBy} />
			{dataCards && <ShowAllCards data={dataCards} /> }
        </TramePage>
    ) : (<UserNotSignedIn />);

}

type PropShowFilters = {
	orderBy: OrderBy;
	setOrderBy: any;
}
function ShowFilters({ orderBy, setOrderBy }: PropShowFilters) {
	const allFilter: string[] = ["Magic", "Age", "Distance", "Rating", "Common Tags"];

	function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setOrderBy(e.target.value);
    }
	return (<>
	<SelectInput
							title="Filter by"
							name="filter"
							nameDefault={orderBy}
							list={allFilter}
							onBlur={handleOnChange}
							init={orderBy}
						/>
	{/* <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900">Select an option</label>
	<select
		id="countries"
		className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
		onBlur={(e) => {
			handleOnChange(e);
		}}
		onChange={(e) => handleOnChange(e)}
		value={orderBy}
	>
		{allFilter.map((elem, index) => <option value={elem} key={index}>{elem}</option>)}
	</select> */}
	</>)
}

export default FindUserPage;

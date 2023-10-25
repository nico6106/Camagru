import { MatchingResponse } from '../../shared/search';
import CardElemUser from './CardElem';

type Prop = {
    data: MatchingResponse[];
};

function ShowAllCards({ data }: Prop) {
    return <>
		<div className="flex flex-wrap">

		{data.map((elem, index) => 
		 	<div className="basis-1/1 p-3" key={index}>
				<CardElemUser user={elem.user} distance={elem.distance} commonTags={elem.commonTags} elem={elem} key={index} />
			</div>
			
			// console.log('oula '+elem.user.first_name)
		)}
		</div>
	</>;
}

export default ShowAllCards;

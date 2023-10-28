import { MatchingResponse } from '../../shared/search';
import CardElemUser from './CardElem';

type Prop = {
    data: MatchingResponse[];
	nbStart: number;
	nbEnd: number;
};

function ShowAllCards({ data, nbStart, nbEnd }: Prop) {
    return <>
		<div className="flex flex-wrap">

		{data.map((elem, index) => 
			(index >= nbStart - 1 && index <= nbEnd - 1) && (
				<div className="basis-1/1 p-3" key={index}>
					<CardElemUser user={elem.user} distance={elem.distance} commonTags={elem.commonTags} elem={elem} key={index} />
				</div>
			)
		)}
		</div>
	</>;
}

export default ShowAllCards;

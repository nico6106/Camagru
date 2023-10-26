import { MinMaxInit, OrderBy } from "../../pages/FindPage";
import Button from "../elems/Button";
import { ErrorField } from "../elems/ErrorFields";
import SelectInput from "../elems/SelectInput";

type PropShowFilters = {
    orderBy: OrderBy;
    setOrderBy: any;
    distMin: number;
    setDistMin: any;
    distMax: number;
    setDistMax: any;
    ageMin: number;
    setAgeMin: any;
    ageMax: number;
    setAgeMax: any;
    fameMin: number;
    setFameMin: any;
    fameMax: number;
    setFameMax: any;
    nbCommonTags: number;
    setNbCommonTags: any;
	initMinMax: MinMaxInit;
	functionButton: any;
};
function ShowFilters({
    orderBy,
    setOrderBy,
    distMin,
    setDistMin,
    distMax,
    setDistMax,
    ageMin,
    setAgeMin,
    ageMax,
    setAgeMax,
    fameMin,
    setFameMin,
    fameMax,
    setFameMax,
    nbCommonTags,
    setNbCommonTags,
	initMinMax,
	functionButton,
}: PropShowFilters) {
    const allFilter: string[] = [
        'Magic',
        'Age',
        'Distance',
        'Rating',
        'Common Tags',
    ];
    const spaceFilter: number = 20;

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setOrderBy(e.target.value);
    }
    //dist
    function handleOnChangeDistMin(e: React.ChangeEvent<HTMLInputElement>) {
        const nb = parseInt(e.target.value);
        if (!isNaN(nb)) {
			if (nb > distMax) {
				alert('Cannot have distance minimum > distance maximum');
				return ;
			}
			setDistMin(e.target.value);
		}
    }
    function handleOnChangeDistMax(e: React.ChangeEvent<HTMLInputElement>) {
        const nb = parseInt(e.target.value);
        if (!isNaN(nb)) setDistMax(e.target.value);
    }
    //age
    function handleOnChangeAgeMin(e: React.ChangeEvent<HTMLInputElement>) {
        const nb = parseInt(e.target.value);
        if (!isNaN(nb)) setAgeMin(e.target.value);
    }
    function handleOnChangeAgeMax(e: React.ChangeEvent<HTMLInputElement>) {
        const nb = parseInt(e.target.value);
        if (!isNaN(nb)) setAgeMax(e.target.value);
    }
	//fame
    function handleOnChangeFameMin(e: React.ChangeEvent<HTMLInputElement>) {
        const nb = parseInt(e.target.value);
        if (!isNaN(nb)) setFameMin(e.target.value);
    }
    function handleOnChangeFameMax(e: React.ChangeEvent<HTMLInputElement>) {
        const nb = parseInt(e.target.value);
        if (!isNaN(nb)) setFameMax(e.target.value);
    }
    return (
        <>
            <div className="flex flex-wrap pl-3">
                <div className="pr-5 pb-3">
                    <SelectInput
                        title="Sort by"
                        name="sortby"
                        nameDefault={orderBy}
                        list={allFilter}
                        onBlur={handleOnChange}
                        init={orderBy}
                        size={40}
                    />
                </div>
            </div>
            <div className="flex flex-wrap pl-3">
				{/* <div className="pr-5">
					<RangeElem min={0} max={distMax} title='Dist from you' setValue={handleOnChangeDistMax} />
				</div> */}
                <div className="pr-5">
                    <ErrorField
                        name="filterDistMin"
                        title="Distance min"
                        onBlur={handleOnChangeDistMin}
                        init={distMin.toString()}
                        size={spaceFilter}
                        type={'number'}
						min={initMinMax.distMin}
						max={initMinMax.distMax}

                    />
                </div>
                <div className="pr-5">
                    <ErrorField
                        name="filterDistMax"
                        title="Distance Max"
                        onBlur={handleOnChangeDistMax}
                        init={distMax.toString()}
                        size={spaceFilter}
                        type={'number'}
						min={initMinMax.distMin}
						max={initMinMax.distMax}
                    />
                </div>
                <div className="pr-5">
                    <ErrorField
                        name="filterAgeMin"
                        title="Age min"
                        onBlur={handleOnChangeAgeMin}
                        init={ageMin.toString()}
                        size={spaceFilter}
                        type={'number'}
						min={initMinMax.ageMin}
						max={initMinMax.ageMax}
                    />
                </div>
                <div className="pr-5">
                    <ErrorField
                        name="filterAgeMax"
                        title="Age Max"
                        onBlur={handleOnChangeAgeMax}
                        init={ageMax.toString()}
                        size={spaceFilter}
                        type={'number'}
						min={initMinMax.ageMin}
						max={initMinMax.ageMax}
                    />
                </div>

				<div className="pr-5">
                    <ErrorField
                        name="filterFameMin"
                        title="Fame min"
                        onBlur={handleOnChangeFameMin}
                        init={fameMin.toString()}
                        size={spaceFilter}
                        type={'number'}
						min={initMinMax.fameMin}
						max={initMinMax.fameMax}
                    />
                </div>
                <div className="pr-5">
                    <ErrorField
                        name="filterFameMax"
                        title="Fame Max"
                        onBlur={handleOnChangeFameMax}
                        init={fameMax.toString()}
                        size={spaceFilter}
                        type={'number'}
						min={initMinMax.fameMin}
						max={initMinMax.fameMax}
                    />
                </div>
				<div className="pr-5 pt-7">
                    <Button 
						text='Filter'
						type='button'
						onClick={functionButton} />
                </div>
            </div>
        </>
    );
}

export default ShowFilters;
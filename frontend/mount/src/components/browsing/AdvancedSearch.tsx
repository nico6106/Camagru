import { useState } from "react";
import SelectInput from "../elems/SelectInput";
import { ErrorField } from "../elems/ErrorFields";
import { MinMaxInit } from "../../pages/FindPage";
import { FilterByTags } from "./FilterByTags";
import Button from "../elems/Button";

type AllGenders = 'Female' | 'Male' | 'Both';

const defaultMinMax: MinMaxInit = {
	distMin: 0,
	distMax: 10000000,
	ageMin: 18,
	ageMax: 150,
	fameMin: 1,
	fameMax: 10,
	minNbCommonTags: 0,
	maxNbCommonTags: 10,
	availableTags: [
		'vegan',
		'geek',
		'piercing',
		'sea',
		'mountain',
		'sport',
		'tv',
		'lazy',
		'music',
		'friends',
	],
}

function isNb(input: string): boolean {
	const floatPattern = /^\d+(\.\d+)?$/;
	return floatPattern.test(input);
  }

type PropAdvancedSearch = {
	setInitDatacards: any;
}
function AdvancedSearch({ setInitDatacards }: PropAdvancedSearch) {
	const [gender, setGender] = useState<string>('Both');
	const [distMin, setDistMin] = useState<number | string>('');
    const [distMax, setDistMax] = useState<number |string>('');
    const [ageMin, setAgeMin] = useState<number |string>('');
    const [ageMax, setAgeMax] = useState<number |string>('');
    const [fameMin, setFameMin] = useState<number |string>('');
    const [fameMax, setFameMax] = useState<number |string>('');

	const [tagsUser, setTagsUser] = useState<string[]>([]);

	const spaceFilter: number = 20;

	function handleOnChangeGender(e: React.ChangeEvent<HTMLInputElement>) {
        setGender(e.target.value);
    }

	//dist
    function handleOnChangeDistMin(e: React.ChangeEvent<HTMLInputElement>) {
        if (checkValueAndAlert(e.target.value, 0, 200000, 'Distance')) {
            setDistMin(e.target.value);
        }
    }

    function handleOnChangeDistMax(e: React.ChangeEvent<HTMLInputElement>) {
        if (checkValueAndAlert(e.target.value, 0, 200000, 'Distance')) setDistMax(e.target.value);
    }
    //age
    function handleOnChangeAgeMin(e: React.ChangeEvent<HTMLInputElement>) {
        if (checkValueAndAlert(e.target.value, 1, 150, 'Age')) setAgeMin(e.target.value);
    }
    function handleOnChangeAgeMax(e: React.ChangeEvent<HTMLInputElement>) {
        if (checkValueAndAlert(e.target.value, 1, 150, 'Age')) setAgeMax(e.target.value);
    }
    //fame
    function handleOnChangeFameMin(e: React.ChangeEvent<HTMLInputElement>) {
        if (checkValueAndAlert(e.target.value, 1, 10, 'Fame')) setFameMin(e.target.value);
    }
    function handleOnChangeFameMax(e: React.ChangeEvent<HTMLInputElement>) {
        if (checkValueAndAlert(e.target.value, 1, 10, 'Fame')) setFameMax(e.target.value);
    }

	//confirm
	function handleConfirmAdvancedSearch() {
		;
	}

	function checkValueAndAlert(value: any, min: number, max: number, type: string): boolean {
		if (isNb(value) || value === '') {
			if (!(value === '')) {
				const nb: number = parseInt(value);
				if (!(nb >= min && nb <= max)) {
					alert(`${type} value must be between ${min} to ${max}`)
					return false;
				}
			}
			return true;
		}
		return false;
	}

	return (<>
	<div className="flex flex-wrap pl-3">
		<div className="pr-5 pb-3">
			<SelectInput 
				title="Gender you are looking for"
				name="gender"
				list={['Female', 'Male', 'Both']}
				onBlur={handleOnChangeGender}
				init={gender}
			/>
		</div>

		<div className="pr-5">
                    <ErrorField
                        name="filterDistMin"
                        title="Distance min"
                        onBlur={handleOnChangeDistMin}
                        init={distMin.toString()}
                        size={spaceFilter}
                        type={'text'}
                        
                    />
                </div>
                <div className="pr-5">
                    <ErrorField
                        name="filterDistMax"
                        title="Distance Max"
                        onBlur={handleOnChangeDistMax}
                        init={distMax.toString()}
                        size={spaceFilter}
                        type={'text'}
                        min={defaultMinMax.distMin}
                        max={defaultMinMax.distMax}
                    />
                </div>

		<div className="pr-5">
                    <ErrorField
                        name="filterAgeMin"
                        title="Age min"
                        onBlur={handleOnChangeAgeMin}
                        init={ageMin.toString()}
                        size={spaceFilter}
                        type={'text'}
                        min={defaultMinMax.ageMin}
                        max={defaultMinMax.ageMax}
                    />
                </div>
                <div className="pr-5">
                    <ErrorField
                        name="filterAgeMax"
                        title="Age Max"
                        onBlur={handleOnChangeAgeMax}
                        init={ageMax ? ageMax.toString() : ''}
                        size={spaceFilter}
                        type={'text'}
                        min={defaultMinMax.ageMin}
                        max={defaultMinMax.ageMax}
                    />
                </div>

				<div className="pr-5">
                    <ErrorField
                        name="filterFameMin"
                        title="Fame min"
                        onBlur={handleOnChangeFameMin}
                        init={fameMin ? fameMin.toString() : ''}
                        size={spaceFilter}
                        type={'text'}
                        min={defaultMinMax.fameMin}
                        max={defaultMinMax.fameMax}
                    />
                </div>
                <div className="pr-5">
                    <ErrorField
                        name="filterFameMax"
                        title="Fame Max"
                        onBlur={handleOnChangeFameMax}
                        init={fameMax ? fameMax.toString() : ''}
                        size={spaceFilter}
                        type={'text'}
                        min={defaultMinMax.fameMin}
                        max={defaultMinMax.fameMax}
                    />
                </div>
				<div className="pr-5 pt-6">
                    <Button
                        text="Search !"
                        type="button"
                        onClick={handleConfirmAdvancedSearch}
                    />
                </div>
				<div>
                    <FilterByTags
                        tagsUser={tagsUser}
                        tagsPossible={defaultMinMax.availableTags}
                        setTagsUser={setTagsUser}
                    />
                </div>
	</div>
	
	</>)
}

export default AdvancedSearch;
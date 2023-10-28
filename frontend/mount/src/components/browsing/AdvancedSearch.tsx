import { useState } from 'react';
import SelectInput from '../elems/SelectInput';
import { ErrorField } from '../elems/ErrorFields';
import { MinMaxInit } from '../../pages/FindPage';
import { FilterByTags } from './FilterByTags';
import Button from '../elems/Button';
import axios from 'axios';
import { MatchingGlobalData } from '../../shared/search';

type AllGenders = 'female' | 'male' | 'Both';

type BodyAdvancedSearch = {
    dist_min: number | null;
    dist_max: number | null;
    age_min: number | null;
    age_max: number | null;
    fame_min: number | null;
    fame_max: number | null;
    gender: AllGenders;
    tags: string[];
    latitude: string | null;
    longitude: string | null;
};

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
};

function isPossibleCoordinate(input: string): boolean {
    const floatPattern = /^[+-]?\d+(\.\d+)?$/;
    return floatPattern.test(input);
}

function isNb(input: string): boolean {
    const floatPattern = /^\d+(\.\d+)?$/;
    return floatPattern.test(input);
}

type PropAdvancedSearch = {
    setAdvancedSearch: any;
	saveReturnFromBackend: any;
};
function AdvancedSearch({
    setAdvancedSearch,
	saveReturnFromBackend,
}: PropAdvancedSearch) {
    const [gender, setGender] = useState<AllGenders>('Both');
    const [latitude, setLatitude] = useState<string>('');
    const [longitude, setLongitude] = useState<string>('');
    const [distMinSearch, setDistMinSearch] = useState<number | ''>('');
    const [distMaxSearch, setDistMaxSearch] = useState<number | ''>('');
    const [ageMinSearch, setAgeMinSearch] = useState<number | ''>('');
    const [ageMaxSearch, setAgeMaxSearch] = useState<number | ''>('');
    const [fameMinSearch, setFameMinSearch] = useState<number | ''>('');
    const [fameMaxSearch, setFameMaxSearch] = useState<number | ''>('');

    const [tagsUser, setTagsUser] = useState<string[]>([]);

    const spaceFilter: number = 50;

    function handleOnChangeGender(e: React.ChangeEvent<HTMLInputElement>) {
        if (
            e.target.value === 'female' ||
            e.target.value === 'male' ||
            e.target.value === 'Both'
        )
            setGender(e.target.value);
    }

    //coordinates
    function handleOnChangeLatitude(e: React.ChangeEvent<HTMLInputElement>) {
        setLatitude(e.target.value);
    }
    function handleOnChangeLongitude(e: React.ChangeEvent<HTMLInputElement>) {
		setLongitude(e.target.value);
    }
    //dist
    function handleOnChangeDistMin(e: React.ChangeEvent<HTMLInputElement>) {
        checkValueAndAlert(
            e.target.value,
            0,
            200000,
            'Distance',
            setDistMinSearch,
        );
    }
    function handleOnChangeDistMax(e: React.ChangeEvent<HTMLInputElement>) {
        checkValueAndAlert(
            e.target.value,
            0,
            200000,
            'Distance',
            setDistMaxSearch,
        );
    }
    //age
    function handleOnChangeAgeMin(e: React.ChangeEvent<HTMLInputElement>) {
        checkValueAndAlert(e.target.value, 1, 150, 'Age', setAgeMinSearch);
    }
    function handleOnChangeAgeMax(e: React.ChangeEvent<HTMLInputElement>) {
        checkValueAndAlert(e.target.value, 1, 150, 'Age', setAgeMaxSearch);
    }
    //fame
    function handleOnChangeFameMin(e: React.ChangeEvent<HTMLInputElement>) {
        checkValueAndAlert(e.target.value, 1, 10, 'Fame', setFameMinSearch);
    }
    function handleOnChangeFameMax(e: React.ChangeEvent<HTMLInputElement>) {
        checkValueAndAlert(e.target.value, 1, 10, 'Fame', setFameMaxSearch);
    }

    //confirm
    async function handleConfirmAdvancedSearch() {
        //verif
        const body: BodyAdvancedSearch = {
            dist_min: distMinSearch !== '' ? distMinSearch : null,
            dist_max: distMaxSearch !== '' ? distMaxSearch : null,
            age_min: ageMinSearch !== '' ? ageMinSearch : null,
            age_max: ageMaxSearch !== '' ? ageMaxSearch : null,
            fame_min: fameMinSearch !== '' ? fameMinSearch : null,
            fame_max: fameMaxSearch !== '' ? fameMaxSearch : null,
            gender: gender,
            tags: tagsUser,
            latitude: latitude !== '' ? latitude : null,
            longitude: longitude !== '' ? longitude : null,
        };

        //exec
        if (await searchInitBackend(body) === false)
			return ;

        setAdvancedSearch(false);
    }

    async function searchInitBackend(body: BodyAdvancedSearch): Promise<boolean> {
        try {
            const response = await axios.post(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/search/advanced`,
                {
                    dist_min: body.dist_min,
                    dist_max: body.dist_max,
                    age_min: body.age_min,
                    age_max: body.age_max,
                    fame_min: body.fame_min,
                    fame_max: body.fame_max,
                    gender: body.gender,
                    tags: body.tags,
                    latitude: body.latitude,
                    longitude: body.longitude,
                },
                {
                    withCredentials: true,
                },
            );
            console.log('advanced search');
            console.log(response.data);
			if (response.data && response.data.message === 'error') {
				if (response.data.error)
					alert(response.data.error);
				else
					alert('Error performing this request');
				return false;
			}

			saveReturnFromBackend(response);

            return true;
        } catch (error) {
            // setRetour(null);
			return false;
        }
    }

    function checkValueAndAlert(
        value: any,
        min: number,
        max: number,
        type: string,
        setter: any,
    ): boolean {
        if (isNb(value) || isPossibleCoordinate(value) || value === '') {
            if (!(value === '')) {
                const nb: number = parseInt(value);
                if (!(nb >= min && nb <= max)) {
                    alert(`${type} value must be between ${min} to ${max}`);
                    return false;
                }
                setter(nb);
                return true;
            }
            setter('');
            return true;
        }
        return false;
    }

    return (
        <>
            <div className="flex flex-wrap pl-3">
                <div className="pr-5 pb-3">
                    <SelectInput
                        title="Gender you are looking for"
                        name="gender"
                        list={['female', 'male', 'Both']}
                        onBlur={handleOnChangeGender}
                        init={gender}
                    />
                </div>
            </div>
            <div className="flex flex-wrap pl-3">
                <div className="pr-5">
                    <ErrorField
                        name="filterLatitudeSearch"
                        title="Latitude"
                        onBlur={handleOnChangeLatitude}
                        init={latitude.toString()}
                        size={spaceFilter}
                        type={'text'}
                    />
                </div>
                <div className="pr-5">
                    <ErrorField
                        name="filterLongitudeSearch"
                        title="Longitude"
                        onBlur={handleOnChangeLongitude}
                        init={longitude.toString()}
                        size={spaceFilter}
                        type={'text'}
                    />
                </div>
            </div>
            <div className="flex flex-wrap pl-3">
                <div className="pr-5">
                    <ErrorField
                        name="filterDistMinSearch"
                        title="Distance min"
                        onBlur={handleOnChangeDistMin}
                        init={distMinSearch.toString()}
                        size={spaceFilter}
                        type={'text'}
                    />
                </div>
                <div className="pr-5">
                    <ErrorField
                        name="filterDistMax"
                        title="Distance Max"
                        onBlur={handleOnChangeDistMax}
                        init={distMaxSearch.toString()}
                        size={spaceFilter}
                        type={'text'}
                    />
                </div>
            </div>
            <div className="flex flex-wrap pl-3">
                <div className="pr-5">
                    <ErrorField
                        name="filterAgeMin"
                        title="Age min"
                        onBlur={handleOnChangeAgeMin}
                        init={ageMinSearch.toString()}
                        size={spaceFilter}
                        type={'text'}
                    />
                </div>
                <div className="pr-5">
                    <ErrorField
                        name="filterAgeMax"
                        title="Age Max"
                        onBlur={handleOnChangeAgeMax}
                        init={ageMaxSearch ? ageMaxSearch.toString() : ''}
                        size={spaceFilter}
                        type={'text'}
                    />
                </div>
            </div>
            <div className="flex flex-wrap pl-3">
                <div className="pr-5">
                    <ErrorField
                        name="filterFameMin"
                        title="Fame min"
                        onBlur={handleOnChangeFameMin}
                        init={fameMinSearch ? fameMinSearch.toString() : ''}
                        size={spaceFilter}
                        type={'text'}
                    />
                </div>
                <div className="pr-5">
                    <ErrorField
                        name="filterFameMax"
                        title="Fame Max"
                        onBlur={handleOnChangeFameMax}
                        init={fameMaxSearch ? fameMaxSearch.toString() : ''}
                        size={spaceFilter}
                        type={'text'}
                    />
                </div>
            </div>
            <div className="flex flex-wrap pl-3">
                <div>
                    <FilterByTags
                        tagsUser={tagsUser}
                        tagsPossible={defaultMinMax.availableTags}
                        setTagsUser={setTagsUser}
                    />
                </div>
            </div>
            <div className="flex flex-wrap pl-3">
                <div className="pr-5 pt-6">
                    <Button
                        text="Search !"
                        type="button"
                        onClick={handleConfirmAdvancedSearch}
                    />
                </div>
            </div>
        </>
    );
}

export default AdvancedSearch;

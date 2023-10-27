import { useState } from 'react';
import { MinMaxInit, OrderBy } from '../../pages/FindPage';
import Button from '../elems/Button';
import { ErrorField } from '../elems/ErrorFields';
import SelectInput from '../elems/SelectInput';
import { FilterByTags } from './FilterByTags';
import AdvancedSearch from './AdvancedSearch';

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
    tagsUser: string[];
    tagsPossible: string[];
    setTagsUser: any;
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
    initMinMax,
    functionButton,
    tagsUser,
    tagsPossible,
    setTagsUser,
}: PropShowFilters) {
    const allFilter: string[] = [
        'Magic',
        'Age',
        'Distance',
        'Rating',
        'Common Tags',
    ];

    const [showFilterOptions, setFilterOptions] = useState<boolean>(false);
	const [showAdvancedSearch, setAdvancedSearch] = useState<boolean>(false);

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        setOrderBy(e.target.value);
    }

    //show filtering options
    function handleShowFilteringOptions() {
        setFilterOptions((prevFilterOptions) => !prevFilterOptions);
		setAdvancedSearch(false);
    }

	function handleClickAdvancedSearch() {
		setAdvancedSearch((prevAvancedSearch) => !prevAvancedSearch);
		setFilterOptions(false);
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
                <div className="pr-5 pt-6 ">
                    <Button
                        text={
                            showFilterOptions
                                ? 'Hide filtering options'
                                : 'Show filtering options'
                        }
                        type="button"
                        onClick={handleShowFilteringOptions}
                    />
                </div>
                <div className="pr-5 pt-6 ">
                    <Button
                        text={'Advanced search'}
                        type="button"
                        onClick={handleClickAdvancedSearch}
                    />
                </div>
            </div>

			{showAdvancedSearch && <AdvancedSearch />}

            {showFilterOptions && (
                <ShowFiltersOptions
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
                    initMinMax={initMinMax}
                    functionButton={functionButton}
                    tagsUser={tagsUser}
                    tagsPossible={tagsPossible}
                    setTagsUser={setTagsUser}
                />
            )}
        </>
    );
}

type PropShowFiltersOptions = {
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
    initMinMax: MinMaxInit;
    functionButton: any;
    tagsUser: string[];
    tagsPossible: string[];
    setTagsUser: any;
};

function ShowFiltersOptions({
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
    initMinMax,
    functionButton,
    tagsUser,
    tagsPossible,
    setTagsUser,
}: PropShowFiltersOptions) {
    const spaceFilter: number = 20;

    //dist
    function handleOnChangeDistMin(e: React.ChangeEvent<HTMLInputElement>) {
        const nb = parseInt(e.target.value);
        if (!isNaN(nb)) {
            if (nb > distMax) {
                alert('Cannot have distance minimum > distance maximum');
                return;
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
        <div>
            <div className="flex flex-wrap pl-3">
                <div className="pr-5">
                    <ErrorField
                        name="filterDistMin"
                        title="Distance min"
                        onBlur={handleOnChangeDistMin}
                        init={distMin ? distMin.toString() : '0'}
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
                        init={distMax ? distMax.toString() : '0'}
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
                        init={ageMin ? ageMin.toString() : '0'}
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
                        init={ageMax ? ageMax.toString() : '0'}
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
                        init={fameMin ? fameMin.toString() : '0'}
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
                        init={fameMax ? fameMax.toString() : '0'}
                        size={spaceFilter}
                        type={'number'}
                        min={initMinMax.fameMin}
                        max={initMinMax.fameMax}
                    />
                </div>
            </div>
            <div className="flex flex-wrap pl-3 pt-3">
                <div>
                    <FilterByTags
                        tagsUser={tagsUser}
                        tagsPossible={tagsPossible}
                        setTagsUser={setTagsUser}
                    />
                </div>
            </div>
            <div className="flex flex-wrap pl-3 pt-3">
                <div className="pr-5">
                    <Button
                        text="Filter"
                        type="button"
                        onClick={functionButton}
                    />
                </div>
            </div>
        </div>
    );
}

export default ShowFilters;

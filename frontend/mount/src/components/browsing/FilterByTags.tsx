import { useEffect, useState } from 'react';

type Prop = {
    tagsUser: string[];
    tagsPossible: string[];
    setTagsUser: any;
};
export function FilterByTags({ tagsUser, tagsPossible, setTagsUser }: Prop) {
    return (
        <>
            <label
                htmlFor={'tags'}
                className="block text-sm font-medium leading-6 text-gray-900"
            >
				Filter by tag:
            </label>

            <ul className="flex flex-wrap font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
                {tagsPossible.map((elem) => (
                    <UniqueTag
                        elem={elem}
						elemChecked={tagsUser.includes(elem)}
                        tagsUser={tagsUser}
                        setTagsUser={setTagsUser}
                        key={elem}
                    />
                ))}
            </ul>
        </>
    );
}

type PropUniqueTag = {
    elem: string;
	elemChecked: boolean;
    tagsUser: string[];
    setTagsUser: any;
};
function UniqueTag({ elem, tagsUser, setTagsUser }: PropUniqueTag) {
	const [elemChecked, setElemChecked] = useState(tagsUser.includes(elem));

    useEffect(() => {
        setElemChecked(tagsUser.includes(elem));
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagsUser, elem]);

    return (
        <div className="flex items-center pl-3" key={elem}>
            <li
                className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r sm:w-full px-2"
                key={elem}
            >
                <input
                    checked={elemChecked}
                    id={elem}
                    type="checkbox"
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    key={elem}
                    onChange={() =>
                        handleChangeCheckbox(
                            !elemChecked,
                            elem,
                            tagsUser,
                            setTagsUser,
							setElemChecked,
                        )
                    }
                />
                <label
                    htmlFor={elem}
                    className="py-3 ml-2 text-sm font-medium text-gray-900"
                >
                    {elem}
                </label>
            </li>
        </div>
    );
}

function handleChangeCheckbox(
    add: boolean,
    elem: string,
    tagsUser: string[],
    setTagsUser: any,
	setElemChecked: any,
) {
    let newList: string[] = [];
    if (add) {
        newList = tagsUser;
        if (!tagsUser.includes(elem)) newList.push(elem);
		setElemChecked(true);
    } else {
        newList = tagsUser.filter((e) => e !== elem);
		setElemChecked(false);
    }
	
    // console.log(newList);
    setTagsUser(newList);
}

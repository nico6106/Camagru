import { useEffect, useState } from 'react';

type Prop = {
    tagsUser: string[];
    tagsPossible: string[];
    setTagsUser: any;
};
export function ShowTags({ tagsUser, tagsPossible, setTagsUser }: Prop) {
    return (
        <>
            <h3 className="block text-sm font-medium leading-6 text-gray-900">
                Interests
            </h3>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
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
    }, [tagsUser, elem]);

    return (
        <div className="flex items-center pl-3" key={elem}>
            <li
                className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r sm:w-full"
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
	
    console.log(newList);
    setTagsUser(newList);
}

// console.log('todo');
// console.log(newList);
// console.log(tagsUser);
// setTagsUser(newList);
// console.log(tagsUser);
// console.log('done');
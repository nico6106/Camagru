type Prop = {
    title: string;
	name?: string;
    nameDefault: string;
    list: string[];
	onBlur: any;
	init?: string;
};

function SelectInput({ title, name='default', nameDefault, list, onBlur, init }: Prop) {
	// const styleSelect: string = `block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900
	// shadow-sm ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6
	//  focus:ring-inset focus:ring-indigo-600 ring-gray-300`
    return (
        <>
            <label
                htmlFor={name}
                className="block text-sm font-medium leading-6 text-gray-900"
            >
                {title}
            </label>
            <select
                id={name}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 "
				onBlur={(e) => {
					onBlur(e);
				}}
				onChange={(e) => onBlur(e)}
				value={init}
			>
                {list.map((elem) => <option value={elem} key={elem}>{elem}</option>)}
            </select>
        </>
    );
}

export default SelectInput;

type Prop = {
	name: string;
	title: string;
	onBlur: any;
	
}

export function ErrorField({name, title, onBlur}: Prop) {
    return (
        <div>
            <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
            >
                {title}
            </label>
            <div className="mt-2">
                <input
                    id={name}
                    name={name}
                    type={name}
                    required
                    className="block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            		onBlur={(e) => onBlur(e)}
				/>
            </div>
        </div>
    );
}

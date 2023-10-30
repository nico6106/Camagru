import { useEffect, useState } from 'react';

type Prop = {
    name: string;
    title: string;
	description?: string;
    onBlur: any;
    init?: string;
};

export function TextareaField({
    name,
    title,
	description='',
    onBlur,
    init = '',
}: Prop) {

    const style = `block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900
	 shadow-sm ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6
	  focus:ring-inset focus:ring-indigo-600 ring-gray-300`;
    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-medium leading-6 text-gray-900"
            >
                {title}
            </label>
            <textarea
                id={name}
                rows={4}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={description}
				value={init}
				onBlur={(e) => {
					onBlur(e);
				}}
				onChange={(e) => onBlur(e)}
            ></textarea>

            {/* <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
            >
                {title}
            </label> */}
            {/* <div className="mt-1">
                <input
                    id={name}
                    name={name}
                    type={name}
                    required
                    className={style}
					value={init}
            		onBlur={(e) => {
						onBlur(e);
						if (setStyleError !== false)
							setStyleError(false);
					}}
					onChange={(e) => onBlur(e)}
				/>
            </div> */}
        </div>
    );
}

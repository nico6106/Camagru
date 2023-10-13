import { useEffect, useState } from "react";

type Prop = {
	name: string;
	title: string;
	onBlur: any;
	styleError?: boolean;
	setStyleError?: any;
	init?: string;
	disabled?: boolean;
}

export function ErrorField({name, title, onBlur, styleError=false, setStyleError=false, init='', disabled=false}: Prop) {
	// 
	// useEffect(() => {
	// 	setStyleError(error); 
	// 	console.log('error='+error+', style='+styleError)
	// }, [error]);
	const style = `block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900
	 shadow-sm ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 sm:text-sm sm:leading-6
	  ${styleError ? `border-2 border-rose-600` : `focus:ring-inset focus:ring-indigo-600 ring-gray-300`}
	  ${disabled && 'bg-gray-300'}`
    return (
        <div>
            <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
            >
                {title}
            </label>
            <div className="mt-1">
                <input
                    id={name}
                    name={name}
                    type={name}
					disabled={disabled}
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
            </div>
        </div>
    );
}

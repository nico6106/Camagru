import { useEffect, useState } from "react";

type PropRange = {
    min: number;
    max: number;
    setValue: any;
	title: string;
    defaultValue?: number;
};
function RangeElem({ min, max, title, setValue, defaultValue }: PropRange) {
    const defaultVal = defaultValue ? defaultValue : Math.abs(max - min) / 2;
    return (
        <>
            <label
                htmlFor="default-range"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
                {title}
            </label>
            <input
                id="default-range"
                type="range"
                min={min}
                max={max}
                value={defaultVal}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
        </>
    );
}

// {/* <div className="pr-5">
// {/* <DoubleRangeElem
// 	min={distMin}
// 	max={distMax}
// 	setValueMin={setDistMin}
// 	setValueMax={setDistMax}
// /> */}
// </div> */}

type PropDoubleRange = {
    min: number;
    max: number;
    setValueMin: any;
    setValueMax: any;
    defaultValue?: number;
};
function DoubleRangeElem({
    min,
    max,
    setValueMin,
    setValueMax,
    defaultValue,
}: PropDoubleRange) {

	var lowerSlider = document.querySelector('#lower') as HTMLInputElement;
	var upperSlider = document.querySelector('#upper') as HTMLInputElement;

	const [lowerVal, setLowerVal] = useState<string>('5')
	const [upperVal, setUpperVal] = useState<string>('45')

	useEffect(() => {
		if (lowerSlider && upperSlider) {
			setLowerVal(parseInt(lowerSlider.value).toString()); // Convertit en chaîne
			setUpperVal(parseInt(upperSlider.value).toString()); // Convertit en chaîne
		
			upperSlider.oninput = function() {
				setLowerVal(lowerSlider.value); // Pas besoin de convertir en nombre
				setUpperVal(upperSlider.value); // Pas besoin de convertir en nombre
				
				if (parseInt(upperVal) < parseInt(lowerVal) + 4) {
					lowerSlider.value = (parseInt(upperVal) - 4).toString(); // Convertit en chaîne
				   
					if (lowerVal === lowerSlider.min) {
						upperSlider.value = '4'; // '4' au lieu de 4 pour la chaîne
					}
				}
			};
		}
	}, [lowerSlider, upperSlider]);
   	
    return (
        <>
            <style>
                {`
				 
				 input[type=range] {
					box-sizing: border-box;
					appearance: none;
					width: 400px;
					margin: 0;
					padding: 0 2px;
					/* Add some L/R padding to ensure box shadow of handle is shown */
					overflow: hidden;
					border: 0;
					border-radius: 1px;
					outline: none;
					background: linear-gradient(grey, grey) no-repeat center;
					/* Use a linear gradient to generate only the 2px height background */
					background-size: 100% 2px;
					pointer-events: none;
				 
					&:active,
					&:focus {
					   outline: none;
					}
				 
					&::-webkit-slider-thumb {
					   height: 28px;
					   width: 28px;
					   border-radius: 28px;
					   background-color: #f00;
					   position: relative;
					   margin: 5px 0;
					   /* Add some margin to ensure box shadow is shown */
					   cursor: pointer;
					   appearance: none;
					   pointer-events: all;
					   box-shadow: 0 1px 4px 0.5px rgba(0, 0, 0, 0.25);
				 
					}
				 }
				 
				 .multi-range {
					position: relative;
					height: 50px;
				 
					input[type=range] {
					   position: absolute;
					   
					   &:nth-child(1) {
						  &::-webkit-slider-thumb::before {
							 background-color: red;
						  }
					   }
				 
					   &:nth-child(2) {
						  background: none;
				 
						  &::-webkit-slider-thumb::before {
							  background-color: grey; 
						  }
					   }
					}
				 }
				  
                `}
            </style>
            <span className="multi-range">
				<input type="range" min="0" max="50" value={lowerVal} id="lower" />
				<input type="range" min="0" max="50" value={upperVal} id="upper" />
			</span>
        </>
    );
}
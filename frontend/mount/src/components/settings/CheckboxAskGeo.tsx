
type Prop = {
	elemChecked: boolean;
	setElemChecked: any;
}
function CheckboxAskGeoModify({ elemChecked, setElemChecked }: Prop) {
	function handleCheck() {
		setElemChecked((prevElemChecked: any) => !prevElemChecked);
	}
	return (<>
		<input
                    checked={elemChecked}
                    id='askGeo'
                    type="checkbox"
                    value=""
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    key='askGeo'
                    onChange={() =>
                        handleCheck()
                    }
                />
                <label
                    htmlFor='askGeo'
                    className="py-3 ml-2 text-sm font-medium text-gray-900"
                >
                    Amend geolocation (force)
                </label>
	</>);
}

export default CheckboxAskGeoModify;
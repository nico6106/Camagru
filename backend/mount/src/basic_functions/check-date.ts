export function isDate(dateString: string): boolean {
    const selectedDate = new Date(dateString);
    const currDate = new Date();
    if (selectedDate.toString() === 'Invalid Date') {
        return false;
    } else {
        const validDate: Date = selectedDate;
        //verif date
        if (
            !(
                validDate.getFullYear() >= 1900 &&
                validDate.getFullYear() <= currDate.getFullYear() - 17
            )
        )
            return false;
		
        return true;
    }
}

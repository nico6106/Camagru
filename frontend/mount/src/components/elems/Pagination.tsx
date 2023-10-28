import { useState } from 'react';

type PropPagination = {
    nbStart: number;
    nbEnd: number;
    nb_tot: number;
    nbPerPage: number; //nbPerPage
    setNbStart: any;
    setNbEnd: any;
};

function Pagination({
    nbStart,
    nbEnd,
    nb_tot,
    nbPerPage,
    setNbStart,
    setNbEnd,
}: PropPagination) {
    const [diff, setDiff] = useState<number>(0);
    function handleOnPrevious(event: any) {
        event.preventDefault();
        // console.log('prev start='+nbStart+', end='+nbEnd+', diff='+diff)
        if (diff !== 0) {
            setNbStart(nbStart - nbPerPage);
            setNbEnd(nbEnd - diff);
            setDiff(0);
        } else if (nbStart - nbPerPage >= 1) {
            setNbStart(nbStart - nbPerPage);
            setNbEnd(nbEnd - nbPerPage);
        } else if (nbStart > 1) {
            setNbStart(1);
            if (nb_tot > nbPerPage) setNbEnd(nbPerPage);
            else setNbEnd(nb_tot);
        }
    }
    function handleOnNext(event: any) {
        event.preventDefault();
        // console.log('next start='+nbStart+', end='+nbEnd+', diff='+diff)
        if (nbEnd + nbPerPage < nb_tot) {
            setNbStart(nbStart + nbPerPage);
            setNbEnd(nbEnd + nbPerPage);
        } else if (nbEnd < nb_tot) {
            setNbStart(nbStart + nbPerPage);
            setNbEnd(nb_tot);
            setDiff(nb_tot - (nbStart + nbPerPage) + 1);
        }
    }
    return (
        <div className="flex flex-col items-center">
            <span className="text-sm text-gray-700 dark:text-gray-400">
                Showing{' '}
                <span className="font-semibold text-gray-900">
                    {nbStart}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-gray-900">
                    {nbEnd}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-gray-900">
                    {nb_tot}
                </span>{' '}
                Entries
            </span>
            <div className="inline-flex mt-2 xs:mt-0">
                <button
                    onClick={handleOnPrevious}
                    className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                    <svg
                        className="w-3.5 h-3.5 mr-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 5H1m0 0 4 4M1 5l4-4"
                        />
                    </svg>
                    Prev
                </button>
                <button
                    onClick={handleOnNext}
                    className="flex items-center justify-center px-3 h-8 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                    Next
                    <svg
                        className="w-3.5 h-3.5 ml-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Pagination;

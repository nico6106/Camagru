import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Prop = {
    pictures: string[];
    visible: string;
    setVisible: any;
};

function ImageCarrousel({ pictures, visible, setVisible }: Prop) {
    const [position, setPosition] = useState<number>(0);

    useEffect(() => {
        if (pictures.length > 0) setVisible(pictures[0]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleNext(event: any) {
        event.preventDefault();
        const currPos = position;
        if (currPos + 1 < pictures.length) {
            setPosition(currPos + 1);
            setVisible(pictures[currPos + 1]);
        } else {
            setPosition(0);
            setVisible(pictures[0]);
        }
    }

    function handlePrevious(event: any) {
        event.preventDefault();
        const currPos = position;
        if (currPos - 1 >= 0) {
            setPosition(currPos - 1);
            setVisible(pictures[currPos - 1]);
        } else {
            setPosition(pictures.length - 1);
            setVisible(pictures[pictures.length - 1]);
        }
    }
    return (
        <>
            <div
                id="default-carousel"
                className="relative w-full"
                data-carousel="static"
            >
                <div className="relative h-96 overflow-hidden rounded-lg md:h-96">
                    {pictures.length === 0 && <ShowImgCarrousel />}
                    {pictures.map((elem) => (
                        <ShowImgCarrousel
                            picture={elem}
                            visible={visible}
                            key={elem}
                        />
                    ))}
                </div>

                <button
                    type="button"
                    className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    data-carousel-prev
                    onClick={handlePrevious}
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg
                            className="w-4 h-4 text-white dark:text-gray-800"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 1 1 5l4 4"
                            />
                        </svg>
                        <span className="sr-only">Previous</span>
                    </span>
                </button>
                <button
                    type="button"
                    className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    data-carousel-next
                    onClick={handleNext}
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg
                            className="w-4 h-4 text-white dark:text-gray-800"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 9 4-4-4-4"
                            />
                        </svg>
                        <span className="sr-only">Next</span>
                    </span>
                </button>
            </div>
        </>
    );
}

type PropShowImg = {
    picture?: string;
    visible?: string;
};
function ShowImgCarrousel({ picture, visible }: PropShowImg) {
    const link: string = picture
        ? `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image/${picture}`
        : '/carousel-2.svg';
    const classDiv: string = `${
        !picture || picture === visible ? '' : 'hidden'
    } duration-700 ease-in-out`;
	const altImg: string = `picture ${picture}`;
    const navigate = useNavigate();

    function onClickImg() {
        navigate(`/profile/image/${picture}`);
    }
    return (
        <div className={classDiv} data-carousel-item>
            <img
                src={link}
                className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                alt={altImg}
                onClick={onClickImg}
            />
        </div>
    );
}

export default ImageCarrousel;
